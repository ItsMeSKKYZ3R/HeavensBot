const Discord = require("discord.js");
const bot = new Discord.Client();

module.exports = {
    name: "emojislist",
    description: "Vous donne la liste des emojis du serveur",
    execute(bot, message, args) {
        const emoji = message.guild.emojis;

        if (!emoji.cache.size)
            return message.channel.send("Le serveur n'a pas d'emoji");

        const embed = new Discord.MessageEmbed()
            .setTitle("Les emojis du serveur sont")
            .setDescription(emoji.cache.map((e) => e).join(" "));

        message.channel.send(embed);
    },
};
