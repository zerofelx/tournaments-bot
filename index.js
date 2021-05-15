const Express = require('express');
const app = Express()

app.get('/', function (req, res) {
    res.send('Hello World')
})
let port = process.env.PORT || 3000;
app.listen(port)

require('dotenv').config()

const Discord = require('discord.js');
const auth = process.env.token;
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
                    }
                    console.log('Pasando por "despacito"')
                    break
                case "atencion":
                    m.channel.send("ATENCIÓN: Gracias por su atención. @everyone")
                    break
                case "calcula":
                    if(args[1] != null && args[3] != null) {
                      m.channel.send("Resultado: " + calcular(parseInt(args[1]), parseInt(args[3]), args[2]))
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


function calcular(a, b, operation) {
    switch (operation) {
        case "-":
            return a - b
        case "+":
            return a + b
        case "raiz":
            return Math.pow(a, 1 / b)
        case "*" :
            return a * b
        case "x" :
            return a * b
    }
}

client.login(auth);