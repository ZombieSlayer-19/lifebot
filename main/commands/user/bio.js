const Discord = require("discord.js");
const User = require("../../../models/user.js");

module.exports = {
    name: "bio",
    aliases: ["mybio", "--ub"],
    category: "user",
    usage: "!bio [new bio]",
    description: "View your current bio or make a new one..",
    run: async(bot,message,args) => {
        User.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        }, async(err, user) => {
            if(err) console.error(err);

            if(!args[0]) {
                var bioEmbed = new Discord.MessageEmbed()
                .setColor(Discord.EmbedColor)
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .setTitle(`${message.author.username}'s Bio!`)
                .addField("My Bio:", user.bio)
                .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()

                message.channel.send(bioEmbed);
            }else {
                var newBio = args.join(" ").split(",");

                await user.updateOne({
                    bio: `${newBio}`
                });

                var bioEmbed = new Discord.MessageEmbed()
                .setColor(Discord.EmbedColor)
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .setTitle(`${message.author.username}'s New Bio!`)
                .addField("My Bio:", newBio)
                .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()

                message.channel.send(bioEmbed);
            }
        })
    }
}