const fs = require("fs");
const Discord = require("discord.js");
let loc = require("../dbloc.json");
let json = require("ezyjson");
let dbPrefix = new json(`${loc.loc}\\prefix.json`);
let prefix;

module.exports = {
    name: "help",
    description: "Donne la liste des commandes.",

    /**
     *
     * @param {Discord.Client} bot
     * @param {Discord.Message} message
     * @param {*} args
     */

    execute(bot, message, args) {
        if (!dbPrefix.getValue(`${message.guild.id}`)) {
            prefix = "!";
        } else {
            prefix = dbPrefix.getValue(`${message.guild.id}`);
        }

        let embed = new Discord.MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setColor("#00ff00")
            .setDescription("Voici la liste des catégories")
            .addField(
                `${prefix}help admin`,
                "Affiche la liste des commandes d'administration"
            )
            .addField(
                `${prefix}help mod`,
                "Affiche la liste des commandes de modération"
            )
            .addField(
                `${prefix}help fun`,
                "Affiche la liste des commandes funs"
            )
            .addField(
                `${prefix}help support`,
                "Affiche la liste des commandes de support"
            )
            .addField(
                `${prefix}help infos`,
                "Affiche la liste des commandes d'informations"
            )
            .addField(
                `${prefix}help musique`,
                "Affiche la liste des commandes de musique"
            )
            .setFooter(`© ${bot.user.username} `)
            .setTimestamp(new Date());

        let admin = new Discord.MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setColor("#00ff00")
            .setDescription("Catégorie administration de la page d'aide")
            .addField(
                `${prefix}set-bvn`,
                "Lance la configuration du message et du salon de bienvenue"
            )
            .addField(
                `${prefix}set-role`,
                "Lance la configuration du rôle à attribuer aux nouveaux membres"
            )
            .addField(
                `${prefix}set-log-channel`,
                "Lance la configuration du salon des logs"
            )
            .addField(
                `${prefix}set-msg-verify-lvl`,
                "La la configuration du niveau de sanction pour les insultes"
            )
            .addField(
                `${prefix}set-spam-lvl`,
                "Lance la configuration du niveau de sanctions pour le spam"
            )
            .addField(
                `${prefix}del-antispam`,
                "Supprime l'antispam sur le serveur"
            )
            .addField(
                `${prefix}prefix <prefix>`,
                "Définit un nouveau prefix sur le serveur"
            )
            .addField(
                `${prefix}règlement <texte>`,
                "Envoie votre règlement en embed dans le salon courant"
            )
            .setFooter(
                `© ${bot.user.username} | <paramètres obligatoires> | [paramètres optionnels]`
            )
            .setTimestamp(new Date());

        let mod = new Discord.MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setColor("#00ff00")
            .setDescription("Catégorie modération de la page d'aide")
            .addField(`${prefix}ban <@user>`, "Ban un membre")
            .addField(
                `${prefix}clear <nombre>`,
                "Supprime un nombre donné de messages dans le salon courant"
            )
            .addField(`${prefix}débat <sujet>`, "Lance un débat")
            .addField(`${prefix}mute <@user>`, "Rend l'utilisateur muet")
            .addField(`${prefix}kick <@user>`, "Expulse l'utilisateur")
            .addField(
                `${prefix}sondage <texte>`,
                "Lance un sondage dans le salon courant"
            )
            .addField(
                `${prefix}tempmute <@user> <temps>`,
                "Rend l'utilisateur muet pendant une période donnée. d = jour ; h = heure ; m = minute ; s = seconde"
            )
            .addField(
                `${prefix}unban <id>`,
                "Retire un utilisateur de la liste des bannissements"
            )
            .addField(
                `${prefix}unmute <@user>`,
                "Rend à l'utilisateur la permission de parler"
            )
            .setFooter(
                `© ${bot.user.username} | <paramètres obligatoires> | [paramètres optionnels] `
            )
            .setTimestamp(new Date());

        let fun = new Discord.MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setColor("#00ff00")
            .setDescription("Catégorie fun de la page d'aide")
            .addField(
                `${prefix}8ball <question>`,
                "Répond aléatoirement à la question"
            )
            .addField(
                `${prefix}bat`,
                "Envoie une image aléatoire de chauve-souris"
            )
            .addField(`${prefix}cat`, "Envoie une image aléatoire de chat")
            .addField(
                `${prefix}calc <calcul>`,
                "Vous fait un calcul (* = multiplier ; / = diviser ; ^ = mettre en exposant)"
            )
            .addField(`${prefix}coin`, "Fait un pile ou face")
            .addField(`${prefix}dog`, "Envoie une image aléatoire de chien")
            .addField(
                `${prefix}ddg <recherche>`,
                "Effectue une recherche sur duckduckgo"
            )
            .addField(
                `${prefix}embed <message>`,
                "Envoie votre message en embed"
            )
            .addField(
                `${prefix}google <recherche>", "Effectue une recherche sur google`
            )
            .addField(`${prefix}say <phrase>`, "Fait dire une phrase au bot")
            .addField(
                `${prefix}t <langue> <texte>`,
                "Traduit le texte dans la langue choisie"
            )
            .setFooter(
                `© ${bot.user.username} | <paramètres obligatoires> | [paramètres optionnels] `
            )
            .setTimestamp(new Date());

        let support = new Discord.MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setColor("#00ff00")
            .setDescription("Catégorie support de la page d'aide")
            .addField(
                `${prefix}bug <descriptif>`,
                "Envoie un rapport de bug sur le serveur support"
            )
            .addField(
                `${prefix}invite`,
                "Vous donne le lien pour ajouter le bot sur votre serveur"
            )
            .addField(
                `${prefix}suggest <suggestion>`,
                "Envoie une suggestion sur le serveur de support"
            )
            .addField(`${prefix}support`, "Donne le lien du serveur de support")
            .setFooter(
                `© ${bot.user.username} | <paramètres obligatoires> | [paramètres optionnels] `
            )
            .setTimestamp(new Date());

        let infos = new Discord.MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setColor("#00ff00")
            .setDescription("Catégorie informations de la page d'aide")
            .addField(
                `${prefix}avatar <@user>`,
                "Donne l'avatar de l'utilisateur"
            )
            .addField(`${prefix}botinfo`, "Donne les informations sur le bot")
            .addField(
                `${prefix}emojislist`,
                "Donne la liste des emojis du serveur"
            )
            .addField(
                `${prefix}rank [@user]`,
                "Donne le niveau de l'utilisateur"
            )
            .addField(
                `${prefix}roleinfo <nom du rôle>`,
                "Donne les informations sur le rôle"
            )
            .addField(
                `${prefix}rolelist`,
                "Donne la liste des rôles sur le serveur"
            )
            .addField(
                `${prefix}serverinfo`,
                "Donne les informations sur le serveur"
            )
            .addField(
                `${prefix}stats [@user]`,
                "Donne les informations sur l'utilisateur (alias userinfo)"
            )
            .addField(
                `${prefix}userinfo [@user]`,
                "Donne les informations sur l'utilisateur (alias stats)"
            )
            .addField(
                `${prefix}weather <ville>`,
                "Donne la météo dans la ville"
            )
            .addField(
                `${prefix}wiki <recherche>`,
                "Donne les informations trouvées sur Wikipedia"
            )
            .setFooter(
                `© ${bot.user.username} | <paramètres obligatoires> | [paramètres optionnels] `
            )
            .setTimestamp(new Date());

        let musique = new Discord.MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setColor("#00ff00")
            .setDescription("Catégorie musique de la page d'aide")
            .addField(`${prefix}afk`, "Active ou désactive le mode 24/7")
            .addField(
                `${prefix}loop`,
                "Active ou désactive le mode boucle sur la musique en cours"
            )
            .addField(
                `${prefix}lyrics`,
                "Affiche les paroles de la musique en cours"
            )
            .addField(
                `${prefix}nowplaying`,
                "Donne les informations de la musique en cours"
            )
            .addField(`${prefix}pause`, "Met la musique en pause")
            .addField(
                `${prefix}play <nom de la musique ou lien YouTube>`,
                "Joue une musique"
            )
            .addField(
                `${prefix}playlist <nom de la playlist ou lien YouTube>`,
                "Joue une playlist"
            )
            .addField(
                `${prefix}queue`,
                "Donne la liste des musiques en attente"
            )
            .addField(
                `${prefix}remove <numéro dans la queue>`,
                "Supprime une musique de la queue"
            )
            .addField(`${prefix}resume`, "Reprend la musique")
            .addField(
                `${prefix}search <nom>`,
                "Cherche une musique en envoie les informations de celle-ci"
            )
            .addField(
                `${prefix}shuffle`,
                "Active ou désactive la lecture aléatoire"
            )
            .addField(`${prefix}skip`, "Passe à la musique suivante")
            .addField(
                `${prefix}skipto <numéro dans la queue>`,
                "Passe à la musique souhaitée"
            )
            .addField(`${prefix}stop`, "Arrête la musique")
            .addField(
                `${prefix}volume <nombre de 1 à 100>`,
                "Définit le volume au niveau voulu"
            )
            .setFooter(
                `© ${bot.user.username} | <paramètres obligatoires> | [paramètres optionnels] `
            )
            .setTimestamp(new Date());

        let page = args.join(" ").toLowerCase();

        if (!page) {
            message.channel.send(embed);
        }

        if (page == "admin") {
            message.channel.send(admin);
        }

        if (page == "mod") {
            message.channel.send(mod);
        }

        if (page == "fun") {
            message.channel.send(fun);
        }

        if (page == "support") {
            message.channel.send(support);
        }

        if (page == "infos") {
            message.channel.send(infos);
        }

        if (page == "musique" || page == "music") {
            message.channel.send(musique);
        }
    },
};
