const Discord = require("discord.js");
const mongoose = require("mongoose");
const dualox = require("dualox-js");
const Bank = require("../../../models/bank.js");
const User = require("../../../models/user.js");

module.exports = {
    name: "openbank",
    aliases: ["openaccount", "ob"],
    category: "economy",
    usage: "!openbank",
    description: "Opens a bank account so you can share your coins in between servers the bot is on..",
    run: async(bot,message,args) => {
        User.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        }, (err, user) => {
            if(err) console.error(err);

            Bank.findOne({
                userID: message.author.id
            }, async(err, account) => {
                if(err) console.error(err);

                if(!account) {
                    if(user.coins < 10) return message.channel.send("You require a minimum of 10 coins to create a bank account..");
                    
                    if(!args[0]) return message.channel.send("Please provide the name of the bank you would like to open an account with.. if you do not know what bank to choose, please do !bankinfo for a list of banks and their info");

                    var bankNames = {
                        NWT: "New Wealth Trust",
                        AFG: "Azure Financial Group",
                        AB: "Aurora Bank",
                        EFI: "Emblem Financial Inc.",
                        SHI: "Springwell Holdings Inc.",
                        OCU: "Oculus Credit Union",
                        ECU: "Epitome Credit Union"
                    }

                    var bankChoice;

                    if(args[0].toLowerCase() == "nwt") {
                        bankChoice = bankNames.NWT;
                        var bankSettings = {
                            maxCoins: 7500,
                            savingsAccounts: 2,
                            safety: "91%"
                        }
                    }
                    else if(args[0].toLowerCase() == "afg") {
                        bankChoice = bankNames.AFG;
                        var bankSettings = {
                            maxCoins: 5000,
                            savingsAccounts: 5,
                            safety: "67%"
                        }
                    }
                    else if(args[0].toLowerCase() == "ab") {
                        bankChoice = bankeNames.AB;
                        var bankSettings = {
                            maxCoins: 7000,
                            savingsAccounts: 10,
                            safety: "59%"
                        }
                    }
                    else if(args[0].toLowerCase() == "efi") {
                        bankChoice = bankNames.EFI;
                        var bankSettings = {
                            maxCoins: 10000,
                            savingsAccounts: 10,
                            safety: "83%"
                        }
                    }
                    else if(args[0].toLowerCase() == "shi") {
                        bankChoice = bankNames.SHI;
                        var bankSettings = {
                            maxCoins: 10000,
                            savingsAccounts: 7,
                            safety: "72%"
                        }
                    }
                    else if(args[0].toLowerCase() == "ocu") {
                        bankChoice = bankNames.OCU;
                        var bankSettings = {
                            maxCoins: 25000,
                            savingsAccounts: 15,
                            safety: "65%"
                        }
                    }
                    else if(args[0].toLowerCase() == "ecu") {
                        bankChoice = bankNames.ECU;
                        var bankSettings = {
                            maxCoins: 50000,
                            savingsAccounts: 12,
                            safety: "71%"
                        }
                    }
                    else return message.channel.send(`Could not recognize the bank with the acronym of \`${args[0]}\``);

                    var newAccountID = dualox.randomId("16", "ABC123");

                    const newAccount = new Bank({
                        _id: mongoose.Types.ObjectId(),
                        userID: message.author.id,
                        bank: bankChoice,
                        maxCoins: bankSettings.maxCoins,
                        savingsAccounts: bankSettings.savingsAccounts,
                        totalSavings: 0,
                        safety: bankSettings.safety,
                        accountID: newAccountID,
                        coins: 10
                    });
        
                    await newAccount.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));

                    await user.updateOne({
                        coins: user.coins - 10
                    }).catch(err => console.error(err));

                    var accountEmbed = new Discord.MessageEmbed()
                    .setColor(Discord.EmbedColor)
                    .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                    .setTitle(`Congrats on your new bank account at ${bankChoice}`)
                    .setDescription("Your new bank account will allow you to transfer coins between servers that the bot is on")
                    .addField("Bank Balance:", "10 Coins")
                    .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()

                    message.channel.send(accountEmbed);

                    var accountIDEmbed = new Discord.MessageEmbed()
                    .setColor(Discord.EmbedColor)
                    .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                    .setTitle(`Your ${bankChoice} Account ID`)
                    .setDescription("Keep this id, it may be important to you later on to verify things..")
                    .addField("Account ID:", newAccountID)
                    .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()

                    message.author.send(accountIDEmbed);
                }else return message.channel.send("You already have an account open..");
            }).catch(err => console.error(err));
        }).catch(err => console.error(err));
    }
}