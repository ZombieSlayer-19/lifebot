const {config} = require("dotenv");
config({
    path: __dirname + "/.env"
});

const Discord = require("discord.js");
const bot = new Discord.Client();

const fs = require("fs");

const botLife = require("./main/bot_config/information.json");
const botLife_path = "./main/bot_config/life.json";

const global = {
    Data_save: fs.writeFile(botLife_path, beautify(JSON.stringify(botLife), {format: "json"}), (err) => {
        if(err) console.log(err);
    })
}

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.categories = fs.readdirSync("./main/commands");
["command"].forEach((handler) => {
    require(`./main/handler/${handler}`)(bot)
});

bot.login(process.env.token);

bot.on("ready", async() => {
    console.log("Online..");
    console.log(process.env.bot_health);
});

var sessionLife = {
    healthPoints: 0
}

bot.on("message", async(message) => {
    if(message.author.bot) return;

    var botHealth = botLife[bot.user.id].health;

    var pointsPerHUnit = 50;
    var HUnit = 1;

    var prefix = process.env.prefix;

    if(!message.content.startsWith(prefix)) return;

    var args = message.content.slice(prefix.length).trim().split(/ +/g);
    var cmd = args.shift().toLowerCase();

    if(cmd === 0) return;

    var command = bot.commands.get(cmd);
    if(!command) command = bot.commands.get(bot.aliases.get(cmd));
    if(command) command.run(bot,message,args);
    else message.channel.send(`\`${message.content}\` is not a valid command!`);
});