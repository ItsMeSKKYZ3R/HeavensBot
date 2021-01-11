const {
    Client,
    Message,
    MessageEmbed,
    MessageAttachment,
} = require("discord.js");

const face = [
    "https://assets.stickpng.com/images/580b585b2edbce24c47b27c1.png",
    "https://upload.wikimedia.org/wikipedia/fr/3/34/Piece-2-euros-commemorative-2012-france.png",
];

module.exports = {
    name: "coin",
    description: "Donne une face aléatoire",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {*} args
     */

    execute(bot, message, args) {
        let nbr = Math.floor(Math.random() * face.length);

        const newFace = face[nbr];

        let text;

        if (nbr == 0) {
            text = `Le résultat de votre lancé est pile`;
        } else {
            text = `Le résultat de votre lancé est face`;
        }

        let embed = new MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(text)
            .setImage(newFace)
            .setFooter(`© ${bot.user.username} `)
            .setTimestamp(new Date());

        return message.channel.send(embed);
    },
};
