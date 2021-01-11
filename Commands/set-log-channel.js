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
    name: "set-log-channel",
    description: "Définissez le salon de logs",
    execute(bot, message, args) {
        let embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("#00ff00")
            .setDescription("Quel salon voulez-vous ?")
            .setFooter(
                `© ${bot.user.username} | Commande par ${message.author.tag}`,
                message.author.displayAvatarURL()
            )
            .setTimestamp(new Date());

        message.channel.send(embed).then((msg) => {
            const filter = (m) => m.author.id === message.author.id;
            const collector = message.channel.createMessageCollector(filter, {
                idle: 60000,
            });

            const commandCancelled = setTimeout(() => {
                msg.delete();
                return message.reply("commande annulée.");
            }, 60000);

            collector.once("collect", (m) => {
                clearTimeout(commandCancelled);

                let question = m.content;

                if (m.content == "cancel") {
                    msg.delete();
                    m.delete();
                    return message.reply("commande annulée.");
                } else {
                    msg.delete();
                    m.delete();
                    let channel = question.replace("<#", "").replace(">", "");

                    if (!dbLogs.getValue(`${message.guild.id}`)) {
                        dbLogs.add(`${message.guild.id}`, channel);
                    } else {
                        dbLogs.set(`${message.guild.id}`, channel);
                    }
                }
            });
        });
    },
};
