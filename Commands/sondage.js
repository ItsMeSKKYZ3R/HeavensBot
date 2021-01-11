const Discord = require("discord.js");

module.exports = {
    name: "sondage",
    description: "Faites un sondage sur votre serveur",
    execute(bot, message, args) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            if (message.author.id !== "518113582110605326") {
                return message.channel.send(
                    "Vous n'avez pas la permisssion d'utiliser cette commande."
                );
            }
        }

        if (!args.join(" ")) {
            return message.channel.send(
                "Veuillez spécifier une question pour le sondage."
            );
        }

        if (args.join(" ").length > 256) {
            return message.channel.send(
                "La question du sondage ne doit pas dépasser les 256 caractères."
            );
        }

        const embed = new Discord.MessageEmbed()
            .setColor("0xE342E3")
            .setTitle(args.join(" "))
            .setDescription("Interagissez avec les réactions ci-dessous.")
            .setFooter(
                `Sondage proposé par ${message.author.username}`,
                message.author.displayAvatarURL
            )
            .setTimestamp(new Date());

        try {
            message.delete();
            message.channel
                .send(embed)
                .then((m) => {
                    m.react("✅");
                    m.react("❌");
                })
                .catch((error) => {
                    const errorembed = new Discord.MessageEmbed()
                        .setColor("0xff0000")
                        .setTitle("Erreur")
                        .setDescription(
                            "Une erreur s'est produite lors de l'exécution de la commande. Veuillez réessayer ultérieurement. Si le problème persiste, veuillez contacter SKKYZ3R#8408."
                        )
                        .addField("Erreur", error)
                        .setFooter(
                            `Tentative de ${message.author.username}`,
                            message.author.displayAvatarURL
                        )
                        .setTimestamp(new Date());
                    if (error) {
                        console.error(error);

                        message.channel.send(errorembed);
                    }
                });
        } catch (e) {
            const errorembed = new Discord.MessageEmbed()
                .setColor("0xff0000")
                .setTitle("Une erreur s'est produite")
                .setDescription(
                    "Une erreur s'est produite lors de l'exécution de la commande. Veuillez réessayer ultérieurement. Si le problème persiste, veuillez contacter SKKYZ3R#8408."
                )
                .addField("Erreur :", e)
                .setFooter(
                    `Tentative de ${message.author.username}`,
                    message.author.displayAvatarURL
                )
                .setTimestamp(new Date());

            message.channel.send(errorembed);
            console.error(e);
        }
    },
};
