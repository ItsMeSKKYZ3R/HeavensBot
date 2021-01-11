const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytdlDiscord = require("ytdl-core-discord");
const YouTube = require("youtube-sr");
const sendError = require("../util/error");
const fs = require("fs");

module.exports = {
    name: "search",
    description: "",
    async execute(client, message, args) {
        let channel = message.member.voice.channel;
        if (!channel)
            return sendError(
                "Vous devez être dans un salon vocal pour jouer de la musique",
                message.channel
            );

        const permissions = channel.permissionsFor(client.user);
        if (!permissions.has("CONNECT"))
            return sendError(
                "Je n'ai pas la permission de me connecter à votre salon vocal !",
                message.channel
            );
        if (!permissions.has("SPEAK"))
            return sendError(
                "Je n'ai pas la permission de parler dans votre salon vocal !",
                message.channel
            );

        var searchString = args.join(" ");
        if (!searchString)
            return sendError(
                "Vous n'avez pas précisé de recherche.",
                message.channel
            );

        var serverQueue = client.queue.get(message.guild.id);
        try {
            var searched = await YouTube.search(searchString, { limit: 10 });
            if (searched[0] == undefined)
                return sendError(
                    "Je n'ai pas pu trouver la musique sur YouTube.",
                    message.channel
                );
            let index = 0;
            let embedPlay = new MessageEmbed()
                .setColor("BLUE")
                .setAuthor(
                    `Résultats pour \"${args.join(" ")}\"`,
                    message.author.displayAvatarURL()
                )
                .setDescription(
                    `${searched
                        .map(
                            (video2) =>
                                `**\`${++index}\`  |** [\`${video2.title}\`](${
                                    video2.url
                                }) - \`${video2.durationFormatted}\``
                        )
                        .join("\n")}`
                )
                .setFooter(
                    "Entrez la position de la musique pour l'ajouter à la playlist"
                );
            // eslint-disable-next-line max-depth
            message.channel.send(embedPlay).then((m) =>
                m.delete({
                    timeout: 15000,
                })
            );
            try {
                var response = await message.channel.awaitMessages(
                    (message2) => message2.content > 0 && message2.content < 11,
                    {
                        max: 1,
                        time: 20000,
                        errors: ["time"],
                    }
                );
            } catch (err) {
                console.error(err);
                return message.channel.send({
                    embed: {
                        color: "RED",
                        description:
                            "Rien n'a été donné dans les 20 dernières secondes. Commande annulée.",
                    },
                });
            }
            const videoIndex = parseInt(response.first().content);
            var video = await searched[videoIndex - 1];
        } catch (err) {
            console.error(err);
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: "🆘  **|**  Je n'ai trouvé aucun résultat.",
                },
            });
        }

        response.delete();
        var songInfo = video;

        const song = {
            id: songInfo.id,
            title: Util.escapeMarkdown(songInfo.title),
            views: String(songInfo.views).padStart(10, " "),
            ago: songInfo.uploadedAt,
            duration: songInfo.durationFormatted,
            url: `https://www.youtube.com/watch?v=${songInfo.id}`,
            img: songInfo.thumbnail.url,
            req: message.author,
        };

        if (serverQueue) {
            serverQueue.songs.push(song);
            let thing = new MessageEmbed()
                .setAuthor(
                    "La musique a été ajouté ààà la queue.",
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
        client.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        const play = async (song) => {
            const queue = client.queue.get(message.guild.id);
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
                        if (queue) {
                            queue.songs.shift();
                            play(queue.songs[0]);
                            return sendError(
                                `Une erreur est survenue.\nErreur :  \`${er}\``,
                                message.channel
                            );
                        }
                    }
                });
            }

            queue.connection.on("disconnect", () =>
                client.queue.delete(message.guild.id)
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
                    "La musique est lancée !",
                    "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif"
                )
                .setThumbnail(song.img)
                .setColor("BLUE")
                .addField("Nom", song.title, true)
                .addField("Durée", song.duration, true)
                .addField("Demandée par", song.req.tag, true)
                .setFooter(`Nombre de vues : ${song.views} | ${song.ago}`);
            queue.textChannel.send(thing);
        };

        try {
            const connection = await channel.join();
            queueConstruct.connection = connection;
            channel.guild.voice.setSelfDeaf(true);
            play(queueConstruct.songs[0]);
        } catch (error) {
            console.error(`Je ne peux pas rejoindre le salon vocal : ${error}`);
            client.queue.delete(message.guild.id);
            await channel.leave();
            return sendError(
                `Je ne peux pas rejoindre le salon vocal : ${error}`,
                message.channel
            );
        }
    },
};
