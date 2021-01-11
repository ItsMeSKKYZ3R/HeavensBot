const { Util, MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    name: "skip",
    description: "To skip the current music",

    async execute(client, message, args) {
        const channel = message.member.voice.channel;
        if (!channel)
            return sendError(
                "Vous devez être dans un salon vocal !",
                message.channel
            );
        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue)
            return sendError("Il n'y a rien dans la queue.", message.channel);
        if (!serverQueue.connection) return;
        if (!serverQueue.connection.dispatcher) return;
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            let xd = new MessageEmbed()
                .setDescription("▶ J'ai redémarré la musique pour vous !")
                .setColor("YELLOW")
                .setTitle("La musique a été redémarrée !");

            return message.channel.send(xd).catch((err) => console.log(err));
        }

        try {
            serverQueue.connection.dispatcher.end();
        } catch (error) {
            serverQueue.voiceChannel.leave();
            client.queue.delete(message.guild.id);
            return sendError(
                `:notes: Une erreur est survenue, la musique a été arrêtée et la queue vidée. Erreur : \`${error}\``,
                message.channel
            );
        }
        message.react("✅");
    },
};
