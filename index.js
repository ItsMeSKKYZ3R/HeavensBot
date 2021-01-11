const Discord = require("discord.js");
const canvacord = require("canvacord");
const fs = require("fs");
const moment = require("moment-timezone");
const Canvas = require("canvas");

moment.locale("fr");

const bot = new Discord.Client({
    messageCacheMaxSize: 10,
    messageCacheLifetime: 10,
    messageEditHistoryMaxSize: 0,
});

bot.commands = new Discord.Collection();
bot.queue = new Map();

const { GiveawaysManager } = require("discord-giveaways");

bot.giveawaysManager = new GiveawaysManager(bot, {
    storage: "./Commands/db/giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        embedColor: "#ff0000",
        reaction: "🎉",
    },
});

bot.on("ready", () => {
    console.log(`Connecté en tant que ${bot.user.tag} (${bot.user.id})`);
});

function format(toFormat) {
    return moment(toFormat).tz("Europe/Paris").format("[Le] L [à] LTS");
}

const commands = fs.readdirSync("./Commands").filter((f) => f.endsWith(".js"));

for (let f of commands) {
    let files = require(`./Commands/${f}`);

    bot.commands.set(files.name, files);

    console.log(`Commande ${f.replace(".js", "")} chargée`);
}

fs.readdir("./Events/", (error, f) => {
    if (error) {
        console.log(error);
    }

    f.forEach((f) => {
        const events = require(`./Events/${f}`);
        const event = f.split(".")[0];

        bot.on(event, events.bind(null, bot));

        console.log(`Event ${f.replace(".js", "")} chargé !`);
    });
});

bot.on("channelCreate", (channel) => {
    let msgLogs = `Le salon "${channel.name}" a été créé`;

    if (channel.guild) {
        let channelLogs = dbLogs.getValue(`${channel.guild.id}`);

        let embed = new Discord.MessageEmbed()
            .setAuthor(channel.guild.name)
            .setColor("#0000ff")
            .setDescription(msgLogs)
            .setTimestamp()
            .setFooter(`© ${bot.user.username} `);

        bot.channels.cache.get(channelLogs).send(embed);
    }
});

bot.on("messageDelete", (message) => {
    let msgLogs = `Un message a été supprimé`;

    let channelLogs = dbLogs.getValue(`${message.guild.id}`);

    if (message.content) {
        let embed = new Discord.MessageEmbed()
            .setTitle(message.guild.name)
            .setColor("#0000ff")
            .setDescription(msgLogs)
            .addField("Contenu du message", message.content)
            .addField("Auteur", message.author.tag)
            .addField("Envoyé le", format(message.createdAt))
            .setTimestamp()
            .setFooter(`© ${bot.user.username} `);

        if (channelLogs) {
            bot.channels.cache.get(channelLogs).send(embed);
        } else {
            return;
        }
    } else {
        return;
    }
});

const json = require("ezyjson");
const loc = require("./dbloc.json");

const prefix = require(`${loc.loc}/prefix.json`);
const xp = require(`${loc.loc}/xp.json`);
let recent = require(`${loc.loc}/recent.json`);
let dbBvnChannel = new json(`${loc.loc}/bvnChannel.json`);
let dbBvnMsg = new json(`${loc.loc}/bvnMessage.json`);
let dbLogs = new json(`${loc.loc}/dblogs.json`);
let dbSpamLvl = new json(`${loc.loc}/dbSpamLvl.json`);
let dbMsgVerify = new json(`${loc.loc}/dbMsgVerify.json`);
let money = new json(`${loc.loc}/money.json`);
let warns = new json(`${loc.loc}/warns.json`);
let roles = new json(`${loc.loc}/roles.json`);

bot.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(prefix[`${message.guild.id}`] || "!"))
        return;

    if (message.author.bot) return;
    if (message.content.startsWith(prefix)) return;

    let xpAdd = Math.floor(Math.floor(15 + Math.random() * (20 + 1 - 15)));

    if (!xp[`${message.guild.id}-${message.author.id}`]) {
        xp[`${message.guild.id}-${message.author.id}`] = {
            xp: 0,
            level: 0,
        };
    }

    let curxp = xp[`${message.guild.id}-${message.author.id}`].xp;
    let curlvl = xp[`${message.guild.id}-${message.author.id}`].level;
    let nxtLvl =
        5 * Math.pow(xp[`${message.guild.id}-${message.author.id}`].level, 2) +
        50 * xp[`${message.guild.id}-${message.author.id}`].level +
        100;

    console.log(nxtLvl);

    if (recent[`${message.author.id}-xp`] === true) {
        return;
    } else {
        xp[`${message.guild.id}-${message.author.id}`].xp = curxp + xpAdd;

        if (nxtLvl <= xp[`${message.guild.id}-${message.author.id}`].xp) {
            xp[`${message.guild.id}-${message.author.id}`].level = curlvl + 1;

            const canvas = Canvas.createCanvas(700, 250);
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "border: none";
            ctx.strokeStyle = "transparent";
            ctx.strokeRect(0, 0, canvas.width - 5, canvas.height - 5);
            ctx.font = "30px Arial";
            ctx.fillStyle = "#F8F8F8";
            ctx.fillText(`Bravo`, canvas.width / 2.5, canvas.height / 2);
            ctx.fillStyle = "#ff0000";
            ctx.font = "bold 35px Arial, sans-serif";
            ctx.fillText(
                `${message.member.displayName}`,
                canvas.width / 2.5,
                canvas.height / 1.5
            );
            ctx.font = "30px Arial";
            ctx.fillText(
                `tu viens de passer niveau ${curlvl + 1}`,
                canvas.width / 2.5,
                canvas.height / 1.2
            );
            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            const avatar = await Canvas.loadImage(
                message.author.displayAvatarURL({ format: "jpg" })
            );
            ctx.drawImage(avatar, 25, 25, 200, 200);

            const attachment = new Discord.MessageAttachment(
                canvas.toBuffer(),
                "level-up.png"
            );
            const embed = new Discord.MessageEmbed()
                .setImage("attachment://level-up.png")
                .attachFiles(attachment);

            message.channel.send(embed);

            console.log(nxtLvl);
        }

        recent[`${message.author.id}-xp`] = true;

        fs.writeFile(
            `${__dirname}/Commands/db/recent.json`,
            JSON.stringify(recent),
            (err) => {
                if (err) console.log(err);
            }
        );

        console.log("ADDED");

        setTimeout(() => {
            recent = {};
            fs.writeFile(
                `${__dirname}/Commands/db/recent.json`,
                JSON.stringify(recent),
                (err) => {
                    if (err) console.log(err);
                }
            );
            console.log("REMOVED");
        }, 60 * 1000);
    }

    fs.writeFile(
        `${__dirname}/Commands/db/xp.json`,
        JSON.stringify(xp),
        (err) => {
            if (err) console.log(err);
        }
    );
});

bot.on("message", (message) => {
    let blacklisted = [
        "connard",
        "pute",
        "salope",
        "connard",
        "enculer",
        "enculé",
        "enculée",
        "nique ta mère",
        "nique ta mere",
        "va te faire enculer",
        "va te faire enculé",
        "vas te faire enculer",
        "vas te faire enculé",
        "va te faire enculée",
        "salop",
        "nique ta grand mère",
        "nik ta mère",
        "connasse",
        "pétasse",
        "conard",
        "Va te faire niquer",
        "Je t'emmerde",
    ];

    let found = false;
    let word;

    for (var i in blacklisted) {
        if (message.content.toLowerCase().includes(blacklisted[i])) {
            found = true;
            word = blacklisted[i];
        }
    }

    if (found) {
        let niveau = dbMsgVerify.getValue(`${message.guild.id}`);

        if (niveau.toLowerCase() == "low") {
            message.delete();
            message.member.send(`Le terme ${word} n'est pas autorisé.`);
        } else if (niveau.toLowerCase() == "medium") {
            message.delete();
            message.member.send(`Le terme ${word} n'est pas autorisé.`);
            let role = message.guild.roles.cache.get((r) => r.name == "Muted");

            if (role) {
                message.guild.channels.cache.forEach((chan) => {
                    chan.overwritePermissions([
                        {
                            id: role.id,
                            deny: ["SEND_MESSAGES"],
                        },
                    ]).then(() => {
                        message.member.roles.add(role);
                    });
                });
            } else {
                role = message.guild.roles
                    .create({
                        data: {
                            name: "Muted",
                            color: "GRAY",
                            permissions: [],
                        },
                        reason: 'Le serveur n\'avait pas de rôle "Muted".',
                    })
                    .then((role) => {
                        message.guild.channels.cache.forEach((chan) => {
                            if (chan.type == "news" || chan.type == "store") {
                                return;
                            } else {
                                chan.overwritePermissions([
                                    {
                                        id: role.id,
                                        deny: ["SEND_MESSAGES"],
                                    },
                                ]).then(() => {
                                    message.member.roles.add(role);
                                });
                            }
                        });
                    });
            }
        } else if (niveau.toLowerCase() == "high") {
            message.delete();
            message.member.send(
                `Vous avez été exclu de **${message.guild.name}** pour mauvais langage`
            );
            message.member.kick("Mauvais langage");
        }
    }

    if (message.author.bot) return;
    if (message.member.hasPermission("ADMINISTRATOR" || "MANAGE_MESSAGES"))
        return;

    let userMap = new Discord.Collection();

    if (userMap.has(message.author.id)) {
        const userData = userMap.get(message.author.id);
        var msgCount = userData.msgCount;

        if (parseInt(msgCount) === 5) {
            let role = message.guild.roles.cache.find(
                (r) => r.name === "Muted"
            );

            if (role) {
                message.guild.channels.cache.forEach((chan) => {
                    chan.overwritePermissions([
                        {
                            id: role.id,
                            deny: ["SEND_MESSAGES"],
                        },
                    ]);
                });
                message.member.roles.add(role);
                userMap.delete(message.author.id);
            } else {
                role = message.guild.roles
                    .create({
                        data: {
                            name: "Muted",
                            color: "GRAY",
                            permissions: [],
                        },
                        reason: 'Le serveur n\'avait pas de rôle "Muted".',
                    })
                    .then((role) => {
                        message.guild.channels.cache.forEach((chan) => {
                            chan.overwritePermissions([
                                {
                                    id: role.id,
                                    deny: ["SEND_MESSAGES"],
                                },
                            ]).then(() => {
                                message.member.roles.add(role);
                                userMap.delete(message.author.id);
                            });
                        });
                    });
            }

            if (message.member.roles.cache.has("Muted")) {
                setTimeout(() => {
                    message.member.roles.remove(role);
                }, 3600000);
            }

            const embed = new Discord.MessageEmbed()
                .setAuthor(bot.user.username)
                .setColor("#ff0000")
                .setDescription(
                    `Vous avez été mute dans ${message.guild.name} pour spam pendant 1h !`
                )
                .setFooter(`© ${bot.user.username}`)
                .setTimestamp(new Date());

            const member_mute = new Discord.MessageEmbed()
                .setAuthor(bot.user.username)
                .setColor("#ff0000")
                .setDescription(
                    `${message.member.user.tag} a été mute pour spam pendant 1h !`
                )
                .setFooter(`© ${bot.user.username}`)
                .setTimestamp(new Date());

            setTimeout(() => {
                message.member.send(embed);
                message.channel.send(member_mute);
            }, 500);
        } else {
            msgCount++;
            userData.msgCount = msgCount;
            userMap.set(message.author.id, userData);
        }
    } else {
        userMap.set(message.author.id, {
            msgCount: 1,
            lastMessage: message,
            timer: null,
        });

        setTimeout(() => {
            userMap.delete(message.author.id);
        }, 2000);
    }
});

bot.on("guildMemberAdd", async (member) => {
    let salon = dbBvnChannel.getValue(`${member.guild.id}`);
    let msg = dbBvnMsg.getValue(`${member.guild.id}`);

    let channelLogs = dbLogs.getValue(`${member.guild.id}`);

    if (msg && salon) {
        msg = msg
            .replace("{member.user}", member.user.username)
            .replace("{guild.name}", member.guild.name)
            .replace("{guild.member_count}", member.guild.memberCount)
            .replace("{member.username}", member.user.username);

        if (dbBvnMsg.getValue(`${member.guild.id}`)) {
            msg = dbBvnMsg
                .getValue(`${member.guild.id}`)
                .replace("{member.user}", member.user.username)
                .replace("{guild.name}", member.guild.name)
                .replace("{guild.member_count}", member.guild.memberCount)
                .replace("{member.username}", member.user.username);
        } else {
            msg = `Hey bienvenue sur ${member.guild.name} !`;
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
            `${member.user.username}`,
            canvas.width / 2.5,
            canvas.height / 1.5
        );
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(
            member.user.displayAvatarURL({ format: "jpg" })
        );
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new Discord.MessageAttachment(
            canvas.toBuffer(),
            "welcome.png"
        );

        let embed = new Discord.MessageEmbed()
            .setTitle("Oh un nouveau membre !")
            .setDescription(msg)
            .setColor("#0000ff")
            .attachFiles(attachment)
            .setImage("attachment://welcome.png");

        bot.channels.cache.get(salon).send(embed);
    } else {
        return;
    }

    if (roles.getValue(`${member.guild.id}`)) {
        let role = roles.getValue(`${member.guild.id}`);

        let roleToGive = member.guild.roles.cache.get(role);

        member.roles.add(roleToGive);
    }

    if (channelLogs) {
        let msgLogs = `${member.user.username} (${member.user.tag}) a rejoint le serveur.`;

        let now = Date.now();
        let createdAt = member.user.createdAt;
        let age = now - createdAt;

        let embed = new Discord.MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .setColor("#0000ff")
            .setDescription(msgLogs)
            .addField("Nom d'utilisateur", member.user.username, true)
            .addField(
                "Tag",
                member.user.tag.replace(member.user.username, ""),
                true
            )
            .addField(
                "Compté créé le",
                `${moment(member.user.createdAt)
                    .tz("Europe/Paris")
                    .format("[Le] L [à] LTS")}`
            )
            .setTimestamp()
            .setFooter(`© ${bot.user.username} `);

        bot.channels.cache.get(channelLogs).send(embed);
    }
});

bot.login("Nzg5MjAxMzQzOTE1MDk4MTEy.X9unBw.nbUVtxaJqRD--ORpmcBnz9ly4uU");
