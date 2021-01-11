const { Client, Message, MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const sendError = require("../util/error");

module.exports = {
    name: "lyrics",
    description: "",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {*} args
     */

    async execute(bot, message, args) {
        const queue = bot.queue.get(message.guild.id);
        if (!queue)
            return sendError(
                "Quelque chose s'est mal passé.",
                message.channel
            ).catch(console.error);

        let lyrics = null;

        try {
            lyrics = await lyricsFinder(queue.songs[0].title, "");

            if (!lyrics)
                lyrics = `Je n'ai pas trouvé de paroles pour ${queue.songs[0].title}.`;
        } catch (error) {
            lyrics = `Je n'ai pas trouvé de paroles pour ${queue.songs[0].title}.`;
        }

        let lyricsEmbed = new MessageEmbed()
            .setAuthor(
                `${queue.songs[0].title} — Lyrics`,
                "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif"
            )
            .setThumbnail(queue.songs[0].img)
            .setColor("YELLOW")
            .setDescription(lyrics)
            .setTimestamp();

        if (lyricsEmbed.description.length >= 2048)
            lyricsEmbed.description = `${lyricsEmbed.description.substr(
                0,
                2045
            )}...`;
        return message.channel.send(lyricsEmbed).catch(console.error);
    },
};
