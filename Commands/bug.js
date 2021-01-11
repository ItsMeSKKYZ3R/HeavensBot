const {
    Client,
    Message,
    MessageEmbed,
    DiscordAPIError,
} = require("discord.js");

module.exports = {
    name: "bug",
    description: "",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {*} args
     */

    execute(bot, message, args) {
        message.delete();

        let channel = bot.guilds.cache
            .get("745572682732535850")
            .channels.cache.get("747189645506510920");

        let bug = args.join(" ").slice(0);

        let embed = new MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setColor("#ff0000")
            .setDescription(bug)
            .setTitle("Nouveau bug rapporté")
            .setFooter(`© ${bot.user.username} `, bot.user.displayAvatarURL())
            .setTimestamp(new Date());

        channel.send(embed);
    },
};
