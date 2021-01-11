const Discord = require("discord.js");

module.exports = {
    name: "avatar",
    description: "Donne l'image de profil du membre mentionné",
    execute(bot, message, args) {
        var user = message.mentions.users.first();

        if (!user) {
            const avatar_embed = new Discord.MessageEmbed()
                .setTitle("Votre avatar !")
                .setImage(message.author.displayAvatarURL())
                .setColor("RANDOM");

            return message.channel.send(avatar_embed);
        }

        const avatar_embed = new Discord.MessageEmbed()
            .setTitle(`Avatar de ${user.tag}`)
            .setImage(user.displayAvatarURL())
            .setColor("RANDOM");

        return message.channel.send(avatar_embed);
    },
};
