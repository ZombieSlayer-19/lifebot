const Discord = require("discord.js");
const dualox = require("dualox-js");
const mongoose = require("mongoose");
const Bank = require("../../../models/bank.js");
const User = require("../../../models/user.js");
const Savings = require("../../../models/savingsaccount.js");
const bank = require("../../../models/bank.js");

module.exports = {
    name: "savings",
    aliases: ["savingsaccount", "s"],
    category: "economy",
    usage: ["!savings create <name>", "!savings delete <name>", "!savings rename <name> <new name>", "!savings deposit <name> <amount>", "!savings withdraw <name> <amount>", "!savings balance [name]"],
    description: "Manage your savings accounts",
    run: async(bot,message,args) => {
        var noArgs = new Discord.MessageEmbed()
        .setColor("RED")
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        .setTitle("How To Use The !savings Command")
        .setDescription("Required: <> | Optional: []")
        .addField("Commands", "`!savings create <name> \n!savings rename <account name> <new name> \n!savings delete <name | all> \n!savings deposit <account name> <amount> \n!savings withdraw <account name> <amount> `")
        .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()

        if(!args[0]) return message.channel.send(noArgs);
    
        var args0 = args[0].toLowerCase();

        User.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        }, (err, user) => {
            if(err) console.error(err);

            Bank.findOne({
                userID: message.author.id
            }, (err, account) => {
                if(err) console.error(err);

                Savings.findOne({
                    userID: message.author.id
                }, async(err, saving) => {
                    if(err) console.error(err);

                    if(args0 == "create") {
                        var newPos;
                        if(!saving) newPos = 1;
                        else newPos = account.totalSavings + 1;
                        
                        if(newPos > account.savingsAccounts) return message.channel.send("Your bank does not allow anymore savings accounts..");

                        if(!args[1]) return message.channel.send("Please provide the name of the new savings account..");

                        var newSavingsID = dualox.randomId(16, "ABC123");
                        const newSaving = new Savings({
                            _id: mongoose.Types.ObjectId(),
                            userID: message.author.id,
                            bank: account.bank,
                            savingsID: newSavingsID,
                            name: `${args[1]}`,
                            coins: 0
                        });

                        await newSaving.save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));

                        await account.updateOne({
                            totalSavings: newPos
                        }).catch(err => console.error(err));

                        var newAccount = new Discord.MessageEmbed()
                        .setColor(Discord.EmbedColor)
                        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                        .setTitle("New Savings Account Created!")
                        .addField("Bank:", account.bank)
                        .addField("Name:", args[1])
                        .addField("Account #:", newPos)
                        .addField("Account ID:", "Your account ID has been sent through your dm's")
                        .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()

                        message.channel.send(newAccount);
                    }
                }).catch(err => console.error(err));

                if(args0 == "rename") {
                    if(!args[1]) return message.channel.send("You need to provide the name of the account you want to rename");
                    Savings.findOne({
                        userID: message.author.id,
                        name: args[1]
                    }, async(err, saving) => {
                        if(err) console.error(err);

                        if(!saving) return message.channel.send(`The savings account of \`${args[1]}\` does not exsist...`);
                        if(!args[2]) return message.channel.send("Please provide the new name of the savings account..");

                        await saving.updateOne({
                            name: args[2]
                        }).catch(err => console.error(err));

                        var newName = new Discord.MessageEmbed()
                        .setColor(Discord.EmbedColor)
                        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                        .setTitle("Savings Account Updated!")
                        .addField("Old Name:", saving.name)
                        .addField("New Name:", args[2])
                        .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()

                        message.channel.send(newName);
                    });
                }

                if(args0 == "delete") {
                    Savings.findOne({
                        userID: message.author.id,
                        name: args[1]
                    }, async(err, saving) => {
                        if(err) console.error(err);

                        if(!args[1]) return message.channel.send("Please provide the name of the savings account you want to delete or type \"all\" to delete all savings accounts..");
                        if(!saving && args[1].toLowerCase() != "all") return message.channel.send(`The savings account of \`${args[1]}\` does not exsist...`);

                        var checkEmbed = new Discord.MessageEmbed()
                        .setColor(Discord.EmbedColor)
                        .setTitle(`Are you sure you want to delete \`${args[1]}\``)
                        .setDescription("By accepting this you will delete your savings account and cannot be un done, all the coins in this savings account will be transfered to your bank account..")
                        .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()

                        var msg = await message.channel.send(checkEmbed);

                        msg.react("✅");
                        msg.react("❌");

                        var filter = (user) => user.users.cache.last().id === message.author.id; 

                        var reacted = await msg.awaitReactions(filter, {max: 1, time: 20000})
                        .then(collected => collected.first() && collected.first().emoji.name);

                        if(reacted == "✅") {
                            msg.delete();

                            if(args[1].toLowerCase() == "all") {
                                Savings.find({
                                    userID: message.author.id
                                }, (err, saving) => {
                                    if(err) console.error(err);

                                    saving.forEach(savings => {
                                        account.updateOne({
                                            coins: account.coins + savings.coins
                                        }).catch(err => console.error(err));

                                        savings.delete();
                                    });

                                    
                                    var deleted = new Discord.MessageEmbed()
                                    .setColor(Discord.EmbedColor)
                                    .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                                    .setTitle(`All of your savings accounts have been deleted!`)
                                    .setDescription("All the coins in this savings accounts were transfered to your bank, you can do !bankbal to find out your new balance in your bank account..")
                                    .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                                    .setTimestamp()

                                    message.channel.send(deleted);
                                }).catch(err => console.error(err));
                                return;
                            }

                            await account.updateOne({
                                totalSavings: account.totalSavings - 1,
                                coins: account.coins + saving.coins
                            }).catch(err => console.error(err));

                            saving.deleteOne();

                            var deleted = new Discord.MessageEmbed()
                            .setColor(Discord.EmbedColor)
                            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`Your savings account \`${args[1]}\` has been deleted!`)
                            .setDescription("All the coins in this savings account was transfered to your bank, you can do !bankbal to find out your new balance in your bank account..")
                            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                            .setTimestamp()

                            message.channel.send(deleted);
                        }else if(reacted == "❌") {
                            msg.delete();

                            var canceled = new Discord.MessageEmbed()
                            .setColor(Discord.EmbedColor)
                            .setTitle("Deletion Canceled!")
                            .setDescription("The deletion of your savings account has been abborted, nothing with your account has changed..")
                            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                            .setTimestamp()

                            message.channel.send(canceled);
                        }
                    }).catch(err => console.error(err));
                }

                if(args0 == "deposit") {
                    Savings.findOne({
                        userID: message.author.id,
                        name: args[1]
                    }, async(err, saving) => {
                        if(err) console.error(err);

                        if(!args[1]) return message.channel.send("Please provide the name of the savings account you want to deposit coins to..");
                        if(!saving) return message.channel.send(`The savings account of \`${args[1]}\` does not exsist...`);

                        if(!args[2]) return message.channel.send("Please provide the amount of coins to be deposited..");
                        if(isNaN(args[2])) return message.channel.send(`\`${args[2]}\` is not a number..`);

                        const wallet = bot.emojis.cache.get("816690209272889354");
                        var bankwalEmbed = new Discord.MessageEmbed()
                        .setColor(Discord.EmbedColor)
                        .setTitle("Select Wallet or Bank!")
                        .setDescription(`Select whether you want your coins to be deposited from your wallet or bank account.. Wallet: ${wallet} | Bank: 🏦`)
                        .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()

                        var msg = await message.channel.send(bankwalEmbed);

                        msg.react(wallet);
                        msg.react("🏦");

                        var filter = (user) => user.users.cache.last().id === message.author.id; 

                        var reacted = await msg.awaitReactions(filter, {max: 1, time: 20000})
                        .then(collected => collected.first() && collected.first().emoji.name);

                        if(reacted == wallet.name) {
                            if(args[2] > user.coins) return message.channel.send("You do not have enough coins in your wallet to deposit that much..");
                            msg.delete();

                            var completedEmbed = new Discord.MessageEmbed()
                            .setColor(Discord.EmbedColor)
                            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            .setTitle("Transaction Complete!")
                            .setDescription("The coins have been deposited to your savings account succesfully!")
                            .addField("Coins Deposited From Wallet:", args[2], true)
                            .addField("New Wallet Balance:", user.coins - args[2] * 1, true)
                            .addField("New Savings Account Total:", saving.coins + args[2] * 1)
                            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                            .setTimestamp()

                            user.updateOne({
                                coins: user.coins - args[2] * 1
                            }).catch(err => console.error(err));

                            saving.updateOne({
                                coins: saving.coins + args[2] * 1
                            }).catch(err => console.error(err));

                            message.channel.send(completedEmbed);
                        }
                        if(reacted == "🏦") {
                            if(args[2] > account.coins) return message.channel.send("You do not have enough coins in your bank to deposit that much..");
                            msg.delete();

                            var completedEmbed = new Discord.MessageEmbed()
                            .setColor(Discord.EmbedColor)
                            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            .setTitle("Transaction Complete!")
                            .setDescription("The coins have been deposited to your savings account succesfully!")
                            .addField("Coins Deposited From Bank:", args[2], true)
                            .addField("New Bank Account Balance:", account.coins - args[2] * 1, true)
                            .addField("New Savings Account Total:", saving.coins + args[2] * 1)
                            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                            .setTimestamp()

                            account.updateOne({
                                coins: account.coins - args[2] * 1
                            }).catch(err => console.error(err));

                            saving.updateOne({
                                coins: saving.coins + args[2] * 1
                            }).catch(err => console.error(err));

                            message.channel.send(completedEmbed);
                        }
                    }).catch(err => console.error(err));
                }

                if(args0 == "withdraw") {
                    Savings.findOne({
                        userID: message.author.id,
                        name: args[1]
                    }, async(err, saving) => {
                        if(err) console.error(err);

                        if(!args[1]) return message.channel.send("Please provide the name of the savings account you want to withdraw coins from..");
                        if(!saving) return message.channel.send(`The savings account of \`${args[1]}\` does not exsist...`);

                        if(!args[2]) return message.channel.send("Please provide the amount of coins to be withdrawn..");
                        if(isNaN(args[2])) return message.channel.send(`\`${args[2]}\` is not a number..`);

                        const wallet = bot.emojis.cache.get("816690209272889354");
                        var bankwalEmbed = new Discord.MessageEmbed()
                        .setColor(Discord.EmbedColor)
                        .setTitle("Select Wallet or Bank!")
                        .setDescription(`Select whether you want your coins to be withdrawn to your wallet or bank account.. Wallet: ${wallet} | Bank: 🏦`)
                        .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()

                        var msg = await message.channel.send(bankwalEmbed);

                        msg.react(wallet);
                        msg.react("🏦");

                        var filter = (user) => user.users.cache.last().id === message.author.id; 

                        var reacted = await msg.awaitReactions(filter, {max: 1, time: 20000})
                        .then(collected => collected.first() && collected.first().emoji.name);

                        if(reacted == wallet.name) {
                            if(args[2] > saving.coins) return message.channel.send("You do not have enough coins in your savings account to withdraw that much..");
                            msg.delete();

                            var completedEmbed = new Discord.MessageEmbed()
                            .setColor(Discord.EmbedColor)
                            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            .setTitle("Transaction Complete!")
                            .setDescription("The coins have been withdrawn to your wallet succesfully!")
                            .addField("Coins Withdrawn From Savings Account:", args[2], true)
                            .addField("New Wallet Balance:", user.coins + args[2] * 1, true)
                            .addField("New Savings Account Total:", saving.coins - args[2] * 1)
                            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                            .setTimestamp()

                            user.updateOne({
                                coins: user.coins + args[2] * 1
                            }).catch(err => console.error(err));

                            saving.updateOne({
                                coins: saving.coins - args[2] * 1
                            }).catch(err => console.error(err));

                            message.channel.send(completedEmbed);
                        }
                        if(reacted == "🏦") {
                            if(args[2] > account.coins) return message.channel.send("You do not have enough coins in your savings account to withdraw that much..");
                            msg.delete();

                            var completedEmbed = new Discord.MessageEmbed()
                            .setColor(Discord.EmbedColor)
                            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                            .setTitle("Transaction Complete!")
                            .setDescription("The coins have been withdrawn to your bank account succesfully!")
                            .addField("Coins Withdrawn From Savings Account:", args[2], true)
                            .addField("New Bank Account Balance:", account.coins + args[2] * 1, true)
                            .addField("New Savings Account Total:", saving.coins - args[2] * 1)
                            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                            .setTimestamp()

                            account.updateOne({
                                coins: account.coins + args[2] * 1
                            }).catch(err => console.error(err));

                            saving.updateOne({
                                coins: saving.coins - args[2] * 1
                            }).catch(err => console.error(err));

                            message.channel.send(completedEmbed);
                        }
                    }).catch(err => console.error(err));
                }

                if(args0 == "bal" || args0 == "balance") {
                    Savings.findOne({
                        userID: message.author.id,
                        name: args[1]
                    }, async(err, saving) => {
                        if(err) console.error(err);

                        if(!args[1]) {
                            Savings.find({
                                userID: message.author.id
                            }, (err, saving) => {
                                if(err) console.error(err);

                                if(!saving) return message.channel.send("You do not have any savings accounts..");
                                var allSavings = new Discord.MessageEmbed()
                                .setColor(Discord.EmbedColor)
                                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                                .setTitle("All Savings Accounts Balance")
                                .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()

                                saving.forEach(savings => {
                                    allSavings.addField(`${savings.name} Balance:`, savings.coins)
                                });

                                message.channel.send(allSavings);
                            }).catch(err => console.error(err));
                            return;
                        }
                        if(!saving) return message.channel.send(`The savings account of \`${args[1]}\` does not exsist...`);

                        var balEmbed = new Discord.MessageEmbed()
                        .setColor(Discord.EmbedColor)
                        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                        .setTitle("Savings Account Balance")
                        .addField(`${saving.name} Balance:`, saving.coins)
                        .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()

                        message.channel.send(balEmbed);
                    }).catch(err => console.error(err));
                }
            }).catch(err => console.error(err));
        }).catch(err => console.error(err));
    }
}