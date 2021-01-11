const { Client, Message, MessageEmbed } = require("discord.js");
const MessageCollector = require("../messageCollector.js");
const MsgCollector = require("../messageCollector.js");

module.exports = {
    name: "play-number",
    description: "",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {} args
     */

    execute(bot, message, args) {
        let questions = new MessageCollector(message);

        questions.ask();
    },
};
