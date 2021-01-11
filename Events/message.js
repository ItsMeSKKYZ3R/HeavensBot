const Discord = require("discord.js");
const fs = require("fs");
let dbprefix = require("../Commands/db/prefix.json");

module.exports = (bot, message) => {
    let prefix;

    if (!dbprefix[`${message.guild.id}`]) {
        prefix = "!";
    } else {
        prefix = dbprefix[`${message.guild.id}`];
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    let commande = bot.commands.get(command);

    if (!commande) {
        return;
    } else {
        commande.execute(bot, message, args);
    }
};
