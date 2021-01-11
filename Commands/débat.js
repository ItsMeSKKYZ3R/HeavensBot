const Discord = require("discord.js");

module.exports = {
    name: "débat",
    description: "Lancez un débat",
    execute(bot, message, args) {
        message.delete();

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            const err = new Discord.MessageEmbed()
                .setTitle("Erreur")
                .setColor("#f00")
                .setDescription(
                    "Vous n'avez pas la permission d'utiliser cette commande. Seul les personnes qui ont la permission de gérer les messages peuvent exécuter cette commande."
                )
                .setFooter(
                    `Tentative de ${message.author.username}`,
                    message.author.displayAvatarURL
                )
                .setTimestamp(new Date());

            message.channel.send(err);
        } else {
            const sujet = args.join(" ").slice(0);

            if (!sujet) {
                const err = new Discord.MessageEmbed()
                    .setTitle("Erreur")
                    .setColor("#f00")
                    .setDescription("Vous n'avez pas défini de sujet")
                    .setFooter(
                        `Tentative de ${message.author.username}`,
                        message.author.displayAvatarURL
                    )
                    .setTimestamp(new Date());

                message.channel.send(err);
            } else {
                const debat = new Discord.MessageEmbed()
                    .setTitle("Nouveau débat !")
                    .setColor("GREEN")
                    .addField("Sujet su débat", sujet)
                    .setFooter(
                        `Débat proposé par ${message.author.username}`,
                        message.author.displayAvatarURL
                    )
                    .setTimestamp(new Date());

                message.channel.send(debat);
            }
        }
    },
};
