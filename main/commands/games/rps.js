const Discord = require("discord.js");
const mongoose = require("mongoose");
const dualox = require("dualox-js");
const User = require("../../../models/user");

module.exports = {
    name: "rockpaperscissors",
    aliases: ["rps"],
    category: "games",
    usage: "!rps <rock (r) | paper (p) | scissors (s)>\n!rps (no args results in random choice)",
    description: "Play Rock Paper Scissors with the life bot :)",
    run: async(bot,message,args) => {
        User.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        }, (err, user) => {
            if(err) console.error(err);

            if(user.coins < 10) return message.channel.send("You do not have enough coins to play rock paper scissors..");

            var rock = 1;
            var paper = 2;
            var scissors = 3;

            var userChoice, botChoice;
            var cEmoji, cString, bEmoji, bString;

            var botChoice_choose = dualox.randomNumber(1,3);
            if(botChoice_choose == 1) botChoice = rock;
            if(botChoice_choose == 2) botChoice = paper;
            if(botChoice_choose == 3) botChoice = scissors;

            if(args[0]) {
                if(args[0].toLowerCase() == "rock" || args[0].toLowerCase() == "r") userChoice = rock;
                if(args[0].toLowerCase() == "paper" || args[0].toLowerCase() == "p") userChoice = paper;
                if(args[0].toLowerCase() == "scissors" || args[0].toLowerCase() == "s") userChoice = scissors;
            }else {
                var userChoice_choose = dualox.randomNumber(1,3);
                if(userChoice_choose == 1) userChoice = rock;
                if(userChoice_choose == 2) userChoice = paper;
                if(userChoice_choose == 3) userChoice = scissors;
            }

            if(userChoice == rock) {
                cEmoji = ":rock:";
                cString = "Rock";
            }
            if(botChoice == rock) {
                bEmoji = ":rock:";
                bString = "Rock";
            }

            if(userChoice == scissors) {
                cEmoji = ":scissors:";
                cString = "Scissors";
            }
            if(botChoice == scissors) {
                bEmoji = ":scissors:";
                bString = "Scissors";
            }

            if(userChoice == paper) {
                cEmoji = ":newspaper:";
                cString = "Paper";
            }
            if(botChoice == paper) {
                bEmoji = ":newspaper:";
                bString = "Paper";
            }

            async function win() {
                await User.updateOne({
                    coins: user.coins + 10
                });

                var wonEmbed = new Discord.MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .setTitle("Rock, Paper, Scissors!")
                .addField("You Won! :open_mouth:", "10 Coins were added to your account!")
                .addField("You Rolled", `${cString} | ${cEmoji}`)
                .addField("I Rolled", `${bString} | ${bEmoji}`)

                message.channel.send(wonEmbed);
            }

            async function lose() {
                await User.updateOne({
                    coins: user.coins - 10
                });

                var lostEmbed = new Discord.MessageEmbed()
                .setColor("RED")
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .setTitle("Rock, Paper, Scissors!")
                .addField("You Lost :frowning:", "10 Coins were removed from your account..")
                .addField("You Rolled", `${cString} | ${cEmoji}`)
                .addField("I Rolled", `${bString} | ${bEmoji}`)

                message.channel.send(lostEmbed);
            }

            async function draw() {
                var drawEmbed = new Discord.MessageEmbed()
                .setColor("BLUE")
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .setTitle("Rock, Paper, Scissors!")
                .addField("It Was A Draw :neutral_face:", "No coins were added or removed from your account..")
                .addField("You Rolled", `${cString} | ${cEmoji}`)
                .addField("I Rolled", `${bString} | ${bEmoji}`)

                message.channel.send(drawEmbed);
            }

            if(userChoice == botChoice) draw();

            // Wins
            if(userChoice == rock && botChoice == scissors) win();
            if(userChoice == paper && botChoice == rock) win();
            if(userChoice == scissors && botChoice == paper) win();

            // Loses
            if(userChoice == rock && botChoice == paper) lose();
            if(userChoice == paper && botChoice == scissors) lose();
            if(userChoice == scissors && botChoice == rock) lose();
            });
    }
}