const Discord = require("discord.js");
const math = require("mathjs");

module.exports = {
    name: "calc",
    description: "Faites un calcul (* pour multiplier et / pour diviser)",
    execute(bot, message, args) {
        if (!args.join(" ")) {
            return message.channel.send(
                "Vous devez entrer des facteurs à calculer."
            );
        }

        let calcul;

        try {
            calcul = math.evaluate(args.join(" "));
        } catch (e) {
            const errorembed = new Discord.MessageEmbed()
                .setColor("0xff0000")
                .setTitle("Une erreur s'est produite")
                .setDescription(
                    "Une erreur s'est produite lors de l'exécution de la commande. Veuillez réessayer ultérieurement. Si le problème persiste, veuillez contacter SKKYZ3R#8408."
                )
                .addField("Erreur :", e)
                .setFooter(
                    `Tentative de ${message.author.uername}`,
                    message.author.displayAvatarURL
                )
                .setTimestamp(new Date());
        }

        try {
            const embed = new Discord.MessageEmbed()
                .setColor("ORANGE")
                .setTitle("Calcul effectué !")
                .addField("Calcul :", args.join(" "))
                .addField("Résultat :", calcul)
                .setFooter(
                    `Demandé par ${message.author.username}`,
                    message.author.displayAvatarURL
                )
                .setTimestamp(new Date());

            message.channel.send(embed);
        } catch (e) {
            const errorembed = new Discord.MessageEmbed()
                .setColor("0xff0000")
                .setTitle("Une erreur s'est produite")
                .setDescription(
                    "Une erreur s'est produite lors de l'exécution de la commande. Veuillez réessayer ultérieurement. Si le problème persiste, veuillez contacter SKKYZ3R#8408."
                )
                .addField("Erreur :", e)
                .setFooter(
                    `Tentative de ${message.author.uername}`,
                    message.author.displayAvatarURL
                )
                .setTimestamp(new Date());

            message.channel.send(errorembed);
            console.error(e);
        }
    },
};
