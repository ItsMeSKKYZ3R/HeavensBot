const canvacord = require("canvacord");
const xp = require("./db/xp.json");
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
    name: "rank",
    description: "Donne votre niveau",
    execute(bot, message, args) {
        let membre = message.mentions.users.first() || message.author;

        if (xp[`${message.guild.id}-${message.author.id}`]) {
            const rank = new canvacord.Rank()
                .setAvatar(
                    membre.displayAvatarURL({ dynamic: false, format: "png" })
                )
                .setCurrentXP(xp[`${message.guild.id}-${membre.id}`].xp)
                .setRequiredXP(
                    5 *
                        Math.pow(
                            xp[`${message.guild.id}-${membre.id}`].level,
                            2
                        ) +
                        50 * xp[`${message.guild.id}-${membre.id}`].level +
                        100,
                    "#f1f1f1"
                )
                .setStatus(membre.presence.status)
                .setProgressBar("#0000ff", "COLOR")
                .setUsername(membre.username)
                .setDiscriminator(membre.discriminator)
                .setLevel(xp[`${message.guild.id}-${membre.id}`].level)
                .setRank(0, "rien", false);

            rank.build().then((data) => {
                const attatchment = new Discord.MessageAttachment(
                    data,
                    "rank.png"
                );

                message.channel.send(attatchment);
            });
        } else {
            message.reply("vous n'avez pas d'xp sur ce serveur");
        }
    },
};
