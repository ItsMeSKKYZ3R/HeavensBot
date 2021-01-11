const { Client, Message, MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const sendError = require("../util/error");

module.exports = {
    name: "find-lyrics",
    description: "",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {*} args
     */

    async execute(bot, message, args) {
        const song = args.join(" ");

        let lyrics = null;

        try {
            lyrics = await lyricsFinder(song, "");

            if (!lyrics) lyrics = `Je n'ai pas trouvé de paroles pour ${song}.`;
        } catch (error) {
            lyrics = `Je n'ai pas trouvé de paroles pour ${song}.`;
        }

        let lyricsEmbed = new MessageEmbed()
            .setAuthor(
                `${song} — Lyrics`,
                "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif"
            )
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
