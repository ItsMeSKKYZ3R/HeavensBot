const Discord = require("discord.js");
const json = require("ezyjson");
const loc = require("../dbloc.json");

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
    name: "set-bvn",
    description: "Définit le message de bienvenue et son salon",
    execute(bot, message, args) {
        message.delete();

        if (message.member.hasPermission("ADMINISTRATOR")) {
            let messageEmbed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL()
                )
                .setDescription(
                    `Entrez votre message de bienvenue ! Les variables sont les suivantes`
                )
                .addField("{member.user}", "Mentionne le membre")
                .addField("{member.username}", "Envoie le pseudo du membre")
                .addField("{guild.name}", "Envoie le nom du serveur")
                .addField("{guild.member_count}", "Envoie le nombre de membres")
                .addField("cancel", "Annule la commande")
                .setFooter(
                    "*message* : message en italique, **message** : message en gras, __message__ : message souligné"
                )
                .setTimestamp(new Date());

            message.channel.send(messageEmbed).then((msg) => {
                const filter = (m) => m.author.id === message.author.id;
                const collector = message.channel.createMessageCollector(
                    filter,
                    {
                        idle: 60000,
                    }
                );

                const commandCancelled = setTimeout(() => {
                    msg.delete();
                    return message.reply("commande annulée.");
                }, 60000);

                collector.once("collect", (m) => {
                    clearTimeout(commandCancelled);

                    let theMessage = m.content;

                    if (m.content == "cancel") {
                        msg.delete();
                        m.delete();
                        return message.reply("commande annulée.");
                    } else {
                        msg.delete();
                        m.delete();

                        if (!dbBvnMsg.getValue(`${message.guild.id}`)) {
                            let guildId = message.guild.id;

                            dbBvnMsg.add(`${message.guild.id}`, theMessage);
                        } else {
                            dbBvnMsg.set(`${message.guild.id}`, theMessage);
                        }

                        message.channel.send("Quel salon ?").then((msg) => {
                            const filter = (m) =>
                                m.author.id === message.author.id;
                            const collector = message.channel.createMessageCollector(
                                filter,
                                {
                                    idle: 60000,
                                }
                            );

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
                                    let channel = question
                                        .replace("<#", "")
                                        .replace(">", "");

                                    if (
                                        !dbBvnChannel.getValue(
                                            `${message.guild.id}`
                                        )
                                    ) {
                                        dbBvnChannel.add(
                                            `${message.guild.id}`,
                                            channel
                                        );
                                    } else {
                                        dbBvnChannel.set(
                                            `${message.guild.id}`,
                                            channel
                                        );
                                    }

                                    bot.channels.cache
                                        .get(channel)
                                        .send(
                                            `Ce salon a bien été définit comme salon de bienvenue avec le message "${dbBvnMsg.getValue(
                                                String(message.guild.id)
                                            )}"`
                                        );
                                }
                            });
                        });
                    }
                });
            });
        } else {
            message.reply(
                "Vous n'avez pas la permissions ! Vous devez être administrateur du serveur"
            );
        }
    },
};
