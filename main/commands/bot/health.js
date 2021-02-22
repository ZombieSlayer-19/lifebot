const Discord = require("discord.js");
const {loadImage, createCanvas, registerFont} = require("canvas");
const fs = require("fs");
const beautify = require("beautify");

const theBot = require("../../../models/bot.js");

registerFont("./main/commands/bot/etc/font.ttf", {family: "cFont"});

module.exports = {
    name: "health",
    aliases: ["bothealth", "bh", "--h"],
    category: "bot",
    usage: "!health",
    description: "Displays the current health of the bot",
    run: async(bot,message,args) => {
        const canvas = createCanvas(1700, 700);
        const ctx = canvas.getContext("2d");

        theBot.findOne({
            guildID: message.guild.id,
            botID: bot.user.id
        }, async (err, Bot) => {
            if(err) console.log(err);

            var botHealth = Bot.health;

            const background = await loadImage("./main/commands/bot/etc/background.png");

            var botHealth_bar = {width: 1250, height: 90}

            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#ff0000";
            var grd = ctx.createLinearGradient(botHealth_bar.width / 5, canvas.height / 2 - botHealth_bar.height / 2 + 3, botHealth_bar.width, botHealth_bar.height);
            grd.addColorStop(0.2, "#d91818");
            grd.addColorStop(0.7, "#d8db18");
            grd.addColorStop(1, "#21c24c");

            ctx.fillStyle = grd;
            ctx.fillRect(botHealth_bar.width / 5, canvas.height / 2 - botHealth_bar.height / 2 + 3, botHealth_bar.width, botHealth_bar.height)

            ctx.strokeStyle = "#7a1400";
            ctx.lineWidth = 6
            ctx.borderRadius = 10
            ctx.strokeRect(botHealth_bar.width / 5 - 4, canvas.height / 2 - botHealth_bar.height / 2, botHealth_bar.width + 2, botHealth_bar.height + 4)

            ctx.fillStyle = "#a81c00"
            ctx.fillRect(botHealth_bar.width / 5, canvas.height / 2 - botHealth_bar.height / 2 + 3, (botHealth * 2.5) - 6, botHealth_bar.height)

            ctx.font = '55px "cFont"'
            ctx.fillStyle = "#ffffff"
            ctx.textAlign = "center"
            ctx.fillText(`Health`, canvas.width / 2 - 110, canvas.height / 2 + botHealth_bar.height / 4)
            ctx.fillText(`${botHealth}/500`, canvas.width / 2 + 110, canvas.height / 2 + botHealth_bar.height / 4)

            message.channel.send(new Discord.MessageAttachment(canvas.toBuffer(), "test.png"));
        });
    }
}

