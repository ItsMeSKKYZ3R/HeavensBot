const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    name: "stop",
    description: "To stop the music and clearing the queue",

    async execute(client, message, args) {
        const channel = message.member.voice.channel;
        if (!channel)
            return sendError(
                "Vous devez être dans un salon vocal !",
                message.channel
            );
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue)
            return sendError("Rien ne se joue actuellement.", message.channel);
        if (!serverQueue.connection) return;
        if (!serverQueue.connection.dispatcher) return;
        try {
            serverQueue.connection.dispatcher.end();
        } catch (error) {
            message.guild.me.voice.channel.leave();
            message.client.queue.delete(message.guild.id);
            return sendError(
                `:notes: La musique a été arrêtée et la queue vidée.: ${error}`,
                message.channel
            );
        }
        message.client.queue.delete(message.guild.id);
        serverQueue.songs = [];
        message.react("✅");
    },
};
