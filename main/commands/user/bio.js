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
                .setColor("RED")
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .setTitle(`${message.author.username}'s Bio!`)
                .addField("My Bio:", user.bio)

                message.channel.send(bioEmbed);
            }else {
                var newBio = args.join(" ").split(",");

                await user.updateOne({
                    bio: `${newBio}`
                });

                var bioEmbed = new Discord.MessageEmbed()
                .setColor("RED")
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .setTitle(`${message.author.username}'s New Bio!`)
                .addField("My Bio:", newBio)

                message.channel.send(bioEmbed);
            }
        })
    }
}