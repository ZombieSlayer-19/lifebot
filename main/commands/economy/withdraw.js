const Discord = require("discord.js");
const Bank = require("../../../models/bank.js");
const User = require("../../../models/user.js");

module.exports = {
    name: "withdraw",
    aliases: ["bankwithdraw"],
    category: "economy",
    usage: "!withdraw <amount>",
    description: "Withdraws coins from your bank account and puts it in your wallet on the current server you are on..",
    run: async(bot,message,args) => {
        if(!args[0]) return message.channel.send("Please provide the ammount you would like to withdraw...");
        if(isNaN(args[0])) return message.channel.send(`${args[0]} is not a number..`);

        User.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        }, (err, user) => {
            if(err) console.error(err);

            Bank.findOne({
                userID: message.author.id
            }, async(err, account) => {
                if(err) console.error(err);

                if(!account) return message.channel.send("You do not have a bank account, please create one first by doing the !openbank <bank name> command");

                if(account.coins < args[0]) return message.channel.send("You do not have enough coins to withdraw that much..");
        
                await account.updateOne({
                    coins: account.coins - Math.floor(args[0])
                }).catch(err => console.error(err));

                await user.updateOne({
                    coins: user.coins + Math.floor(args[0])
                }).catch(err => console.error(err));

                var withEmbed = new Discord.MessageEmbed()
                .setColor(Discord.EmbedColor)
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .setTitle(`Withdrawl from your "${account.bank}" account succesful!`)
                .addField("Withdrawn Amount:", args[0])
                .addField("New Account Total:", account.coins - Math.floor(args[0]), true)
                .addField("New Wallet Total:", user.coins + Math.floor(args[0]), true)
                .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()

                message.channel.send(withEmbed);
            }).catch(err => console.error(err));
        }).catch(err => console.error(err));
    }
}