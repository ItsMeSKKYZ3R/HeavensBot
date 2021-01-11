const Discord = require("discord.js");

module.exports = {
    name: "invite",
    description: "Invitez le bot sur votre serveur Discord",
    execute(bot, message, args) {
        const invite = new Discord.MessageEmbed()
            .setDescription(
                "Vous pouvez ajouter le bot en cliquant [ici](https://discord.com/oauth2/authorize?client_id=728685402143195216&scope=bot&permissions=271592510)"
            )
            .setFooter(`© ${bot.user.username} `)
            .setTimestamp(new Date());

        message.channel.send(invite);
    },
};
