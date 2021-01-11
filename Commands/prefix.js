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
let dbprefix = new json(`${loc.loc}/prefix.json`);

module.exports = {
    name: "prefix",
    description: "Change le prefix",
    execute(bot, message, args) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            if (args[0]) {
                if (!dbprefix.getValue(`${message.guild.id}`)) {
                    dbprefix.add(`${message.guild.id}`, `${args[0]}`);
                } else {
                    dbprefix.set(`${message.guild.id}`, `${args[0]}`);
                }

                message.channel.send(
                    `Prefix définit sur ${args[0]} par ${message.author}.`
                );
            } else {
                message.reply("veuillez préciser un prefix s'il vous plaît.");
            }
        } else {
            message.reply(
                "vous n'avez pas la permission de changer le prefix."
            );
        }
    },
};
