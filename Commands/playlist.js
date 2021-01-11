const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytdlDiscord = require("ytdl-core-discord");
var ytpl = require("ytpl");
const sendError = require("../util/error");
const fs = require("fs");

module.exports = {
    name: "playlist",
    description: "",
    async execute(client, message, args) {
        const json = require("ezyjson");
        const loc = require("../db.json");

        const dbPrefix = new json(`${loc.prefix}`);

        if (message.author.bot) return;

        let Prefix;

        if (dbPrefix.getValue(`${message.guild.id}`)) {
            Prefix = dbPrefix.getValue(`${message.guild.id}`);
        } else {
            Prefix = "!";
        }

        const prefix = Prefix;

        const channel = message.member.voice.channel;
        if (!channel)
            return sendError(
                "Vous devez être dans un salon vocal !",
                message.channel
            );
        const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
        var searchString = args.join(" ");
        const permissions = channel.permissionsFor(client.user);
        if (!permissions.has("CONNECT"))
            return sendError(
                "Je n'ai pas la permission de me connecter !",
                message.channel
            );
        if (!permissions.has("SPEAK"))
            return sendError(
                "Je n'ai pas la permission de parler !",
                message.channel
            );

        if (!searchString || !url)
            return sendError(
                `Utilisation : ${prefix}playlist <YouTube Playlist URL | Playlist Name>`,
                message.channel
            );
        if (
            url.match(
                /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/
            )
        ) {
            try {
                const playlist = await ytpl(url.split("list=")[1]);
                if (!playlist)
                    return sendError("Playlist not found", message.channel);
                const videos = await playlist.items;
                for (const video of videos) {
                    // eslint-disable-line no-await-in-loop
                    await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
                }
                return message.channel.send({
                    embed: {
                        color: "GREEN",
                        description: `✅  **|**  Playlist : **\`${videos[0].title}\`** a été ajouté à la queue.`,
                    },
                });
            } catch (error) {
                console.error(error);
                return sendError(
                    "Playlist introuvable :(",
                    message.channel
                ).catch(console.error);
            }
        } else {
            try {
                var searched = await yts.search(searchString);

                if (searched.playlists.length === 0)
                    return sendError(
                        "Je n'ai pas trouvé la playlist",
                        message.channel
                    );
                var songInfo = searched.playlists[0];
                let listurl = songInfo.listId;
                const playlist = await ytpl(listurl);
                const videos = await playlist.items;
                for (const video of videos) {
                    // eslint-disable-line no-await-in-loop
                    await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
                }
                let thing = new MessageEmbed()
                    .setAuthor(
                        "La playlist a été ajouté à la queue",
                        "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif"
                    )
                    .setThumbnail(songInfo.thumbnail)
                    .setColor("GREEN")
                    .setDescription(
                        `✅  **|**  Playlist : **\`${songInfo.title}\`** a été ajouté \`${songInfo.videoCount}\` vidéos ont été ajoutées`
                    );
                return message.channel.send(thing);
            } catch (error) {
                return sendError(
                    "Une erreur est survenue",
                    message.channel
                ).catch(console.error);
            }
        }

        async function handleVideo(video, message, channel, playlist = false) {
            const serverQueue = client.queue.get(message.guild.id);
            const song = {
                id: video.id,
                title: Util.escapeMarkdown(video.title),
                views: video.views ? video.views : "-",
                ago: video.ago ? video.ago : "-",
                duration: video.duration,
                url: `https://www.youtube.com/watch?v=${video.id}`,
                img: video.thumbnail,
                req: message.author,
            };
            if (!serverQueue) {
                const queueConstruct = {
                    textChannel: message.channel,
                    voiceChannel: channel,
                    connection: null,
                    songs: [],
                    volume: 80,
                    playing: true,
                    loop: false,
                };
                client.queue.set(message.guild.id, queueConstruct);
                queueConstruct.songs.push(song);

                try {
                    var connection = await channel.join();
                    queueConstruct.connection = connection;
                    play(message.guild, queueConstruct.songs[0]);
                } catch (error) {
                    console.error(
                        `Je ne peux pas rejoindre le salon vocal : ${error}`
                    );
                    client.queue.delete(message.guild.id);
                    return sendError(
                        `Je ne peux pas rejoindre le salon vocal : ${error}`,
                        message.channel
                    );
                }
            } else {
                serverQueue.songs.push(song);
                if (playlist) return;
                let thing = new MessageEmbed()
                    .setAuthor(
                        "La musique a été ajoutée",
                        "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif"
                    )
                    .setThumbnail(song.img)
                    .setColor("YELLOW")
                    .addField("Nom", song.title, true)
                    .addField("Durée", song.duration, true)
                    .addField("Demandée par", song.req.tag, true)
                    .setFooter(`Vues: ${song.views} | ${song.ago}`);
                return message.channel.send(thing);
            }
            return;
        }

        async function play(guild, song) {
            const serverQueue = client.queue.get(message.guild.id);
            let afk = JSON.parse(fs.readFileSync("./afk.json", "utf8"));
            if (!afk[message.guild.id])
                afk[message.guild.id] = {
                    afk: false,
                };
            var online = afk[message.guild.id];
            if (!song) {
                if (!online.afk) {
                    sendError(
                        "J'ai quitté le salon car vous n'avez pas demandé à ce que j'y reste 24/7. Si vous le voulez, faites la commande `!afk`",
                        message.channel
                    );
                    message.guild.me.voice.channel.leave(); //If you want your bot stay in vc 24/7 remove this line :D
                    client.queue.delete(message.guild.id);
                }
                return client.queue.delete(message.guild.id);
            }
            let stream = null;
            if (song.url.includes("youtube.com")) {
                stream = await ytdl(song.url);
                stream.on("error", function (er) {
                    if (er) {
                        if (serverQueue) {
                            serverQueue.songs.shift();
                            play(guild, serverQueue.songs[0]);
                            return sendError(
                                `Une erreur est survenue.\nRaison possible \`${er}\``,
                                message.channel
                            );
                        }
                    }
                });
            }

            serverQueue.connection.on("disconnect", () =>
                client.queue.delete(message.guild.id)
            );
            const dispatcher = serverQueue.connection
                .play(
                    ytdl(song.url, {
                        quality: "highestaudio",
                        highWaterMark: 1 << 25,
                        type: "opus",
                    })
                )
                .on("finish", () => {
                    const shiffed = serverQueue.songs.shift();
                    if (serverQueue.loop === true) {
                        serverQueue.songs.push(shiffed);
                    }
                    play(guild, serverQueue.songs[0]);
                });

            dispatcher.setVolume(serverQueue.volume / 100);
            let thing = new MessageEmbed()
                .setAuthor(
                    "Musique démarrée !",
                    "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif"
                )
                .setThumbnail(song.img)
                .setColor("BLUE")
                .addField("Nom", song.title, true)
                .addField("Durée", song.duration, true)
                .addField("Demandée par", song.req.tag, true)
                .setFooter(`Vues : ${song.views} | ${song.ago}`);
            serverQueue.textChannel.send(thing);
        }
    },
};
