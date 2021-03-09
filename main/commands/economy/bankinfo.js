const Discord = require("discord.js");

module.exports = {
    name: "bankinfo",
    aliases: ["bi"],
    category: "economy",
    usage: "!bankinfo [bank name]",
    description: "Sends a list of the banks you can create an account with and their information",
    run: async(bot,message,args) => {
        var bankNames = {
            NWT: "New Wealth Trust",
            AFG: "Azure Financial Group",
            AB: "Aurora Bank",
            EFI: "Emblem Financial Inc.",
            SHI: "Springwell Holdings Inc.",
            OCU: "Oculus Credit Union",
            ECU: "Epitome Credit Union"
        }

        if(args[0]) {
            if(args[0].toLowerCase() == "nwt") {nwt()}
            else if(args[0].toLowerCase() == "afg") {afg()}
            else if(args[0].toLowerCase() == "ab") {ab()}
            else if(args[0].toLowerCase() == "efi") {efi()}
            else if(args[0].toLowerCase() == "shi") {shi()}
            else if(args[0].toLowerCase() == "ocu") {ocu()}
            else if(args[0].toLowerCase() == "ecu") {ecu()}
            else return message.channel.send(`Could not recognize the bank with the acronym of \`${args[0]}\``);


        }else {
            var allBanks = new Discord.MessageEmbed()
            .setColor(Discord.EmbedColor)
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setTitle("Quick info on all banks")
            .addField(`${bankNames.NWT}`, "Indicator: `\"NWT\"`\nMax Coins: 7,500",true)
            .addField(`${bankNames.AFG}`, "Indicator: `\"AFG\"`\nMax Coins: 5,000",true)
            .addField(`${bankNames.AB}`, "Indicator: `\"AB\"`\nMax Coins: 7,000",true)
            .addField(`${bankNames.EFI}`, "Indicator: `\"EFI\"`\nMax Coins: 10,000",true)
            .addField(`${bankNames.SHI}`, "Indicator: `\"SHI\"`\nMax Coins: 10,000",true)
            .addField(`${bankNames.OCU}`, "Indicator: `\"OCU\"`\nMax Coins: 25,000",true)
            .addField(`${bankNames.ECU}`, "Indicator: `\"ECU\"`\nMax Coins: 50,000",true)
            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()

            message.channel.send(allBanks);
        }

        function nwt() {
            var nwtEmbed = new Discord.MessageEmbed()
            .setColor(Discord.EmbedColor)
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setTitle(`Information about "${bankNames.NWT}"`)
            .addField("Safety:", "91%")
            .addField("Allowed Savings Accounts:", "2", true)
            .addField("Max Coins Allowed:", "7,500", true)
            .addField("Ratings:", "3 Stars ⭐⭐⭐")
            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()

            message.channel.send(nwtEmbed);
        }

        function afg() {
            var afgEmbed = new Discord.MessageEmbed()
            .setColor(Discord.EmbedColor)
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setTitle(`Information about "${bankNames.AFG}"`)
            .addField("Safety:", "67%")
            .addField("Allowed Savings Accounts:", "5", true)
            .addField("Max Coins Allowed:", "5,000", true)
            .addField("Ratings:", "3 Stars ⭐⭐⭐")
            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()

            message.channel.send(afgEmbed);
        }
        
        function ab() {
            var abEmbed = new Discord.MessageEmbed()
            .setColor(Discord.EmbedColor)
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setTitle(`Information about "${bankNames.AB}"`)
            .addField("Safety:", "59%")
            .addField("Allowed Savings Accounts:", "10", true)
            .addField("Max Coins Allowed:", "7,000", true)
            .addField("Ratings:", "4 Stars ⭐⭐⭐⭐")
            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()

            message.channel.send(abEmbed);
        }
        
        function efi() {
            var efiEmbed = new Discord.MessageEmbed()
            .setColor(Discord.EmbedColor)
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setTitle(`Information about "${bankNames.EFI}"`)
            .addField("Safety:", "83%")
            .addField("Allowed Savings Accounts:", "10", true)
            .addField("Max Coins Allowed:", "10,000", true)
            .addField("Ratings:", "2 Stars ⭐⭐")
            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()

            message.channel.send(efiEmbed);
        }

        function shi() {
            var shiEmbed = new Discord.MessageEmbed()
            .setColor(Discord.EmbedColor)
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setTitle(`Information about "${bankNames.SHI}"`)
            .addField("Safety:", "72%")
            .addField("Allowed Savings Accounts:", "7", true)
            .addField("Max Coins Allowed:", "10,000", true)
            .addField("Ratings:", "4 Stars ⭐⭐⭐⭐")
            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()

            message.channel.send(shiEmbed);
        }

        function ocu() {
            var ocuEmbed = new Discord.MessageEmbed()
            .setColor(Discord.EmbedColor)
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setTitle(`Information about "${bankNames.OCU}"`)
            .addField("Safety:", "65%")
            .addField("Allowed Savings Accounts:", "15", true)
            .addField("Max Coins Allowed:", "25,000", true)
            .addField("Ratings:", "5 Stars ⭐⭐⭐⭐⭐")
            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()

            message.channel.send(ocuEmbed);
        }

        function ecu() {
            var ecuEmbed = new Discord.MessageEmbed()
            .setColor(Discord.EmbedColor)
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setTitle(`Information about "${bankNames.ECU}"`)
            .addField("Safety:", "71%")
            .addField("Allowed Savings Accounts:", "12", true)
            .addField("Max Coins Allowed:", "50,000", true)
            .addField("Ratings:", "5 Stars ⭐⭐⭐⭐⭐")
            .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()

            message.channel.send(ecuEmbed);
        }
    }
}

