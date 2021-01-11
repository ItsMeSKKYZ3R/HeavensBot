const {
    Client,
    Message,
    MessageAttachment,
    MessageEmbed,
} = require("discord.js");

const Canvas = require("canvas");

const loc = require("../dbloc.json");
const json = require("ezyjson");

let dbBvnChannel = new json(`${loc.loc}/bvnChannel.json`);
let dbBvnMsg = new json(`${loc.loc}/bvnMessage.json`);
let dbLogs = new json(`${loc.loc}/dblogs.json`);
let dbSpamLvl = new json(`${loc.loc}/dbSpamLvl.json`);
let dbMsgVerify = new json(`${loc.loc}/dbMsgVerify.json`);
let money = new json(`${loc.loc}/money.json`);
let recent = new json(`${loc.loc}/recent.json`);
let warns = new json(`${loc.loc}/warns.json`);
let roles = new json(`${loc.loc}/roles.json`);
let dbprefix = new json(`${loc.loc}/prefix.json`);

module.exports = {
    name: "canvas",
    description: "",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {*} args
     */

    async execute(bot, message, args) {
        let msg;

        if (dbBvnMsg.getValue(`${message.guild.id}`)) {
            msg = dbBvnMsg
                .getValue(`${message.guild.id}`)
                .replace("{member.user}", message.author.username)
                .replace("{guild.name}", message.guild.name)
                .replace("{guild.member_count}", message.guild.memberCount)
                .replace("{member.username}", message.author.username);
        } else {
            msg = `Hey bienvenue sur ${message.guild.name} !`;
        }

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "border: none";
        ctx.strokeStyle = "transparent";
        ctx.strokeRect(0, 0, canvas.width - 5, canvas.height - 5);
        ctx.font = "30px Arial";
        ctx.fillStyle = "#F8F8F8";
        ctx.fillText(`Bienvenue`, canvas.width / 2.5, canvas.height / 2.8);
        ctx.fillStyle = "#ff0000";
        ctx.font = "bold 35px Arial, sans-serif";
        ctx.fillText(
            `${message.author.username}`,
            canvas.width / 2.5,
            canvas.height / 1.5
        );
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(
            message.author.displayAvatarURL({ format: "jpg" })
        );
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new MessageAttachment(
            canvas.toBuffer(),
            "welcome.png"
        );

        let embed = new MessageEmbed()
            .setTitle("Oh un nouveau membre !")
            .setDescription(msg)
            .setColor("#0000ff")
            .attachFiles(attachment)
            .setImage("attachment://welcome.png");

        message.channel.send(embed);
    },
};
