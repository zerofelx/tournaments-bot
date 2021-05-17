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

const RankTable = require('./Tournaments').GuayabitasRank


client.on('ready', () => {
    console.log("ON");
});

client.on('message', m => {
    if(m.content.substring(0, 1) == '!') {
        let args = m.content.substring(1).split(' ');
        let command = args[0];
        if(command != '') {
            switch (command) {
                case "calcula":
                    if(args[1] != null && args[3] != null) {
                      m.channel.send("Resultado: " + calcular(parseInt(args[1]), parseInt(args[3]), args[2]))
                    }
                    break
                case 'rank':
                    m.channel.send(`${RankTable.TableName} Ranking: `).then(async function () {
                        for(i in RankTable.Rank) {
                            let table = `#${parseInt(i)+1} ${RankTable.Rank[i].Player}:         ${RankTable.Rank[i].Kills} Kills    |   ${RankTable.Rank[i].Tops} Tops    |   ${RankTable.Rank[i].Points} Puntos`
                            await m.channel.send(table)
                        }
                    })
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