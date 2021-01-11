const Discord = require("discord.js");
const moment = require("moment-timezone");
moment.locale("fr");

module.exports = {
    name: "serverinfo",
    description: "Donne les infos du serveur",
    execute(bot, message, args) {
        let inline = true;
        let servericon = message.guild.iconURL;

        if (message.guild.verificationLevel === "Low") {
            message.guild.verificationLevel = "Faible";
        } else if (message.guild.verificationLevel === "Medium") {
            message.guild.verificationLevel = "Moyen";
        } else if (message.guild.verificationLevel === "Max") {
            message.guild.verificationLevel = "Max";
        }

        var nbr;

        if (!message.guild.emojis.cache.size) {
            nbr = "Il n'y a aucun emoji sur ce serveur !";
        } else {
            nbr = message.guild.emojis.cache.size;
        }

        let serverembed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setThumbnail(servericon)
            .setAuthor(message.guild.name)
            .addField("Nom", message.guild.name, inline)
            .addField("ID :id:", message.guild.id, inline)
            .addField("Owner :crown:", message.guild.owner, inline)
            .addField("Région", message.guild.region, inline)
            .addField(
                "Nombre de membres",
                `${message.guild.memberCount}`,
                inline
            )
            .addField("Nombre d'emojis", nbr)
            .addField(
                "Serveur rejoint le :",
                moment(message.member.joinedAt)
                    .tz("Europe/Paris")
                    .format("[Le] L [à] LTS"),
                inline
            )
            .addField(
                "Date de création du serveur :",
                moment(message.guild.createdAt)
                    .tz("Europe/Paris")
                    .format("[Le] L [à] LTS"),
                inline
            );

        message.channel.send(serverembed);

        message.delete();
    },
};
