const Discord = require("discord.js");

module.exports = {
    name: "règlement",
    description: "Définissez votre règlement",
    execute(bot, message, args) {
        if (message.member.hasPermission("ADMINISRATOR")) {
            let msg = args.join(" ").slice(0);

            let embed = new Discord.MessageEmbed()
                .setTitle("Règlement du serveur")
                .setColor("#00ff00")
                .setDescription(msg);

            message.channel.send(embed);
        } else {
            message.reply(
                "vous n'avez pas la permission de faire cette commande. Vous devez avoir la permission administrateur pourpouvoir la faire."
            );
        }
    },
};
