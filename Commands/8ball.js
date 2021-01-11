const Discord = require("discord.js");

module.exports = {
    name: "8ball",
    description: "Répond aléatoirement à votre question",
    execute(bot, message, args) {
        let replies = [
            "Oui",
            "Non",
            "Je ne sais pas",
            "Reposes-moi la question plus tard",
        ];

        let result = Math.floor(Math.random() * replies.length);
        let question = args.join(" ");

        if (!args[0]) {
            const erreur = new Discord.MessageEmbed()
                .setTitle("Erreur")
                .setDescription("Erreur de syntaxe")
                .setColor("#ff0000")
                .setAuthor(bot.user.username)
                .addField("Veuillez spécifier une question !")
                .setFooter("Commande 8ball")
                .setTimestamp();
            message.channel.send(erreur);
        } else {
            let ballEmbed = new Discord.MessageEmbed()
                .setTitle("8ball")
                .setDescription("Commande réussi")
                .setColor("#5EFF33")
                .setAuthor(bot.user.username)
                .addField("Question", question)
                .addField("Réponse", replies[result])
                .setFooter("Commande 8ball")
                .setTimestamp();
            message.channel.send(ballEmbed);
        }
    },
};
