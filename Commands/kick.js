const Discord = require("discord.js");

module.exports = {
    name: "kick",
    description: "Expulsez un membre de votre serveur",
    async execute(bot, message, args) {
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            var not_allowed = new Discord.MessageEmbed()
                .setAuthor(bot.user.username)
                .setDescription(
                    "Vous n'avez pas la permission de kicknir des membres sur ce serveur !"
                )
                .setColor("#ff0000")
                .setFooter(`© ${bot.user.username} `)
                .setTimestamp();

            message.channel.send(not_allowed);
        }

        var user = message.mentions.users.first();

        if (!user) {
            var not_member = new Discord.MessageEmbed()
                .setAuthor(bot.user.username)
                .setDescription("Vous n'avez pas spécifié de membre à kick !")
                .setColor("#ff0000")
                .setFooter(`© ${bot.user.username} `)
                .setTimestamp();

            message.channel.send(not_member);
        }

        var member;

        try {
            member = await message.guild.members.fetch(user);
        } catch (err) {
            member = null;
        }

        if (!member) {
            var not_on_server = new Discord.MessageEmbed()
                .setAuthor(bot.user.username)
                .setDescription(
                    "Le membre spécifié n'est pas ou n'est plus sur le serveur !"
                )
                .setColor("#ff0000")
                .setFooter(`© ${bot.user.username} `)
                .setTimestamp();

            message.channel.send(not_on_server);
        }

        var reason = args.slice(1).join(" ");

        if (!reason) {
            var no_reason = new Discord.MessageEmbed()
                .setAuthor(bot.user.username)
                .setDescription("Vous n'avez pas spécifié de raison de kick !")
                .setColor("#ff0000")
                .setFooter(`© ${bot.user.username} `)
                .setTimestamp();

            message.channel.send(no_reason);
        }

        var channel = message.guild.channels.cache.find(
            (c) => c.name === `${bot.user.username}-logs`
        );

        console.log(channel);

        var log = new Discord.MessageEmbed()
            .setTitle("Utilisateur kick !")
            .setAuthor(bot.user.username)
            .setDescription("Un membre a été kick de ce serveur !")
            .addField("Utilisateur :", user, true)
            .addField("Modérateur :", message.author, true)
            .addField("Raison :", reason, true)
            .setColor("#00cdff")
            .setFooter(`© ${bot.user.username} `)
            .setTimestamp();

        if (channel) {
            channel.send(log);
        } else {
            message.channel.send(log);
        }

        var embed = new Discord.MessageEmbed()
            .setTitle("Vous avez été kick !")
            .setAuthor(bot.user.username)
            .setDescription(`Vous avez été kick !`)
            .addField("Modérateur :", message.author, true)
            .addField("Raison :", reason, true)
            .setColor("#00cdff")
            .setFooter(`© ${bot.user.username} `)
            .setTimestamp();

        try {
            await user.send(embed);
        } catch (err) {
            console.warn(err);
        }

        message.guild.members.kick(user);

        message.channel.send(log);
    },
};
