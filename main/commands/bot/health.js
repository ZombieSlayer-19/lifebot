const Discord = require("discord.js");
const {loadImage, createCanvas, registerFont} = require("canvas");
const fs = require("fs");
const beautify = require("beautify");

const botLife = require("../../bot_config/life.json");

registerFont("./main/commands/bot/etc/font.ttf", {family: "cFont"});

module.exports = {
    name: "health",
    aliases: ["bothealth", "bh", "--h"],
    category: "bot",
    usage: "!health",
    description: "Displays the current health of the bot",
    run: async(bot,message,args) => {
        const canvas = createCanvas(1700, 900);
        const ctx = canvas.getContext("2d");

        var botHealth = botLife[bot.user.id].health;

        const background = await loadImage("./main/commands/bot/etc/background.png");

        var botHealth_bar = {width: 1250, height: 84}

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#8a1111";
        ctx.lineWidth = 6
        ctx.strokeRect(botHealth_bar.width / 5 - 4, 4, botHealth_bar.width + 2, botHealth_bar.height + 4)

        ctx.fillStyle = "#de1f1f"
        ctx.fillRect(botHealth_bar.width / 5, 7, (botHealth * 2.5) - 6, botHealth_bar.height)

        ctx.font = '50px "cFont"'
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center"
        ctx.fillText(`Health`, canvas.width / 2 - 110, 66)
        ctx.fillText(`${botHealth}/500`, canvas.width / 2 + 110, 66)

        message.channel.send(new Discord.MessageAttachment(canvas.toBuffer(), "test.png"));
    }
}

