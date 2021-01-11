const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "config-level",
    description: "Permet d'activer ou de désactiver le système de niveaux",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {*} args
     */

    execute(bot, message, args) {
        message.channel.send("OK");
    },
};
