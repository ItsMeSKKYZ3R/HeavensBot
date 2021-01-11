const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
let prefix;
const json = require("ezyjson");
const dbPrefix = new json(`${__dirname}/db/prefix.json`);

module.exports = {
    name: "",
    description: "",
    async execute(client, message, args) {
        if (!dbPrefix.getValue(`${message.guild.id}`)) {
            prefix = "!";
        } else {
            prefix = dbPrefix.getValue(`${message.guild.id}`);
        }

        const permissions = message.channel.permissionsFor(message.client.user);
        if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"]))
            return sendError(
                "Je n'ai pas la permission de gérer les messages ou d'ajouter des réactions.",
                message.channel
            );

        const queue = message.client.queue.get(message.guild.id);
        if (!queue)
            return sendError(
                "Rien ne se joue sur le serveur.",
                message.channel
            );

        let currentPage = 0;
        const embeds = generateQueueEmbed(message, queue.songs);

        const queueEmbed = await message.channel.send(
            `**\`${currentPage + 1}\`**/**${embeds.length}**`,
            embeds[currentPage]
        );

        try {
            await queueEmbed.react("⬅️");
            await queueEmbed.react("🛑");
            await queueEmbed.react("➡️");
        } catch (error) {
            console.error(error);
            message.channel.send(error.message).catch(console.error);
        }

        const filter = (reaction, user) =>
            ["⬅️", "🛑", "➡️"].includes(reaction.emoji.name) &&
            message.author.id === user.id;
        const collector = queueEmbed.createReactionCollector(filter, {
            time: 60000,
        });

        collector.on("collect", async (reaction, user) => {
            try {
                if (reaction.emoji.name === "➡️") {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        queueEmbed.edit(
                            `**\`${currentPage + 1}\`**/**${embeds.length}**`,
                            embeds[currentPage]
                        );
                    }
                } else if (reaction.emoji.name === "⬅️") {
                    if (currentPage !== 0) {
                        --currentPage;
                        queueEmbed.edit(
                            `**\`${currentPage + 1}\`**/**${embeds.length}**`,
                            embeds[currentPage]
                        );
                    }
                } else {
                    collector.stop();
                    reaction.message.reactions.removeAll();
                }
                await reaction.users.remove(message.author.id);
            } catch (error) {
                console.error(error);
                return message.channel.send(error.message).catch(console.error);
            }
        });
    },
};

function generateQueueEmbed(message, queue) {
    let embeds = [];
    let k = 10;

    for (let i = 0; i < queue.length; i += 10) {
        const current = queue.slice(i, k);
        let j = i;
        k += 10;

        const info = current
            .map(
                (track) => `**\`${++j}\`** | [\`${track.title}\`](${track.url})`
            )
            .join("\n");

        const serverQueue = message.client.queue.get(message.guild.id);
        const embed = new MessageEmbed()
            .setAuthor(
                "Liste des musiques dans la queue.",
                "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif"
            )
            .setThumbnail(message.guild.iconURL())
            .setColor("BLUE")
            .setDescription(`${info}`)
            .addField("En cours", `[${queue[0].title}](${queue[0].url})`, true)
            .addField("Demandée dans", serverQueue.textChannel, true)
            .addField("Se joue dans", serverQueue.voiceChannel, true)
            .setFooter("Volume : " + serverQueue.volume);
        if (serverQueue.songs.length === 1)
            embed.setDescription(
                `Aucune musique ne suit celle-ci. Ajoutez-en avec la commande \`\`${prefix}play <nom de la musique ou lien YouTube>\`\``
            );

        embeds.push(embed);
    }

    return embeds;
}
