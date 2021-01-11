const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    name: "resume",
    description: "",
    async execute(client, message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            let xd = new MessageEmbed()
                .setDescription("▶ J'ai redémarré la musique pour vous !")
                .setColor("YELLOW")
                .setAuthor(
                    "La musique a été redémarrée !",
                    "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif"
                );
            return message.channel.send(xd);
        }
        return sendError(
            "There is nothing playing in this server.",
            message.channel
        );
    },
};
