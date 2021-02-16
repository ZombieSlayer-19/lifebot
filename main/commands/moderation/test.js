module.exports = {
    name: "test",
    aliases: ["--t"],
    category: "moderation",
    run: async(bot,message,args) => {
        message.channel.send("Works");
    }
}