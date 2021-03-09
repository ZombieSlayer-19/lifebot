// const Discord = require("discord.js");
// const Audit = require("../../../models/audit.js");

// Working Progress...

/*
module.exports = {
    name: "audit",
    aliases: ["findaudit", "fa"],
    category: "moderation",
    usage: "!audit <user id> [command_name]",
    description: "Finds the audit log(s) that match the search quary",
    run: async(bot,message,args) => {
        if(!message.member.hasPermission("VIEW_AUDIT_LOG")) return message.channel.send("You do not have permission!");

        if(!args[0]) return message.channel.send("Please provide the users id to search the audit logs..");

        if(!args[1]) {
            Audit.find({
                userID: args[0]
            }, async(err, audit) => {
                if(err) console.error(err);

                if(!audit) return message.channel.send("There is no audit log associated with that user...");

                var members = await bot.users.fetch(`${args[0]}`, { cache: true });
                var auditLog = new Discord.MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(members.displayAvatarURL({dynamic: true}))
                .setTitle(`${members.username}'s Audit Logs`)
                
                audit.forEach(audits => {
                   auditLog.addField("Audit:", `userID: ${audits.userID}\nusername: ${audits.username}\ncommand_ran: \`${audits.full_command}\`\ndate_time(EST): ${audits.date_time}`)
                })

                message.channel.send(auditLog);
            }).catch(err => console.error(err));
        }else {
            var members = await bot.users.fetch(`${args[0]}`, { cache: true });

            Audit.find({
                userID: args[0],
                command_name: args[1]
            }, (err, audit) => {
                if(err) console.error(err);

                var auditLog = new Discord.MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(members.displayAvatarURL({dynamic: true}))
                .setTitle(`${members.username}'s Audit Logs Containing: \`${args[1]}\``)

                audit.forEach(audits => {
                    if(!audit) {
                        auditLog.setDescription(`There were no audits found that matched your quary for the user id of \`${args[0]}\` and the command name of \`${args[1]}\``)
                        auditLog.setColor("RED")
                    }else
                    auditLog.addField("Audit:", `userID: ${audits.userID}\nusername: ${audits.username}\ncommand_ran: \`${audits.full_command}\`\ndate_time(EST): ${audits.date_time}`)
                });

                message.channel.send(auditLog);
            }).catch(err => console.error(err));
        }
    }
}
*/