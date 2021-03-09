const Discord = require("discord.js");
const User = require("../../../models/user.js");

module.exports = {
    name: "pay",
    aliases: ["give"],
    category: "economy",
    usage: "!pay <@member> <amount>",
    description: "Pays the member the amount of coins..",
    run: async(bot,message,args) => {
        var member = message.mentions.members.first();

        if(!args[0]) return message.channel.send("Please provide the user mention that you would like to pay..");
        if(!member) return message.channel.send("Could not find that user in this server..");
        if(!args[1]) return message.channel.send("Please provide an amount of coins you'd like to pay them");
        if(isNaN(args[1])) return message.channel.send(`\`${args[1]}\` Is not a number`);

        User.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        }, async(err, user) => {
            if(err) console.error(err);

            if(user.coins < args[1]) return message.channel.send("You do not have enough coins to pay that much..");

            await User.updateOne({
                coins: user.coins - Math.floor(args[1])
            });

            await User.findOne({
                guildID: message.guild.id,
                userID: member.user.id
            }, async(err, member1) => {
                if(err) console.error(err);

                await member1.updateOne({
                    coins: member1.coins + Math.floor(args[1])
                });
            }).catch(err => console.error(err));

            var paidEmbed = new Discord.MessageEmbed()
            .setColor(Discord.EmbedColor)
            .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
            .setTitle("Coins Transfered!")
            .addField("Sender:", message.author.username, true)
            .addField("Retriever:", member.user.username, true)
            .addField("Sent Amount:", args[1])
            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()

            message.channel.send(paidEmbed);
        }).catch(err => console.error(err));
    }
}