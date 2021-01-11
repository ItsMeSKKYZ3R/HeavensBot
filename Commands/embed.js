const Discord = require("discord.js");

module.exports = {
    async execute(bot, message, args) {
        let msg = args.join(" ").slice(0);
        let message_embed = Discord.MessageEmbed;
        let err = new message_embed()
            .setTitle("Une erreur s'est produite.")
            .setColor("#ff0000");

        try {
            if (!msg) {
                err.setDescription("Vous devez spécifier un message.");

                message.channel.send(err);
            } else if (msg.length > 120) {
                err.setDescription(
                    "Votre message ne doit pas dépasser 120 caractères"
                );

                message.channel.send(err);
            } else {
                let embed = new message_embed()
                    .setColor("#00ff00")
                    .setTitle(`Message de ${message.author.username}`)
                    .setDescription(`\`\`\`${msg}\`\`\``);

                message.channel.send(embed);
            }
        } catch (e) {
            err.setDescription(
                "Une erreur s'est produite lors de l'exécution de la commande. Veuillez réessayer ultérieurement. Si le problème persiste, veuillez contacter SKKYZ3R#8408."
            ).addField("Erreur :", e);
        }
    },

    name: "embed",
    description: "",
};
