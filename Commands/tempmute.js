const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "tempmute",
    description:
        "Vous permet de rendre muet un membre pendant une durée déterminée",
    async execute(bot, message, args) {
        let tomute = message.guild.member(
            message.mentions.users.first() ||
                message.guild.members.cache.get(args[0])
        );
        if (!tomute)
            return message.reply("Veuillez mentionner un utilisateur !");
        if (tomute.hasPermission("MANAGE_MESSAGES"))
            return message.reply("Vous n'avez pas la permission !");
        const role = message.guild.roles.cache.find((r) => r.name === "Muted");
        //start of create role
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
        //end of create role
        let mutetime = args[1];
        if (!mutetime) return message.reply("Veuillez spécifier un temps !");

        await tomute.roles.add(role);
        message.reply(
            ` <@${tomute.id}> est mute pendant ${ms(ms(mutetime))} !`
        );

        setTimeout(function () {
            tomute.roles.remove(role);
            message.channel.send(`<@${tomute.id}> n'est plus mute !`);
        }, ms(mutetime));
    },
};
