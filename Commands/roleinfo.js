const Discord = require("discord.js");
const moment = require("moment-timezone");
moment.locale("fr");

module.exports = {
    name: "roleinfo",
    description: "Donne les infos sur un rôle",
    execute(bot, message, args) {
        let roletocheck = args.join(" ");
        let role = bot.guilds.cache
            .get(message.guild.id)
            .roles.cache.find((r) => r.name === roletocheck);
        if (!role)
            return message.channel.send(
                "Le rôle n'a pas été trouvé sur le serveur."
            );

        const embed = new Discord.MessageEmbed()
            .setColor(0x00a2e8)
            .addField("Role name", `${role.name}`, true)
            .addField("Role ID", `${role.id}`, true)
            .addField(
                "Created At",
                moment(role.createdAt).format("[Le] L [à] LTS")
            )
            .addField("Mentionable: ", role.mentionable ? "Oui" : "Non");

        message.channel.send({ embed });
    },
};
