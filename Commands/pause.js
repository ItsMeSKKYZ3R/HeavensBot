const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    name: "pause",
    description: "",
    async execute(client, message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            try {
                serverQueue.connection.dispatcher.pause();
            } catch (error) {
                message.client.queue.delete(message.guild.id);
                return sendError(
                    `:notes: La musique a été arrêtée et la queue vidée : ${error}`,
                    message.channel
                );
            }
            let xd = new MessageEmbed()
                .setDescription("⏸ En pause !")
                .setColor("YELLOW")
                .setTitle("La musique a été mise en pause !");
            return message.channel.send(xd);
        }
        return sendError(
            "Aucune musique ne se joue sur le salon vocal.",
            message.channel
        );
    },
};
