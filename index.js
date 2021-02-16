const {config} = require("dotenv");
config({
    path: _dirname + "/.env"
});

const Discord = require("discord.js");
const bot = new Client();

bot.login(process.env.token);