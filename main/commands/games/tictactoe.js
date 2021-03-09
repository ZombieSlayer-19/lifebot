const Discord = require("discord.js");
const User = require("../../../models/user.js");

var player1 = {
    id: "n/a",
    piece: "❌"
};
var player2 = {
    id: "n/a",
    piece: "⭕"
};
var pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8, pos9;

module.exports = {
    name: "tictactoe",
    aliases: ["ttt"],
    category: "games",
    usage: ["!tictactoe", "!tictactoe join"],
    description: "Play Tic Tac Toe with your friends..",
    run: async(bot,message,args) => {
        const board = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

        if(!args[0]) {
            if(player1.id == "n/a") player1.id = message.author;
            else return message.channel.send("Someone is already Player 1, please try !ttt join to see if you can be Player 2");

            var newGame = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Tic Tac Toe")
            .setDescription("You have started a game of tic tac toe, please wait for another player to join, this game will end in 1min if no one joins..")
            .addField("How to join this game:", "**!ttt join <bet>**")
            .addField("Player 1:", player1.id.username)
            .addField("Player 2:", "None")

            message.channel.send(newGame);
        }else if(args[0] == "join") {
            if(player2.id !== "n/a") return message.channel.send("Somebody is already Player 2, you cannot join the game at this time...");
            if(player1.id !== "n/a") player2.id = message.author;
            else if(player1.id == "n/a" && player2.id == "n/a") {
                return message.channel.send("No game was started yet...");
            }

            var blankBoard = `${board[0]} | ${board[1]} | ${board[2]}\n---------------\n${board[3]} | ${board[4]} | ${board[5]}\n---------------\n${board[6]} | ${board[7]} | ${board[8]}`;

            var playerTurn = player1;

            var newGB = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle(`${player1.id.username}'s Tic Tac Toe Game`)
            .addField("Player 1:", player1.id.username + " " + player1.piece)
            .addField("Player 2:", player2.id.username + " " + player2.piece)
            .addField("Whos turn is it?:", playerTurn.id.username + " " + playerTurn.piece)
            .addField("Game", blankBoard)

            var msg = await message.channel.send(newGB);

            for (const react of board) await msg.react(react);

            var filter = (user) => user.users.cache.last().id === playerTurn.id.id;

            var reacted = await msg.awaitReactions(filter, {max: 1, time: 20000})
            .then(collected => collected.first() && collected.first().emoji.name);

            var pos1 = board[0],
                pos2 = board[1],
                pos3 = board[2],
                pos4 = board[3],
                pos5 = board[4],
                pos6 = board[5],
                pos7 = board[6],
                pos8 = board[7],
                pos9 = board[8];

            if(reacted == board[0]) pos1 = playerTurn.piece;
            if(reacted == board[1]) pos2 = playerTurn.piece;
            if(reacted == board[2]) pos3 = playerTurn.piece;
            if(reacted == board[3]) pos4 = playerTurn.piece;
            if(reacted == board[4]) pos5 = playerTurn.piece;
            if(reacted == board[5]) pos6 = playerTurn.piece;
            if(reacted == board[6]) pos7 = playerTurn.piece;
            if(reacted == board[7]) pos8 = playerTurn.piece;
            if(reacted == board[8]) pos9 = playerTurn.piece;

            var move1 = `${pos1} | ${pos2} | ${pos3}\n---------------\n${pos4} | ${pos5} | ${pos6}\n---------------\n${pos7} | ${pos8} | ${pos9}`;
        
            playerTurn = player2;

            var moveOne = new Discord.MessageEmbed()
            .setColor(Discord.EmbedColor)
            .setTitle(`${player1.id.username}'s Tic Tac Toe Game`)
            .addField("Player 1:", player1.id.username + " " + player1.piece)
            .addField("Player 2:", player2.id.username + " " + player2.piece)
            .addField("Whos turn is it?:", playerTurn.id.username + " " + playerTurn.piece)
            .addField("Game", move1)

            msg.edit(moveOne);

            var filter = (user) => user.users.cache.last().id === playerTurn.id.id;

            var reacted = await msg.awaitReactions(filter, {max: 1, time: 20000})
            .then(collected => collected.first() && collected.first().emoji.name);

            if(reacted == board[0] && pos1 !== player1.piece) pos1 = playerTurn.piece;
            if(reacted == board[1] && pos2 !== player1.piece) pos2 = playerTurn.piece;
            if(reacted == board[2] && pos3 !== player1.piece) pos3 = playerTurn.piece;
            if(reacted == board[3] && pos4 !== player1.piece) pos4 = playerTurn.piece;
            if(reacted == board[4] && pos5 !== player1.piece) pos5 = playerTurn.piece;
            if(reacted == board[5] && pos6 !== player1.piece) pos6 = playerTurn.piece;
            if(reacted == board[6] && pos7 !== player1.piece) pos7 = playerTurn.piece;
            if(reacted == board[7] && pos8 !== player1.piece) pos8 = playerTurn.piece;
            if(reacted == board[8] && pos9 !== player1.piece) pos9 = playerTurn.piece;

            var move2 = `${pos1} | ${pos2} | ${pos3}\n---------------\n${pos4} | ${pos5} | ${pos6}\n---------------\n${pos7} | ${pos8} | ${pos9}`;
        
            playerTurn = player1;

            var moveTwo = new Discord.MessageEmbed()
            .setColor(Discord.EmbedColor)
            .setTitle(`${player1.id.username}'s Tic Tac Toe Game`)
            .addField("Player 1:", player1.id.username + " " + player1.piece)
            .addField("Player 2:", player2.id.username + " " + player2.piece)
            .addField("Whos turn is it?:", playerTurn.id.username + " " + playerTurn.piece)
            .addField("Game", move2)

            msg.edit(moveTwo);
        }
    }
}