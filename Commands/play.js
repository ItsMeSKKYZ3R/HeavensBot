const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const ytdlDiscord = require("ytdl-core-discord");
const yts = require("yt-search");
const fs = require("fs");
const sendError = require("../util/error");

module.exports = {
    name: "play",
    description: "Joue une musique",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {*} args
     */

    async execute(bot, message, args) {
        let channel = message.member.voice.channel;
        if (!channel)
            return sendError(
                "Vous devez être dans un salon vocal !",
                message.channel
            );

        const permissions = channel.permissionsFor(bot.user);
        if (!permissions.has("CONNECT"))
            return sendError(
                "Je n'ai pas la permission de me connecter dans le salon !",
                message.channel
            );
        if (!permissions.has("SPEAK"))
            return sendError(
                "Je n'ai pas la permission de parler dans ce salon !",
                message.channel
            );

        let searchString = args.join(" ");
        if (!searchString)
            return sendError(
                "Veuillez spécifier une musique !",
                message.channel
            );
        const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
        let serverQueue = bot.queue.get(message.guild.id);

        let songInfo = null;
        let song = null;
        if (
            url.match(
                /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi
            )
        ) {
            try {
                songInfo = await ytdl.getInfo(url);
                if (!songInfo)
                    return sendError(
                        "Je n'ai pas trouvé la musique sur YouTube",
                        message.channel
                    );
                song = {
                    id: songInfo.videoDetails.videoId,
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    img:
                        songInfo.player_response.videoDetails.thumbnail
                            .thumbnails[0].url,
                    duration: songInfo.videoDetails.lengthSeconds,
                    ago: songInfo.videoDetails.publishDate,
                    views: String(songInfo.videoDetails.viewCount).padStart(
                        10,
                        " "
                    ),
                    req: message.author,
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        } else {
            try {
                let searched = await yts.search(searchString);
                if (searched.videos.length === 0)
                    return sendError(
                        "Je n'ai pas trouvé la musique sur YouTube",
                        message.channel
                    );

                songInfo = searched.videos[0];
                song = {
                    id: songInfo.videoId,
                    title: Util.escapeMarkdown(songInfo.title),
                    views: String(songInfo.views).padStart(10, " "),
                    url: songInfo.url,
                    ago: songInfo.ago,
                    duration: songInfo.duration.toString(),
                    img: songInfo.image,
                    req: message.author,
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        }

        if (serverQueue) {
            serverQueue.songs.push(song);
            let thing = new MessageEmbed()
                .setAuthor(
                    "La musique a été ajouté à la queue",
                    "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif"
                )
                .setThumbnail(song.img)
                .setColor("YELLOW")
                .addField("Nom", song.title, true)
                .addField("Durée", song.duration, true)
                .addField("Demandée par", song.req.tag, true)
                .setFooter(`Nombre de vues : ${song.views} | ${song.ago}`);
            return message.channel.send(thing);
        }

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: channel,
            connection: null,
            songs: [],
            volume: 80,
            playing: true,
            loop: false,
        };
        bot.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        const play = async (song) => {
            const queue = bot.queue.get(message.guild.id);
            let afk = JSON.parse(fs.readFileSync("./afk.json", "utf8"));
            if (!afk[message.guild.id])
                afk[message.guild.id] = {
                    afk: false,
                };

            let online = afk[message.guild.id];
            if (!song) {
                if (!online.afk) {
                    sendError(
                        "J'ai quitté le salon car vous n'avez pas demandé à ce que j'y reste 24/7. Si vous le voulez, faites la commande `!afk`",
                        message.channel
                    );
                    message.guild.me.voice.channel.leave();
                    bot.queue.delete(message.guild.id);
                }
                return bot.queue.delete(message.guild.id);
            }
            let stream = null;
            if (song.url.includes("youtube.com")) {
                stream = await ytdl(song.url);
                stream.on("error", function (er) {
                    if (er) {
                        if (queue) {
                            queue.songs.shift();
                            play(queue.songs[0]);
                            return sendError(
                                `An unexpected error has occurred.\nPossible type \`${er}\``,
                                message.channel
                            );
                        }
                    }
                });
            }
            queue.connection.on(
                "disconnect",
                () => console.log("OK")
                /*bot.queue.delete(message.guild.id)*/
            );

            const dispatcher = queue.connection
                .play(
                    ytdl(song.url, {
                        quality: "highestaudio",
                        highWaterMark: 1 << 25,
                        type: "opus",
                    })
                )
                .on("finish", () => {
                    const shiffed = queue.songs.shift();
                    if (queue.loop === true) {
                        queue.songs.push(shiffed);
                    }
                    play(queue.songs[0]);
                });

            dispatcher.setVolumeLogarithmic(queue.volume / 100);
            let thing = new MessageEmbed()
                .setAuthor(
                    "Started Playing Music!",
                    "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif"
                )
                .setThumbnail(song.img)
                .setColor("BLUE")
                .addField("Name", song.title, true)
                .addField("Duration", song.duration, true)
                .addField("Requested by", song.req.tag, true)
                .setFooter(`Views: ${song.views} | ${song.ago}`);
            queue.textChannel.send(thing);
        };

        try {
            const connection = await channel.join();
            queueConstruct.connection = connection;
            play(queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            bot.queue.delete(message.guild.id);
            await channel.leave();
            return sendError(
                `I could not join the voice channel: ${error}`,
                message.channel
            );
        }
    },
};
