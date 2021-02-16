const {readdirSync} = require("fs");

module.exports = (bot) => {
    readdirSync("./main/commands/").forEach(dir => {
        const commands = readdirSync(`./main/commands/${dir}`).filter(file => file.endsWith(".js"));

        if(!commands) console.log("No Command Files Found... Error Code: 404");

        for(let file of commands) {
            var pull = require(`../commands/${dir}/${file}`);

            if(pull.name) {
                bot.commands.set(pull.name, pull);

                if(pull.aliases && Array.isArray(pull.aliases)) {
                    pull.aliases.forEach(alias => bot.aliases.set(alias, pull.name));
                }
            }
        }
    });
}