const Discord = require("discord.js");

module.exports = {
    name: "ping",
    descrtiption: "Donne la latence du bot et de l'API",
    execute(bot, message, args) {
        const start = Date.now();

        const ping_before_edit = new Discord.MessageEmbed()
            .setTitle(`Ping de ${bot.user.username}`)
            .setDescription(`Ping en cours...`)
            .setColor("#ff0000")
            .setFooter(`© ${bot.user.username} `)
            .setTimestamp();

        message.channel.send(ping_before_edit).then((msg) => {
            const ping_after_edit = new Discord.MessageEmbed()
                .setTitle(`Ping de ${bot.user.username}`)
                .setDescription(`Pong !`)
                .addField(
                    `Latence du bot :`,
                    `\`\`\`${Date.now() - start}ms\`\`\``
                )
                .addField(
                    `Latence de L'API :`,
                    `\`\`\`${Math.round(bot.ws.ping)}ms\`\`\``
                )
                .setColor("#00cdff")
                .setFooter(`© ${bot.user.username} `)
                .setTimestamp();

            msg.edit(ping_after_edit);
        });
    },
};
