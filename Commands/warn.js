const fs = require("fs");
const sendError = require("../util/error");
const warnDb = JSON.parse(fs.readFileSync("./Commands/db/warns.json"));
const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "warn",
    description: "",

    /**
     *
     * @param {Client} bot
     * @param {Message} message
     * @param {*} args
     */

    async execute(bot, message, args) {
        let reason = args.slice(1).join(" ");
        let user = message.mentions.users.first();
        let warns = JSON.parse(
            fs.readFileSync("./Commands/db/warns.json", "utf8")
        );

        if (warns[`${message.guild.id}`]) {
            if (warns[`${message.guild.id}`][`${user.id}`]) {
                let id;

                if (!warns[`${message.guild.id}`][`${user.id}`]) {
                    id = 1;
                } else {
                    id =
                        warns[`${message.guild.id}`][`${user.id}`].warns
                            .length + 1;
                }

                warns[`${message.guild.id}`][`${user.id}`].warns.push({
                    id: id,
                    reason: reason,
                    mod: {
                        modName: message.member.displayName,
                        modID: message.author.id,
                    },
                });

                fs.writeFileSync(
                    "./Commands/db/warns.json",
                    JSON.stringify(warns)
                );
            } else {
                let id;

                if (!warns[`${message.guild.id}`][`${user.id}`]) {
                    id = 1;
                } else {
                    id =
                        warns[`${message.guild.id}`][`${user.id}`].warns
                            .length + 1;
                }

                warns[`${message.guild.id}`][`${user.id}`] = {
                    warns: [
                        {
                            id: id,
                            reason: reason,
                            mod: {
                                modName: message.member.displayName,
                                modID: message.author.id,
                            },
                        },
                    ],
                };

                fs.writeFileSync(
                    "./Commands/db/warns.json",
                    JSON.stringify(warns)
                );
            }
        } else {
            warns[`${message.guild.id}`] = {};

            if (warns[`${message.guild.id}`][`${user.id}`]) {
                console.log("OK");
            } else {
                let id;

                if (!warns[`${message.guild.id}`][`${user.id}`]) {
                    id = 1;
                } else {
                    id =
                        warns[`${message.guild.id}`][`${user.id}`].warns
                            .length + 1;
                }

                warns[`${message.guild.id}`][`${user.id}`] = {
                    warns: [
                        {
                            id: id,
                            reason: reason,
                            mod: {
                                modName: message.member.displayName,
                                modID: message.author.id,
                            },
                        },
                    ],
                };

                fs.writeFileSync(
                    "./Commands/db/warns.json",
                    JSON.stringify(warns)
                );
            }

            fs.writeFileSync("./Commands/db/warns.json", JSON.stringify(warns));
        }
    },
};
