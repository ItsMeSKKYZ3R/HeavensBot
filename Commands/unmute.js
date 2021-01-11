const Discord = require("discord.js");

module.exports = {
    name: "unmute",
    description: "Vous permet de redonner la permission de parler à un membre",
    async execute(bot, message, args) {
        let tounmute = message.guild.member(
            message.mentions.users.first() ||
                message.guild.members.cache.get(args[0])
        );
        if (!tounmute)
            return message.reply("Veuillez mentionner un utilisateur !");
        if (tounmute.hasPermission("MANAGE_MESSAGES"))
            return message.reply("Vous n'avez pas la permission !");
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

        await tounmute.roles.remove(role);
        message.reply(` <@${tounmute.id}> est unmute !`);
    },
};
