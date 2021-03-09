const Discord = require("discord.js");
const math = require("mathjs");

module.exports = {
    name: "calculator",
    aliases: ["calc"],
    category: "info",
    usage: "!calculator <equation>",
    description: "Calculates your equation",
    run: async(bot,message,args) => {
        if(!args[0]) return message.channel.send("Please provide an **equation**");
        var resp;

        try {
            resp = math.evaluate(args.join(" "));
        }catch (e) {
            return message.channel.send("Please provide a **valid equation**");
        }

        var solved = new Discord.MessageEmbed()
        .setColor(Discord.EmbedColor)
        .setTitle("Calculator")
        .addField("Equation:", `\`\`\`css\n${args.join(" ")}\`\`\``)
        .addField("Answer:", `\`\`\`css\n${resp}\`\`\``)
        .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()

        message.delete();
        message.channel.send(solved);
    }
}