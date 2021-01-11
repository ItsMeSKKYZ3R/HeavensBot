const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    name: "volume",
    description: "To change the server song queue volume",

    async execute(client, message, args) {
        const channel = message.member.voice.channel;
        if (!channel)
            return sendError(
                "Vous devez être dans un salon vocal !",
                message.channel
            );
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue)
            return sendError(
                "Rien ne se joue dans le serveur.",
                message.channel
            );
        if (!args[0])
            return message.channel.send(
                `Le volume est actuemment de : **${serverQueue.volume}**`
            );
        if (isNaN(args[0]))
            return message.channel
                .send(":notes: Vous devez entrer un nombre pas des lettres !")
                .catch((err) => console.log(err));
        if (parseInt(args[0]) > 150 || args[0] < 0)
            return sendError(
                "Le volume ne peut pas être supérieur à 100 et inférieur à 0",
                message.channel
            ).catch((err) => console.log(err));
        serverQueue.volume = args[0];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
        let xd = new MessageEmbed()
            .setDescription(
                `J'ai redéfinit le volume sur : **${args[0] / 1}/100**`
            )
            .setAuthor(
                "Manager de volume",
                "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif"
            )
            .setColor("BLUE");
        return message.channel.send(xd);
    },
};
