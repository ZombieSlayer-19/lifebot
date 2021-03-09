const Discord = require("discord.js");

module.exports = {
    name: "test",
    aliases: ["--t"],
    category: "moderation",
    run: async(bot,message,args) => {
        var msg = await message.channel.send("Testing Commands...");

        var testEmbed = new Discord.MessageEmbed()
        .setColor(Discord.EmbedColor)
        .setTitle("Commands Tested")
        .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
        .addField("Commands Status", "Working")
        .addField("Bot Ping", `${Math.round(bot.ws.ping)}ms`)
        .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()

        msg.delete();
        message.channel.send(testEmbed);
    }
}