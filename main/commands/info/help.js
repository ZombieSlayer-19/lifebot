const Discord = require("discord.js");
const dualox = require("dualox-js");
const {config} = require("dotenv");
config({
    path: __dirname + "/.env"
});
const prefix = process.env.prefix;

module.exports = {
    name: "help",
    aliases: ["idk", "lost", "confused"],
    category: "info",
    usage: "!help [command name]",
    description: "Use the help command to learn how to use the bot!",
    run: async(bot,message,args) => {
        if(args[0]) {
            if(args[0].toLowerCase() == "help") return message.channel.send(`Just use the command \`${prefix}help\``);
            return getOne(bot,message,args[0]);
        }else return getAll(bot,message);
    }
}

function getAll(bot,message) {
    var allEmbed = new Discord.MessageEmbed()
    .setColor(Discord.EmbedColor)
    .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
    .setTitle(`${bot.user.username}'s Help Menu`)
    .setAuthor("Do !help <command name> for help on that specific command!")
    .addField("Visit Our Website!", dualox.newLink("Genesis' Website!", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"))
    .addField("Add Genesis!", dualox.newLink("Add Geneses To Your Server!", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"))
    .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
    .setTimestamp()

    var commands = (category) => {
        return bot.commands.filter(cmd => cmd.category === category).map(cmd => `${prefix + cmd.name}`).join(", ");
    }

    var info = bot.categories
    .map(cat => `**__ ${cat[0].toUpperCase() + cat.slice(1)} __** \n${commands(cat)}\n`)
    .reduce((string, category) => string + "\n" + category);

    return message.channel.send(allEmbed.setDescription(info));
}

function getOne(bot,message,input) {
    var oneEmbed = new Discord.MessageEmbed()
    .setColor(Discord.EmbedColor)
    .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))

    var cmd = bot.commands.get(input.toLowerCase()) || bot.commands.get(bot.aliases.get(input.toLowerCase()));

    var info = `No information was found for the command \`${prefix + input.toLowerCase()}\``;

    if(!cmd) return message.channel.send(oneEmbed.setDescription(info));

    if(cmd.name) title = `**Command Name:** \`${prefix + cmd.name}\`\n`;
    if(cmd.aliases) info = `\n> Aliases: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}\n`;
    if(cmd.category) info += `\n> Category: \`${cmd.category[0].toUpperCase() + cmd.category.slice(1)}\`\n`;
    if(cmd.usage) {
        if(Array.isArray(cmd.usage)) {
            info += `\n> Usage: \n${cmd.usage.map(u => `\`${u}\``).join("\n")}\n`
        }else info += `\n> Usage: \`${cmd.usage}\`\n`;
        oneEmbed.setFooter("Usage Syntax: <> = Required  |  [] = Optional");
    }
    if(cmd.description) info += `\n> Description: \`${cmd.description}\``;

    oneEmbed.setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
    oneEmbed.setTimestamp()

    return message.channel.send(oneEmbed.setDescription(info).setTitle(title));
}