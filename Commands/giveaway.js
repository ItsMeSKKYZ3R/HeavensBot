const ms = require("ms");
const sendError = require("../util/error");
const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "giveaway",
    description: "Starts a giveaway",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {Array<String|Number>} args
     */

    async execute(bot, message, args) {
        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return sendError(
                "Vous n'avez pas la permission de commencer un giveaway",
                message.channel
            );

        let channel = message.mentions.channels.first();

        if (!channel)
            return sendError("Veuillez préciser un salon", message.channel);

        let giveawayDuration = args[1];

        if (!giveawayDuration || isNaN(ms(giveawayDuration)))
            return sendError(
                "Veuillez préciser une durée valide",
                message.channel
            );

        let giveawayWinners = args[2];

        if (isNaN(giveawayWinners) || parseInt(giveawayWinners) <= 0)
            return sendError(
                "Veuillez préciser un nombre de gagnant(s) valide",
                message.channel
            );

        let giveawayPrize = args.slice(3).join(" ");

        if (!giveawayPrize)
            return message.channel.send(
                "Veuillez préciser un prix",
                message.channel
            );

        bot.giveawaysManager.start(channel, {
            time: ms(giveawayDuration),
            prize: giveawayPrize,
            winnerCount: giveawayWinners,
            hostedBy: message.author.username,

            messages: {
                giveaway: "NOUVEAU GIVEAWAY !",
                giveawayEnded: "Giveaway terminé !",
                timeRemaining: "Temps restant : **{duration}**",
                inviteToParticipate: "Réagissez avec 🎉 pour participer",
                winMessage: "Bravo {winners}, vous avez gagné **{prize}** !",
                embedFooter: "Giveaway en cours !",
                noWinner:
                    "Je n'ai pas pu choisir de gagnant(s), il n'y avait pas assez de participants",
                hostedBy: "Giveaway par {user}",
                winners: "gagnant(s)",
                endedAt: "Terminé le",
                units: {
                    seconds: "secondes",
                    minutes: "minutes",
                    hours: "heures",
                    days: "jours",
                    pluralS: false,
                },
            },
        });

        message.channel.send(`Giveaway démarré dans le salon ${channel}`);
    },
};
