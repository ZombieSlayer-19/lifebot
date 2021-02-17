const {config} = require("dotenv");
config({
    path: __dirname + "/.env"
});

const Discord = require("discord.js");
const bot = new Discord.Client();

const fs = require("fs");
const beautify = require("beautify");
const dualox = require("dualox-js");

const botLife = require("./main/bot_config/life.json");
const botLife_path = "./main/bot_config/life.json";

const global = {
    Data_save: async function() {
        fs.writeFile(botLife_path, beautify(JSON.stringify(botLife), {format: "json"}), (err) => {
            if(err) console.log(err);
        })
    } 
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
});

var sessionLife = {
    healthPoints: 0
}

bot.on("message", async(message) => {
    if(message.author.bot) return;

    const botHealth = botLife["811264208627826759"].health;

    var pointsPerHUnit = 20;
    const curHPoints = sessionLife.healthPoints;

    sessionLife.healthPoints = curHPoints + 1;

    if(sessionLife.healthPoints == pointsPerHUnit) {
        botLife["811264208627826759"].health = botHealth + 1;
        global.Data_save(botLife);
        sessionLife.healthPoints = 0;
    }

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