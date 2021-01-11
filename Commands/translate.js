const Discord = require("discord.js");
const translate = require("@k3rn31p4nic/google-translate-api");

module.exports = {
    name: "t",
    description: "Vous traduit un texte",
    execute(bot, message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor("0xff0000")
            .setTitle("Fraude de permission")
            .setDescription(
                "Vous ne pouvez pas m'utiliser pour mentionner tout les membres du serveur."
            )
            .setFooter(
                `Tentative de ${message.author.username}`,
                message.author.displayAvatarURL
            )
            .setTimestamp(new Date());

        if (
            !message.guild
                .member(message.author)
                .hasPermission("MENTION_EVERYONE") &&
            message.content.includes("@everyone")
        ) {
            return message.channel.send(embed);
        }

        if (
            !message.guild
                .member(message.author)
                .hasPermission("MENTION_EVERYONE") &&
            message.content.includes("@here")
        ) {
            return message.channel.send(embed);
        }

        let langage = args[0];
        let Text = args.slice(1).join(" ");

        const ambed = new Discord.MessageEmbed()
            .setColor("0xff0000")
            .setTitle("Aucun langage spécifié")
            .setDescription(
                "Vous devez spécifier un langage dans lequel traduire votre texte."
            )
            .setFooter(
                `Tentative de ${message.author.username}`,
                message.author.displayAvatarURL
            )
            .setTimestamp(new Date());

        const bembed = new Discord.MessageEmbed()
            .setColor("0xff0000")
            .setTitle("Aucun texte entré")
            .setDescription("Vous devez entrer du texte à traduire.")
            .setFooter(
                `Tentative de ${message.author.username}`,
                message.author.displayAvatarURL
            )
            .setTimestamp(new Date());

        if (!langage) {
            return message.channel.send(ambed);
        }

        if (!Text) {
            return message.channel.send(bembed);
        }

        try {
            translate(Text, { to: langage })
                .then((res) => {
                    message.channel.send(res.text);
                    // message.channel.send(res.from.language.iso);
                })
                .catch((err) => {
                    const errorembed = new Discord.MessageEmbed()
                        .setColor("0xff0000")
                        .setTitle("Une erreur s'est produite")
                        .setDescription(
                            "Une erreur s'est produite lors de l'exécution de la commande. Veuillez réessayer ultérieurement. Si le problème persiste, veuillez contacter Nεξυς#9063."
                        )
                        .addField("Erreur :", err);

                    message.channel.send(errorembed);
                    console.error(err);
                });
        } catch (e) {
            const errorembed = new Discord.MessageEmbed()
                .setColor("0xff0000")
                .setTitle("Une erreur s'est produite")
                .setDescription(
                    "Une erreur s'est produite lors de l'exécution de la commande. Veuillez réessayer ultérieurement. Si le problème persiste, veuillez contacter Nεξυς#9063."
                )
                .addField("Erreur :", e);

            message.channel.send(errorembed);
            console.error(e);
        }
    },
};
