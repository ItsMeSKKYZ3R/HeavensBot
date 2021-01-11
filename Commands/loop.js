const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    name: "loop",
    description: "",
    async execute(bot, message, args) {
        const serverQueue = bot.queue.get(message.guild.id);
        if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            return message.channel.send({
                embed: {
                    color: "GREEN",
                    description: `🔁  **|**  Le loop est **\`${
                        serverQueue.loop === true ? "activé" : "désactivé"
                    }\`**`,
                },
            });
        }
        return sendError(
            "Aucune musique ne se lit sur le salon vocal.",
            message.channel
        );
    },
};
