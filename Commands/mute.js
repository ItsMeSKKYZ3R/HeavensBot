const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "mute",
    description: "Rendez muet un membre",
    async execute(bot, message, args) {
        let toMute = message.guild.member(
            message.mentions.users.first() ||
                message.guild.members.cache.get(args[0])
        );

        if (toMute.hasPermission("MANAGE_MESSAGES")) {
            return message.reply(
                "je suis désolé, mais vous ne pouvez pas mute ce membre"
            );
        } else if (!toMute) {
            return message.reply("Merci de spécifier un utilisateur");
        } else if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply(
                "vous n'avez pas la permission de faire cette commande !"
            );
        }

        const role = message.guild.roles.cache.find((r) => r.name === "Muted");

        if (!role) {
            try {
                role = await message.guild.roles.create({
                    name: "Muted",
                    color: 0xbeb7b7,
                    permissions: [],
                });

                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(role, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                    });
                });
            } catch (e) {
                console.log(e.stack);
            }
        }

        await toMute.roles.add(role);
        message.reply(`<@${toMute.id} est mute !`);
    },
};
