var { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "eval",
    description:
        "Vérifiez votre code JavaScript (.js) et JavaScript React (.jsx)",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {*} args
     */

    execute(bot, message, args) {
        if (message.author.id !== "518113582110605326") {
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                return message.channel.send(
                    ":x: ERREUR : Seul un administrateur peut faire ça !"
                );
            }
        }

        if (!args[0])
            return message.channel.send(":x: ERREUR : Entrez du code svp");
        if (
            args.includes("token") ||
            args.includes("client.token") ||
            args.includes("bot.token")
        )
            return message.reply(
                "cette action est trop dangereuse, je ne peux pas vous laisser faire ça"
            );

        if (args.includes("fs")) {
            return message.channel.send(
                ":x: ERREUR : Ce module est trop dangereux pour moi !"
            );
        }

        try {
            let codein = args.join(" ");
            let code = eval(codein);

            if (typeof code !== "string")
                code = require("util").inspect(code, { depth: 0 });
            let embed = new MessageEmbed()
                .setAuthor("Evaluate")
                .setColor("RANDOM")
                .addField(":inbox_tray: Entrée", `\`\`\`js\n${codein}\`\`\``)
                .addField(":outbox_tray: Sortie", `\`\`\`js\n${code}\n\`\`\``)
                .setFooter(`© ${bot.user.username} `)
                .setTimestamp(new Date());
            message.channel.send(embed);
        } catch (e) {
            message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
        }
    },
};
