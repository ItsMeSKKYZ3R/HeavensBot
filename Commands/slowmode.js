const { Client, Message, MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const ms = require("ms");

module.exports = {
    name: "slowmode",
    description: "",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {Array<String|Number>} args
     */

    execute(bot, message, args) {
        if (!message.member.hasPermission("MANAGE_CHANNELS"))
            return sendError(
                "Vous n'avez pas la permission de changer le temps de slowmode sur le serveur",
                message.channel
            );

        let rate = args[0];

        if (!rate)
            return sendError("Veuillez préciser un temps", message.channel);

        if (rate.includes("h")) {
            rate = rate.replace("h", "");
            rate = rate * 60 * 60 * 1000;
        }

        if (ms(rate) > 6 * 60 * 60 * 1000)
            return sendError(
                "Le slowmode ne peut pas être supérieur à 6 heures",
                message.channel
            );

        if (ms(rate) < 0)
            return sendError(
                "Le slowmode ne peut pas être inférieur 0s",
                message.channel
            );

        if (
            rate !== "0s" &&
            rate !== "5s" &&
            rate !== "10s" &&
            rate !== "15s" &&
            rate !== "30s" &&
            rate !== "1m" &&
            rate !== "2m" &&
            rate !== "5m" &&
            rate !== "10m" &&
            rate !== "30m" &&
            rate !== "1h" &&
            rate !== "2h" &&
            rate !== "6h"
        )
            return sendError(
                "Le temps n'est pas valide. Le temps doit être un des suivants :\n0s\n\n5s\n\n10s\n\n15s\n\n30s\n\n1m\n\n2m\n\n5m\n\n10m\n\n15m\n\n30m\n\n1h\n\n2h\n\n6h",
                message.channel
            );

        rate = Number(ms(rate));

        if (rate === message.channel.rateLimitPerUser)
            return sendError(
                `Le slowmode est déjà sur ${ms(rate).replace("ms", "s")}`,
                message.channel
            );

        message.channel.setRateLimitPerUser(rate);

        rate = args[0];

        let embed = new MessageEmbed()
            .setTitle("Slowmode définit avec succès")
            .setDescription(`Le slowmode est définit sur ${rate} avec succès`)
            .setColor("#00ff00")
            .setFooter(`© ${bot.user.username}`, bot.user.displayAvatarURL())
            .setTimestamp(new Date());

        message.channel.send(embed);
    },
};
