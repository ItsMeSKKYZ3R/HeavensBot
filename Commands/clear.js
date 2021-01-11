const Discord = require("discord.js");

module.exports = {
    name: "clear",
    description: "Supprimez un nombre de message",
    async execute(bot, message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor("0xff0000")
            .setTitle("Permission manquante")
            .setDescription(
                "Vous n'avez pas la permission de supprimer des messages."
            )
            .setFooter(
                `Tentative de ${message.author.username}`,
                message.author.displayAvatarURL
            )
            .setTimestamp(new Date());

        const aembed = new Discord.MessageEmbed()
            .setColor("0xff0000")
            .setTitle("Permission manquante")
            .setDescription(
                "Je n'ai pas la permission de supprimer des messages."
            )
            .setFooter(
                `Tentative de ${message.author.username}`,
                message.author.displayAvatarURL
            )
            .setTimestamp(new Date());

        const bembed = new Discord.MessageEmbed()
            .setColor("0xff0000")
            .setTitle("Aucun nombre spécifié")
            .setDescription(
                "Vous devez spécifier un nombre de messages à supprimer."
            )
            .setFooter(
                `Tentative de ${message.author.username}`,
                message.author.displayAvatarURL
            )
            .setTimestamp(new Date());

        const cembed = new Discord.MessageEmbed()
            .setColor("0xff0000")
            .setTitle("Aucun nombre spécifié")
            .setDescription(
                "Vous devez spécifier un nombre de messages à supprimer. Spécifier des caracètes spéciaux ou des lettres est inutile."
            )
            .setFooter(
                `Tentative de ${message.author.username}`,
                message.author.displayAvatarURL
            )
            .setTimestamp(new Date());

        if (
            !message.guild
                .member(message.author)
                .hasPermission("MANAGE_MESSAGES")
        ) {
            return message.channel.send(embed);
        }
        if (!message.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")) {
            return message.channel.send(aembed);
        }
        if (!args[0]) {
            return message.channel.send(bembed);
        } else if (isNaN(args[0])) {
            return message.channel.send(cembed);
        }

        try {
            await message
                .delete()
                .then((m) => {
                    message.channel
                        .bulkDelete(args[0])
                        .then((messages) => {
                            message.channel
                                .send(
                                    `**${messages.size}** messages ont été supprimés !`
                                )
                                .then((m) => {
                                    setTimeout(() => {
                                        m.delete();
                                    }, 5000);
                                });
                        })
                        .catch((error) => {
                            const errorembed = new Discord.MessageEmbed()
                                .setColor("0xff0000")
                                .setTitle("Erreur")
                                .setDescription(
                                    "Une erreur s'est produite lors de l'exécution de la commande. Veuillez réessayer ultérieurement. Si le problème persiste, veuillez contacter SKKYZ3R#8408."
                                )
                                .addField("Erreur :", error)
                                .setFooter(
                                    `Tentative de ${message.author.username}`,
                                    message.author.displayAvatarURL
                                )
                                .setTimestamp(new Date());

                            message.channel.send(errorembed);
                            console.error(error);
                        });
                })
                .catch((error) => {
                    const errorembed = new Discord.MessageEmbed()
                        .setColor("0xff0000")
                        .setTitle("Erreur")
                        .setDescription(
                            "Une erreur s'est produite lors de l'exécution de la commande. Veuillez réessayer ultérieurement. Si le problème persiste, veuillez contacter SKKYZ3R#8408."
                        )
                        .addField("Erreur :", error)
                        .setFooter(
                            `Tentative de ${message.author.username}`,
                            message.author.displayAvatarURL
                        )
                        .setTimestamp(new Date());

                    message.channel.send(errorembed);
                    console.error(error);
                });
        } catch (e) {
            const errorembed = new Discord.MessageEmbed()
                .setColor("0xff0000")
                .setTitle("Erreur")
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

module.exports.help = {
    name: "clear",
};
