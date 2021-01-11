const moment = require("moment");
const fs = require("fs");
const sendError = require("../util/error");
const warns = JSON.parse(fs.readFileSync("./Commands/db/warns.json"));
const { Client, Message, MessageEmbed } = require("discord.js");
const { relativeTimeRounding } = require("moment");

moment.locale("fr");

module.exports = {
    name: "infractions",
    description: "",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {*} args
     */

    async execute(bot, message, args) {
        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.channel.send(
                "Vous n'avez pas la permission d'utiliser cette commande."
            );

        const user = message.mentions.members.first();

        if (!user)
            return message.channel.send(
                "Veuillez mentionner le membre dont voir les warns."
            );

        if (warns[`${message.guild.id}`]) {
            if (warns[`${message.guild.id}`][`${user.id}`]) {
                let memberWarns = await warns[`${message.guild.id}`][
                    `${user.id}`
                ];

                let warnEmbed = new MessageEmbed()
                    .setTitle(`Liste de warns de ${user.user.username}`)
                    .setColor("#ffae00");

                for (let i = 0; i < memberWarns.warns.length; i++) {
                    let warn = memberWarns.warns[i];

                    if (i <= 9) {
                        warnEmbed.addField(
                            `Warn n°${warn.id}`,
                            `${warn.reason} (Par ${warn.mod.modName})`
                        );
                    }
                }

                message.channel.send(warnEmbed);
            } else {
                message.reply("Le membre n'a aucun warn.");
            }
        } else {
            message.reply("Le membre n'a aucun warn.");
        }
    },
};
