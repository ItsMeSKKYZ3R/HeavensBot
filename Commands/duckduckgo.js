const Discord = require("discord.js");

module.exports = {
    name: "ddg",
    description: "Faites une recherche sur duckduckgo",
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

        if (!args.join(" ")) {
            return message.reply("la recherche ne peut pas être vide");
        }

        const ambed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle("Recherche effectuée !")
            .setDescription(
                `J'ai effectué ta recherche. Tu peux retrouver les résultats [ici](https://www.duckduckgo.com/?q=${args.join(
                    "+"
                )}). \n \n__Votre recherche__ : ${args.join(" ")}`
            );

        message.channel.send(ambed);
    },
};
