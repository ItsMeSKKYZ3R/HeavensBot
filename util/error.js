const { MessageEmbed } = require("discord.js");

/**
 * @param {String} texte
 * @param {TextChannel} channel
 */

module.exports = async (texte, channel) => {
    let embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(text)
        .setFooter("Quelque chose s'est mal passée.");
    await channel.send(embed);
};
