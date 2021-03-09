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

    var activities = [`${bot.guilds.cache.size<2?"1 Server": `${bot.guilds.cache.size} Total Servers`}`, `${bot.commands.size} Total Commands`, `get help, !help`, `Genesis Music`], i = 0;
    var types = ["WATCHING", "PLAYING", "PLAYING", "LISTENING"], x = 0;

    setInterval(() => {
        bot.user.setActivity({type: `${types[x++ % types.length]}`, name: `${activities[i++ % activities.length]}`});
    }, 10000)
});

const User = require("./models/user.js");
const theBot = require("./models/bot.js");
const Audit = require("./models/audit.js");

var sessionLife = {
    healthPoints: 0
}

bot.on("message", async(message) => {
    if(message.author.bot) return;

    const guild = message.guild;

    if(!guild) return message.author.send("This bot only works on servers right now..");

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
                xpForLevelUp: 500,
                level: 1,
                levelForRankUp: 10,
                rank: 1,
                coins: 50,
                bio: "When this user writes their bio, this is where their bio will be :)"
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
            var msgXpValue = dualox.randomNumber(5, 13);

            await User.updateOne({
                guildID: guild.id,
                userID: message.author.id
            }, {
                $set: {xp: user.xp + msgXpValue}
            }).catch(err => console.error(err));

            var curXp = await user.xp;

            if(curXp >= user.xpForLevelUp) {
                await User.updateOne({
                    guildID: guild.id,
                    userID: message.author.id
                }, {
                    $set: {
                        level: user.level + 1,
                        xpForLevelUp: user.xpForLevelUp + 100,
                        xp: 0
                    }
                }).catch(err => console.error(err));
            }

            var curLevel = await user.level;

            if(curLevel >= user.levelForRankUp) {
                await User.updateOne({
                    guildID: guild.id,
                    userID: message.author.id
                }, {
                    $set: {
                        rank: user.rank + 1,
                        levelForRankUp: user.levelForRankUp + 5
                    }
                }).catch(err => console.error(err));
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
    if(command) {
        command.run(bot,message,args);

        const newAudit = new Audit({
            _id: mongoose.Types.ObjectId(),
            userID: message.author.id,
            username: message.author.username,
            command_name: prefix + command.name,
            full_command: message.content,
            date_time: dualox.currentDate()
        });

        await newAudit.save()
        .catch(err => console.error(err));
    }
    else message.channel.send(`\`${message.content}\` is not a valid command!`);
});