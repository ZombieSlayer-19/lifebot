const {config} = require("dotenv");
config({
    path: __dirname + "/.env"
});

const Discord = require("discord.js");
const bot = new Discord.Client();

const fs = require("fs");
const beautify = require("beautify");
const dualox = require("dualox-js");
const mongoose = require("mongoose");

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
bot.mongoose = require("./utils/mongoose.js");

bot.mongoose.init();

bot.login(process.env.token);

bot.on("ready", async() => {
    console.log("Online..");
});

const User = require("./models/user.js");
const user = require("./models/user.js");

var sessionLife = {
    healthPoints: 0
}

bot.on("message", async(message) => {
    if(message.author.bot) return;

    const guild = message.guild;

    User.findOne({
        guildID: guild.id,
        userID: message.author.id
    }, (err, user) => {
        if(err) console.error(err);

        if(!user) {
            const newUser = new User({
                _id: mongoose.Types.ObjectId(),
                guildID: guild.id,
                userID: message.author.id,
                warnCount: 0,
                kickCount: 0,
                banCount: 0,
                xp: 0,
                level: 1,
                rank: 1,
                coins: 50
            });

            newUser.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));
        }
    });

    // Bot Health //
    const botHealth = botLife["811264208627826759"].health;

    var pointsPerHUnit = 20;
    const curHPoints = sessionLife.healthPoints;

    addHealth();

    function addHealth() {
        if(botHealth == 500) return;

        sessionLife.healthPoints = curHPoints + 1;

        if(sessionLife.healthPoints == pointsPerHUnit) {
            botLife["811264208627826759"].health = botHealth + 1;
            global.Data_save(botLife);
            sessionLife.healthPoints = 0;
        }
    }
    // End Bot Health //

    var addCoins_chance = dualox.randomNumber(1, 10);
    
    if(addCoins_chance == 1) {
        var addCoins = dualox.randomNumber(2, 10);

        User.findOne({
            guildID: guild.id,
            userID: message.author.id
        }, (err, user) => {
            if(err) console.error(err);

            User.updateOne({
                coins: user.coins + addCoins
            })
            .then(result => console.log(result))
            .catch(err => console.error(err));
        });
    }

    var msgXpValue = dualox.randomNumber(5, 15);

    User.findOne({
        guildID: guild.id,
        userID: message.author.id
    }, (err, user) => {
        if(err) console.error(err);

        await User.updateOne({
            userID: message.author.id
        }, {
            $set: {xp: user.xp + msgXpValue}
        });

        var curXp = user.xp;
        var curLevel = user.level;
        var curRank = user.rank;

        var nextLevel = curLevel * 100;

        if(nextLevel <= curXp) {
            User.updateOne({
                userID: message.author.id
            }, {
                $set: {level: curLevel + 1}
            });

            curLevel = user.level;
            message.channel.send("You Leveled Up!");
        }

        var nextRank = curRank * 10;

        if(nextRank <= curLevel) {
            User.updateOne({
                userID: message.author.id
            }, {
                $set: {rank: curRank + 1}
            });

            curRank = user.rank;
            message.channel.send("You Ranked Up!");
        }
    });

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