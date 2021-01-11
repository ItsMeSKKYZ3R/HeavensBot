const Discord = require("discord.js");

module.exports = {
    name: "support",
    description: "Vous permet de rejoindre le serveur de support",
    execute(bot, message, args) {
        let embed = new Discord.MessageEmbed()
            .setAuthor(bot.user.username)
            .setColor("RANDOM")
            .setDescription(
                "Vous pouvez rejoindre le serveur support en cliquant [ici](https://discord.gg/4jWU5u8)"
            )
            .setFooter(`© ${bot.user.username} `)
            .setTimestamp(new Date());

        message.channel.send(embed);
    },
};
