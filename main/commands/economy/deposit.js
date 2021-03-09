const Discord = require("discord.js");
const Bank = require("../../../models/bank.js");
const User = require("../../../models/user.js");

module.exports = {
    name: "deposit",
    aliases: ["bankdeposit"],
    category: "economy",
    usage: "!deposit <amount>",
    description: "Deposits the amount of coins into your bank account to use in other servers..",
    run: async(bot,message,args) => {
        if(!args[0]) return message.channel.send("Please provide the ammount you would like to deposit...");
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

                if(user.coins < args[0]) return message.channel.send("You do not have enough coins to deposit that much..");
                if(account.coins + Math.floor(args[0]) > account.maxCoins) return message.channel.send(`Your bank does not allow you to hold more than ${account.maxCoins} Coins`);

                await user.updateOne({
                    coins: user.coins - Math.floor(args[0])
                }).catch(err => console.error(err));

                await account.updateOne({
                    coins: account.coins + Math.floor(args[0])
                }).catch(err => console.error(err));

                var depoEmbed = new Discord.MessageEmbed()
                .setColor(Discord.EmbedColor)
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .setTitle(`Deposit to your "${account.bank}" account succesful!`)
                .addField("Deposited Amount:", args[0])
                .addField("New Account Total:", account.coins + Math.floor(args[0]))
                .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()

                message.channel.send(depoEmbed);
            }).catch(err => console.error(err));
        }).catch(err => console.error(err));
    }
}