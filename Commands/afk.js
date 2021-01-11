const { Client, Message, MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const fs = require("fs");

module.exports = {
    name: "afk",
    description: "",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {*} args
     */

    execute(bot, message, args) {
        let afk = JSON.parse(fs.readFileSync("./afk.json", "utf8"));
        if (!afk[message.guild.id])
            afk[message.guild.id] = {
                afk: false,
            };
        var serverQueue = afk[message.guild.id];
        if (serverQueue) {
            serverQueue.afk = !serverQueue.afk;
            message.channel.send({
                embed: {
                    color: "GREEN",
                    description: `💤  **|**  Le mode AFK est **\`${
                        serverQueue.afk === true ? "activé" : "désactivé"
                    }\`**`,
                },
            });
            return fs.writeFile("./afk.json", JSON.stringify(afk), (err) => {
                if (err) console.error(err);
            });
        }
        return sendError("Rien ne se joue sur le serveur.", message.channel);
    },
};
