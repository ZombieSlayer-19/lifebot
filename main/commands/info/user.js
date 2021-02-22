const Discord = require("discord.js");
const User = require("../../../models/user.js");

module.exports = {
    name: "user",
    aliases: ["member", "--u"],
    category: "info",
    usage: "!user [@member]",
    description: "Displays information on you or the @member",
    run: async(bot,message,args) => {
        var member = message.mentions.members.first() || message.member;

        User.findOne({
            guildID: message.guild.id,
            userID: member.user.id
        }, async(err, user) => {
            if(err) console.error(err);

            var userEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
            .setTitle(`${member.user.username}'s Information!`)
            .setDescription(`Bio: **${user.bio}**`)
            .addField("Username:", member.user.username, true)
            .addField("Tag:", member.user.tag.split(member.user.username).pop(","), true)
            .addField("ID:", user.userID)
            .addField("Xp:", user.xp, true)
            .addField("Level:", user.level, true)
            .addField("Rank:", user.rank, true)
            .addField("Coin Balance:", user.coins, true)
            .addField("Warns:", user.warnCount, true)
            .addField("Kicks:", user.kickCount, true)
            .addField("Bans:", user.banCount)

            message.channel.send(userEmbed);
        });
    }
}