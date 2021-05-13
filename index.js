const Discord = require('discord.js');
const auth = require('./data.json').auth;
const client = new Discord.Client();


client.on('ready', () => {
    console.log("ON");
});

client.on('message', m => {
    if(m.content.substring(0, 1) == '!') {
        let args = m.content.substring(1).split(' ');
        let command = args[0];
        if(command != '') {
            switch (command) {
                case "play": 
                    if(args[1] == 'despacito') {
                        m.channel.send("https://www.youtube.com/watch?v=AjPwUDkndhg");
                    } else {
                        m.channel.send("ª");
                        m.channel.send("... Aún no sé, estoy chikito xd");
                    }
                    break
                default:
                    m.channel.send("ª");
                    m.channel.send("... Aún no sé, estoy chikito xd");
                    break
            }
        }
    }
});


client.login(auth.Token);