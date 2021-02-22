const Discord = require("discord.js");
const User = require("../../../models/user.js");

module.exports = {
    name: "warn",
    aliases: ["--w"],
    category: "moderation",
    usage: "!warn <member> [reason]",
    description: "Warns a member and will add to their warn count on their account..",
    run: async(bot,message,args) => {
        var member = message.mentions.members.first();

        if(!message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"])) return message.channel.send("You do not have the correct permissions for that..");
        if(member.roles.cache.some(role => role.name === "Moderator")) return message.channel.send("This member cannot be warnned except only by the owner..");


        if(args[1]) var reason = args.join(" ").split(args[0]).pop(",");

        User.findOne({
            guildID: message.guild.id,
            userID: member.user.id
        }, async (err, user) => {
            if(err) console.error(err);

            await user.updateOne({
                warnCount: user.warnCount + 1
            });
            
            var warnedEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
            .setTitle(`${member.user.username} Has Been Warned!`)
            .addField("Times Warned:", user.warnCount + 1)
            if(reason) warnedEmbed.addField("Reason for warn:", reason)

            message.channel.send(warnedEmbed);
        });
    }
}