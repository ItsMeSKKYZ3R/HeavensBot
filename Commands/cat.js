const { Message, Client, MessageEmbed } = require("discord.js");
const cheerio = require("cheerio");
const request = require("request");

module.exports = {
    name: "cat",
    description: "",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {*} args
     */

    execute(bot, message, args) {
        function image() {
            let options = {
                url: `https://results.dogpile.com/serp?qc=images&q=cat`,
                method: "GET",
                headers: {
                    Accept: "text/html",
                    "User-Agent": "Chrome",
                },
            };

            request(options, (err, res, resbody) => {
                if (err) return console.log(err);

                $ = cheerio.load(resbody);

                let links = $(".image a.link");

                let urls = new Array(links.length)
                    .fill(0)
                    .map((v, i) => links.eq(i).attr("href"));

                if (!urls.length) {
                    return;
                }

                let embed = new MessageEmbed()
                    .setAuthor(
                        message.author.tag,
                        message.author.displayAvatarURL({ dynamic: true })
                    )
                    .setDescription("Miaou")
                    .setImage(urls[Math.floor(Math.random() * urls.length)])
                    .setFooter(`© ${bot.user.username} `)
                    .setTimestamp(new Date());

                message.channel.send(message.author, embed);
            });
        }

        image();
    },
};
