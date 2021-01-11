const Discord = require("discord.js");

module.exports = {
    name: "unban",
    description:
        "Vous permet de retirer un membre de la liste des bannissements du serveur",
    execute(bot, message, args) {
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            var not_allowed = new Discord.MessageEmbed()
                .setAuthor(bot.user.username)
                .setDescription(
                    "Vous n'avez pas la permission d'unban des membres sur ce serveur !"
                )
                .setColor("#ff0000")
                .setFooter(`© ${bot.user.username} `)
                .setTimestamp();

            message.channel.send(not_allowed);
        }

        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            var imnot_allowed = new Discord.MessageEmbed()
                .setAuthor(bot.user.username)
                .setDescription(
                    "Je n'ai pas la permission d'unban des membres sur ce serveur !"
                )
                .setColor("#ff0000")
                .setFooter(`© ${bot.user.username} `)
                .setTimestamp();

            message.channel.send(imnot_allowed);
        }
        let userID = args[0];

        message.guild.fetchBans().then((bans) => {
            if (bans.size == 0) {
                var no_bans = new Discord.MessageEmbed()
                    .setAuthor(bot.user.username)
                    .setDescription(
                        "Il n'y a aucun membre ban sur ce serveur !"
                    )
                    .setColor("#ff0000")
                    .setFooter(`© ${bot.user.username} `)
                    .setTimestamp(new Date());

                message.channel.send(no_bans);
            }

            let bUser = bans.find((b) => b.user.id == userID);

            message.guild.members.unban(bUser.user);

            var unban = new Discord.MessageEmbed()
                .setAuthor(bot.user.username)
                .setDescription(`<@${bUser.user.id}> a bien été unban !`)
                .setColor("#ff0000")
                .setFooter(`© ${bot.user.username} `)
                .setTimestamp(new Date());

            message.channel.send(unban);
        });
    },
};
