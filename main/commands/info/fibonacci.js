module.exports = {
    name: "fibonacci",
    aliases: ["fib"],
    category: "info",
    usage: "!fibonacci [starting numbers ex.(0 1)] [length]",
    description: "Writes a fibonacci sequence of numbers..",
    run: async(bot,message,args) => {
        var fibonacci = function(result, len) {
            var num1 = result[0],
                num2 = result[1],
                next,
                cnt = 2;
    
            while(cnt < len) {
                next = num1 + num2;
                num1 = num2;
                num2 = next;
                result.push(next);
                cnt++;
            }
    
            return message.channel.send(result);
        }
    
        if(!args[0]) return fibonacci([0, 1], 10) && message.channel.send("Fibonacci :slight_smile:");

        if(args[0]) {
            if(isNaN(args[0])) return message.channel.send("Please use a number..");
            if(isNaN(args[1])) return message.channel.send("Please use a number..");

            if(!args[1]) return message.channel.send("Provide the next starting number");

            if(!args[2]) return fibonacci([args[0]*1, args[1]*1], 10) && message.channel.send("Fibonacci :slight_smile:");

            if(isNaN(args[2])) return message.channel.send("Please use a number..");
            if(args[2] > 50) return message.channel.send("We dont want to spam the channel, please keep it under 50");

            return fibonacci([args[0]*1, args[1]*1], args[2]*1) && message.channel.send("Fibonacci :slight_smile:");
        }
    }
}