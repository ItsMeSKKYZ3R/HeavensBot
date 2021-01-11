const Discord = require("discord.js");
const loc = require("../dbloc.json");
const json = require("ezyjson");

let dbBvnChannel = new json(`${loc.loc}/bvnChannel.json`);
let dbBvnMsg = new json(`${loc.loc}/bvnMessage.json`);
let dbLogs = new json(`${loc.loc}/dblogs.json`);
let dbSpamLvl = new json(`${loc.loc}/dbSpamLvl.json`);
let dbMsgVerify = new json(`${loc.loc}/dbMsgVerify.json`);
let money = new json(`${loc.loc}/money.json`);
let recent = new json(`${loc.loc}/recent.json`);
let warns = new json(`${loc.loc}/warns.json`);
let roles = new json(`${loc.loc}/roles.json`);

module.exports = {
    name: "warn",
    description: "Avertissez un membre",
    execute(bot, message, args) {
        let toWarn = message.mentions.members.first();

        if (!toWarn) {
            let embed = new Discord.MessageEmbed()
                .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL()
                )
                .setDescription("Vous devez spécifier un utilisateur.")
                .setColor("#ff0000")
                .setFooter(
                    `© ${bot.user.username} | Commande par ${message.author.username}`,
                    bot.user.displayAvatarURL()
                )
                .setTimestamp();

            message.channel.send(embed);
        } else {
            let reason = args.join(" ").replace("warn", "").replace(toWarn, "");

            if (!reason) {
                let embed = new Discord.MessageEmbed()
                    .setAuthor(
                        message.author.tag,
                        message.author.displayAvatarURL()
                    )
                    .setDescription("Vous devez spécifier une raison.")
                    .setColor("#ff0000")
                    .setFooter(
                        `© ${bot.user.username} | Commande par ${message.author.username}`,
                        bot.user.displayAvatarURL()
                    )
                    .setTimestamp();

                message.channel.send(embed);
            } else if (message.author.id === toWarn.id) {
                let embed = new Discord.MessageEmbed()
                    .setAuthor(
                        message.author.tag,
                        message.author.displayAvatarURL()
                    )
                    .setDescription(
                        "Vous ne pouvez pas vous avertir vous-même."
                    )
                    .setColor("#ff0000")
                    .setFooter(
                        `© ${bot.user.username} | Commande pas ${message.author.username}`,
                        bot.user.displayAvatarURL()
                    )
                    .setTimestamp(new Date());

                message.channel.send(embed);
            } else if (toWarn.hasPermission("MANAGE_MESSAGES")) {
                let embed = new Discord.MessageEmbed()
                    .setAuthor(
                        message.author.tag,
                        message.author.displayAvatarURL()
                    )
                    .setDescription("Vous ne pouvez pas avertir ce membre.")
                    .setColor("#ff0000")
                    .setFooter(
                        `© ${bot.user.username} | Commande pas ${message.author.username}`,
                        bot.user.displayAvatarURL()
                    )
                    .setTimestamp(new Date());

                message.channel.send(embed);
            } else {
                let embed = new Discord.MessageEmbed()
                    .setAuthor(
                        message.author.tag,
                        message.author.displayAvatarURL()
                    )
                    .setDescription("Membre avertis avec succès.")
                    .addField("Nom du membre", toWarn.displayName)
                    .addField("Avertit par", message.member.displayName)
                    .addField("Date", format(new Date()))
                    .addField("Raison", reason)
                    .setColor("#00ff00")
                    .setFooter(
                        `© ${bot.user.username} | Commande par ${message.author.username}`,
                        bot.user.displayAvatarURL()
                    )
                    .setTimestamp();

                message.channel.send(embed);

                if (!warns.getValue(`${message.guild.id}-${toWarn.id}`)) {
                    return message.reply("le membre n'a aucun warn");
                } else {
                    let value = warns.getValue(
                        `${message.guild.id}-${toWarn.id}`
                    );

                    warns.set(`${message.guild.id}-${toWarn.id}`, value - 1);
                }
            }
        }
    },
};
