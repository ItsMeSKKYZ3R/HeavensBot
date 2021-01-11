const Discord = require("discord.js");

module.exports = {
    name: "suggest",
    description: "Faites une suggestion pour le bot",
    execute(bot, message, args) {
        let channel = bot.guilds.cache
            .get("745572682732535850")
            .channels.cache.get("747189645506510920");

        if (!args[0]) {
            let error = new Discord.MessageEmbed()
                .setAuthor(bot.user.username)
                .setColor("#ff0000")
                .setDescription("Vous devez spécifier une suggestion")
                .setFooter(`© ${bot.user.username} `)
                .setTimestamp(new Date());

            return message.channel.send(error);
        }

        let suggestion = args.join(" ").slice(0);

        let ok = new Discord.MessageEmbed()
            .setAuthor(bot.user.username)
            .setColor("RANDOM")
            .setDescription(`Votre suggestion à bien été envoyée !`)
            .addField("Contenu de la suggestion", `\`\`\`${suggestion}\`\`\``)
            .setFooter(`© ${bot.user.username} `)
            .setTimestamp(new Date());

        message.channel.send(ok);

        let embed = new Discord.MessageEmbed()
            .setAuthor(bot.user.username)
            .setColor("RANDOM")
            .setDescription(`Nouvelle suggestion de ${message.author.username}`)
            .addField("Contenu de la suggestion", `\`\`\`${suggestion}\`\`\``)
            .setFooter(`© ${bot.user.username} `)
            .setTimestamp(new Date());

        channel.send(embed);
    },
};
