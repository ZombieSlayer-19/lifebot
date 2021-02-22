const Discord = require("discord.js");
const dualox = require("dualox-js");
const Ticket = require("../../../models/ticket.js");

module.exports = {
    name: "claim",
    aliases: ["claimticket", "ticketclaim", "--tc"],
    category: "ticket",
    usage: "!claim <ticket id | @member>",
    description: "Claims a ticket you can help with",
    run: async(bot,message,args) => {
        if(!message.member.hasPermission(["MANAGE_GUILD", "MANAGE_CHANNELS"])) return console.log("Doesnt have role");

        var msg = await message.channel.send("Searching For Ticket...");

        var member = message.mentions.members.first();

        if(!args[0]) return message.channel.send("You need to provide the ticket id or @mention the person the ticket belongs too.");

        if(args[0].includes("<@")){
            var toFindTicket = {
                guildID: message.guild.id,
                userID: member.user.id
            }

            var noneFound = `the user of \`${member.user.username}\``;
        }else {
            var  toFindTicket = {
                guildID: message.guild.id,
                ticketID: args[0]
            }

            var noneFound = `the id of \`${args[0]}\``;
        }

        Ticket.findOne(toFindTicket, async(err, ticket) => {
            if(err) console.error(err);

            if(!ticket) {
                setTimeout(() => {
                    msg.delete();

                    var noTicket = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                    .setTitle("No Ticket Found...")
                    .setDescription(`There was no ticket found for ${noneFound} Please make sure the id or mention is typed in correctly..`)

                    message.channel.send(noTicket);
                }, 1500);
            }else {
                setTimeout(async() => {
                    msg.delete();

                    if(Ticket.findOne({guildID: message.guild.id, claimedID: message.author.id})) return message.channel.send(`You already have a claimed ticket... Please resolve that ticket before claiming another one..`);

                    if(ticket.status.toLowerCase() == "claimed" || ticket.status.toLowerCase() == "closed") {
                        return message.channel.send("This ticket is either claimed or closed, and cannot be claimed again..");
                    }

                    Ticket.updateOne({
                        guildID: message.guild.id,
                        userID: member.user.id
                    }, {
                        $set: {
                            status: "Claimed",
                            claimedUserID: message.author.id,
                            claimedDate: dualox.currentDate()
                        }
                    }).catch(err => console.log(err));

                    var members = await bot.users.fetch(`${ticket.userID}`, { cache: true });

                    var ticketChannel = await message.guild.channels.cache.find(c => c.id == `${ticket.channelID}`);

                    ticketChannel.edit({name: `🟡${members.username}-${ticket.ticketID}`});

                    message.channel.send(`You have succesfully claimed \`${members.username}'s\` ticket! `);

                    var claimedEmbed = new Discord.MessageEmbed()
                    .setColor("YELLOW")
                    .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                    .setTitle(`${message.author.username} Has Claimed Your Ticket!`)
                    .addField("Ticket Author:", members, true)
                    .addField("Ticket ID:", ticket.ticketID, true)
                    .addField("Claimed Info", "===============")
                    .addField("Claimed Username:", message.author.username)
                    .addField("Claimed ID:", message.author.id)

                    ticketChannel.send(claimedEmbed);
                }, 1500);
            }
        });
    }
}