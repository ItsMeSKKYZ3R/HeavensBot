const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    name: "remove",
    description: "",
    async execute(client, message, args) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue)
            return sendError("Il n'y a rien à suivre.", message.channel).catch(
                console.error
            );
        if (!args.length)
            return sendError(
                `Il manque un argument. Utilisation : ${client.config.prefix}\`remove <position>\``
            );
        if (isNaN(args[0]))
            return sendError(
                `La position doit être un nombre. Utilisation : ${client.config.prefix}\`remove <numéro>\``
            );
        if (queue.songs.length == 1)
            return sendError("Il n'y a rien à suivre.", message.channel).catch(
                console.error
            );
        if (args[0] > queue.songs.length)
            return sendError(
                `Il n'y a seulement que ${queue.songs.length} musique(s) dans la queue.`,
                message.channel
            ).catch(console.error);
        try {
            const song = queue.songs.splice(args[0] - 1, 1);
            sendError(
                `❌ **|** La musique "**\`${song[0].title}\`**" a été retirée de la queue.`,
                queue.textChannel
            ).catch(console.error);
            message.react("✅");
        } catch (error) {
            return sendError(
                `:notes: Une erreur est survenue.\n Erreur : ${error}`,
                message.channel
            );
        }
    },
};
