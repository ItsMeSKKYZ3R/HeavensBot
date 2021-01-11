const { Client, Message, MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    name: "nowplaying",
    description: "",
    async execute(client, message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue)
            return sendError("Aucune musique n'est en cours.", message.channel);
        let song = serverQueue.songs[0];
        let thing = new MessageEmbed()
            .setAuthor(
                "Now Playing",
                "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif"
            )
            .setThumbnail(song.img)
            .setColor("BLUE")
            .addField("Nom", song.title, true)
            .addField("Durée", song.duration, true)
            .addField("Demandée par", song.req.tag, true)
            .setFooter(`Nombre de vues : ${song.views} | ${song.ago}`);
        return message.channel.send(thing);
    },
};
