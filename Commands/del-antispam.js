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
    name: "del-antispam",
    description: "Supprimez l'antispam paramétré sur votre serveur",
    execute(bot, message, args) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            dbSpamLvl.remove(`${message.guild.id}`);
            message.reply("l'anti-spam a bien été désactivé.");
        } else {
            return;
        }
    },
};
