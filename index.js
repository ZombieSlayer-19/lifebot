const {config} = require("dotenv");
config({
    path: __dirname + "/.env"
});

const Discord = require("discord.js");
const bot = new Discord.Client();

const fs = require("fs");
const dualox = require("dualox-js");
const mongoose = require("mongoose");

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
const theBot = require("./models/bot.js");

var sessionLife = {
    healthPoints: 0
}

bot.on("message", async(message) => {
    if(message.author.bot) return;

    const guild = message.guild;

    // Database__BOT
    theBot.findOne({
        guildID: guild.id,
        botID: bot.user.id
    }, async (err, Bot) => {
        if(err) console.error(err);

        if(!Bot) {
            const newBot = new theBot({
                _id: mongoose.Types.ObjectId(),
                guildID: guild.id,
                botID: bot.user.id,
                xp: 0,
                level: 1,
                health: 500
            });

            await newBot.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));
        }else {
            var botHealth = Bot.health;

            var pointsPerHUnit = 20;
            var curHPoints = sessionLife.healthPoints;

            addHealth();
            addXp();
            addLevel();

            async function addHealth() {
                if(botHealth == 500) return;

                sessionLife.healthPoints = curHPoints + 1;

                if(sessionLife.healthPoints == pointsPerHUnit) {
                    await theBot.updateOne({
                        health: Bot.health + 1
                    });

                    sessionLife.healthPoints = 0;
                }
            }

            async function addXp() {
                await theBot.updateOne({
                    xp: Bot.xp + dualox.randomNumber(5, 15)
                });
            }

            async function addLevel() {
                var nextLevel = Bot.level * 500;

                if(nextLevel <= Bot.xp) {
                    await theBot.updateOne({
                        level: Bot.level + 1
                    });
                }
            }
        }
    });


    // Database__USER
    User.findOne({
        guildID: guild.id,
        userID: message.author.id
    }, async (err, user) => {
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

            await newUser.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));
        }else {
            // Coins
            var addCoins_chance = dualox.randomNumber(1, 7);

            if(addCoins_chance == 1) {
                var addCoins = dualox.randomNumber(2, 6);
        
                await User.updateOne({
                    coins: user.coins + addCoins
                }).catch(err => console.error(err));
            }

            // Leveling
            var msgXpValue = dualox.randomNumber(5, 15);

            await User.updateOne({
                xp: user.xp + msgXpValue
            }).catch(err => console.error(err));
    
            var curXp = user.xp;
            var curLevel = user.level;
            var curRank = user.rank;
    
            var nextLevel = curLevel * 500;
    
            if(nextLevel <= curXp) {
                await User.updateOne({
                    level: curLevel + 1
                }).catch(err => console.error(err));
    
                curLevel = user.level;
                message.channel.send("You Leveled Up!");
            }
    
            var nextRank = curRank * 10;
    
            if(nextRank <= curLevel) {
                await User.updateOne({
                    rank: curRank + 1
                }).catch(err => console.error(err));
    
                curRank = user.rank;
                message.channel.send("You Ranked Up!");
            }
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