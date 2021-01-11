const Discord = require("discord.js");
const moment = require("moment-timezone");
moment.locale("fr");

module.exports = {
    name: "userinfo",
    description: "Donne les infos sur un membre (alias stats)",
    execute(bot, message, args) {
        const membre = message.guild.member(
            message.mentions.members.first() || message.member
        );

        var statut;

        const now = Date.now();
        var userCreatedAt = membre.user.createdAt;
        const diffTime = Math.abs(now - userCreatedAt);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        var userJoinedAt = membre.joinedAt;
        const diffTime2 = Math.abs(now - userJoinedAt);
        const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));

        var days = "";

        if (diffDays > 1) {
            days = "jours";
        } else {
            days = "jour";
        }

        var days2;

        if (diffDays2 > 1) {
            days2 = "jours";
        } else {
            days2 = "jour";
        }

        if (membre.presence.status === "online") {
            statut = "En ligne";
        } else if (membre.presence.status === "idle") {
            statut = "Inactif";
        } else if (membre.presence.status === "dnd") {
            statut = "Ne pas déranger";
        } else if (membre.presence.status === "offline") {
            statut = "Hors ligne";
        }

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`Statistiques de ${membre.user.username}`)
            .setThumbnail(membre.user.displayAvatarURL)
            .addField("Pseudo :", membre.user.username)
            .addField("Tag :", ` #${membre.user.discriminator}`)
            .addField("ID", membre.id)
            .addField("Statut", `${statut}`)
            .addField(
                "Activité :",
                membre.user.presence.activities[0]
                    ? membre.user.presence.activities[0].name ===
                      "Custom Status"
                        ? membre.user.presence.activities[1]
                            ? membre.user.presence.activities[1].name
                            : "Status personnalisé"
                        : membre.user.presence.activities[0].name
                    : "Cet utilisateur ne joue pas"
            )
            .addField(
                "A créé son compte le :",
                `${moment(membre.user.createdAt)
                    .tz("Europe/Paris")
                    .format("[Le] L [à] LTS")} (Il y a ${diffDays} ${days})`
            )
            .addField(
                "A rejoint le serveur le :",
                `${moment(membre.joinedAt)
                    .tz("Europe/Paris")
                    .format("[Le] L [à] LTS")} (Il y a ${diffDays2} ${days2})`
            );

        message.channel.send(embed).catch((error) => {
            const errorembed = new Discord.MessageEmbed()
                .setColor("0xff0000")
                .setTitle("Erreur")
                .setDescription(
                    "Une erreur s'est produite lors de l'exécution de la commande. Veuillez réessayer ultérieurement. Si le problème persiste, veuillez contacter SKKYZ3R#8408."
                )
                .addField("Erreur :", err);
            if (error) {
                console.error(error);

                message.channel.send(errorembed);
            }
        });
    },
};
