const Discord = require("discord.js");
const User = require("../../../models/user.js");

module.exports = {
    name: "balance",
    aliases: ["bal"],
    category: "economy",
    usage: "!balance [@member]",
    description: "Checks your current coin balance..",
    run: async(bot,message,args) => {
        var member = message.mentions.members.first() || message.member;

        User.findOne({
            guildID: message.guild.id,
            userID: member.user.id
        }, async(err, user) => {
            if(err) console.error(err);

            var coinEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(`${member.user.username} Has \`${user.coins}\` Coins!`)
            .setFooter("Use coins to pay other members or to play games!", member.user.displayAvatarURL({dynamic: true}))

            message.channel.send(coinEmbed);
        }).catch(err => console.error(err));
    }
}