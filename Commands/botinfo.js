const Discord = require("discord.js");
const moment = require("moment-timezone");
moment.locale("fr");
const os = require("os");
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
let dbPrefix = new json(`${loc.loc}/prefix.json`);

module.exports = {
    name: "botinfo",
    description: "Donne les infos sur le bot",
    execute(bot, message, args) {
        let prefix;

        if (!dbPrefix.getValue(`${message.guild.id}`)) {
            prefix = "!";
        } else {
            prefix = dbPrefix.getValue(`${message.guild.id}`);
        }

        let cpuusage = process.cpuUsage();
        let memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        let totalSeconds = bot.uptime / 1000;
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let sec;
        let min;
        let hr;
        let d;

        seconds > 2 ? (sec = "secondes") : (sec = "seconde");
        minutes > 2 ? (min = "minutes") : (min = "minute");
        hours > 2 ? (hr = "heures") : (hr = "heure");
        days > 2 ? (d = "jours") : (d = "jour");

        const embed = new Discord.MessageEmbed()
            .setColor("0x39afe4")
            .setTitle("Mes informations")
            .setThumbnail(bot.user.displayAvatarURL)
            .addField("Mon nom :", bot.user.username)
            .addField("Mon tag :", "#" + bot.user.discriminator)
            .addField("Mon ID :", bot.user.id)
            .addField(`Mon prefix sur ce serveur`, prefix)
            .addField(
                "Date et heure de ma création :",
                moment(bot.user.createdAt)
                    .tz("Europe/Paris")
                    .format("[Le] L [à] LTS")
            )
            .addField("Utilisateurs :baby: ", `${bot.users.cache.size}`, true)
            .addField("Serveurs   ", `${bot.guilds.cache.size}`, true)
            .addField("Système d'explotation :", os.type(), true)
            .addField("Version du système d'exploitation :", os.release(), true)
            .addField("Architecture :", os.arch(), true)
            .addField(
                "Mémoire allouée :",
                Math.round(process.memoryUsage().rss / 1024 / 1024) + " Mo",
                true
            )
            .addField("Mémoire utilisée :", memory + " Mo", true)
            .addField("Processeur :", os.cpus()[0].model, true)
            .addField(
                "Utilisation du processeur :",
                Math.floor(cpuusage.user / cpuusage.system) + "%",
                true
            )
            .addField("Version Node JS :", process.version, true)
            .addField("Version Discord.js :", Discord.version, true)
            .addField(
                "En ligne depuis ⏲",
                `${days} ${d}, ${hours} ${hr}, ${minutes} ${min}, ${seconds} ${sec}`,
                true
            )
            .setFooter(bot.user.username + " ")
            .setTimestamp(new Date());

        try {
            message.channel.send(embed).catch((error) => {
                const errorembed = new Discord.MessageEmbed()
                    .setColor("0xff0000")
                    .setTitle("Erreur")
                    .setDescription(
                        "Une erreur s'est produite lors de l'exécution de la commande. Veuillez réessayer ultérieurement. Si le problème persiste, veuillez contacter SKKYZ3R#8408."
                    )
                    .addField("Erreur :", error);

                console.error(error);

                message.channel.send(errorembed);
            });
        } catch (e) {
            const errorembed = new Discord.MessageEmbed()
                .setColor("0xff0000")
                .setTitle("Erreur")
                .setDescription(
                    "Une erreur s'est produite lors de l'exécution de la commande. Veuillez réessayer ultérieurement. Si le problème persiste, veuillez contacter SKKYZ3R#8408."
                )
                .addField("Erreur :", e);

            message.channel.send(errorembed);
            console.error(e);
        }
    },
};
