const Discord = require("discord.js");

module.exports = {
    name: "rolelist",
    description: "Donne la liste des rôles du serveur",
    execute(bot, message, args) {
        const role = message.guild.roles;
        const embed = new Discord.MessageEmbed().addField(
            "Roles du serveur",
            role.cache.map((r) => r.name).join(", ")
        );

        message.channel.send(embed);
    },
};
