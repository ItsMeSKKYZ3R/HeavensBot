const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    name: "skipto",
    description: "Passe jusqu'à la musique demandé",

    async execute(client, message, args) {
        if (!args.length || isNaN(args[0]))
            return message.channel
                .send({
                    embed: {
                        color: "GREEN",
                        description: `**Utilisation** : \`${prefix}skipto <position>\``,
                    },
                })
                .catch(console.error);

        const queue = client.queue.get(message.guild.id);
        if (!queue)
            return sendError(
                "Il n'y a rien dans la queue.",
                message.channel
            ).catch(console.error);
        if (args[0] > queue.songs.length)
            return sendError(
                `La playlist contient uniquement cette musique !`,
                message.channel
            ).catch(console.error);

        queue.playing = true;

        if (queue.loop) {
            for (let i = 0; i < args[0] - 2; i++) {
                queue.songs.push(queue.songs.shift());
            }
        } else {
            queue.songs = queue.songs.slice(args[0] - 2);
        }
        try {
            queue.connection.dispatcher.end();
        } catch (error) {
            queue.voiceChannel.leave();
            client.queue.delete(message.guild.id);
            return sendError(
                `:notes: Une erreur est survenue, la musique a été arrêtée et la queue vidée. Erreur : \`${error}\``,
                message.channel
            );
        }

        queue.textChannel
            .send({
                embed: {
                    color: "GREEN",
                    description: `${message.author} ⏭ passé avec succès \`${
                        args[0] - 1
                    }\` musique(s) restante(s)`,
                },
            })
            .catch(console.error);
        message.react("✅");
    },
};
