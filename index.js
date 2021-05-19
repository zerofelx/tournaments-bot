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

const Scheme = require('./tournament_functions/Schemes')
const Create = require('./tournament_functions/Create')
const Get = require('./tournament_functions/Get')


client.on('ready', () => {
    console.log("ON");
});

client.on('message', m => {
    if(m.content.substring(0, 1) == '!') {
        let args = m.content.substring(1).split(' ');
        let command = args[0];
        command = command.toLowerCase()
        if(command != '') {
            switch (command) {
                case "calcula":
                    if(args[1] != null && args[3] != null) {
                      m.channel.send("Resultado: " + calcular(parseInt(args[1]), parseInt(args[3]), args[2]))
                    }
                    break
                case 'rank':
                    if(args[1] != undefined && args[2] != undefined) {
                        let team = args[1];
                        let spaces = args.length
                        spaces = spaces - 1
                        let Game = '';
                        for(i = 2; i <= spaces; i++) {
                            Game += args[i]
                            if(i < spaces) {
                                Game += ' '
                            }
                        }
                        Get.GetRankingData(team, Game)
                            .then(RankTable => {
                                if(RankTable.Rank != undefined) {
                                    m.channel.send(`${RankTable.TeamName} - ${RankTable.Game} Ranking: `)
                                    .then(async function () {
                                        let table = ''
                                        for(i in RankTable.Rank) {
                                            table += `#${parseInt(i)+1} ${RankTable.Rank[i].Player}:         ${RankTable.Rank[i].Kills} Kills    |   ${RankTable.Rank[i].Tops} Tops    |   ${RankTable.Rank[i].Points} Puntos\n`
                                        }
                                        await m.channel.send(table)
                                    })
                                } else {
                                    m.channel.send('No existe el ranking de ese juego.')
                                }
                            })
                            .catch(err => console.log(err))
                    }
                    break
                case 'crearequipo':
                    if(args[1] != null) {
                        m.channel.send("Creando equipo...").then(async () => {
                            let spaces = args.length
                            spaces = spaces - 1
                            let Name = '';
                            if(args[2] != undefined) {
                                for(i = 1; i <= spaces; i++) {
                                    Name += args[i]
                                    if(i < spaces) {
                                        Name += ' '
                                    }
                                }
                            } else {
                                Name = args[1]
                            }
                            
                            let team = new Scheme.Team(0, Name.toLowerCase(), Name)
                            Create.CreateTeam(team)
                                .then(() => {
                                    m.channel.send(`Equpo '${Name}' creado satisfactoriamente`);
                                })
                                .catch((err) => {
                                    m.channel.send(err)
                                })
                        })
                    }
                    break
                case 'listarequipos':
                    m.channel.send("Lista de equipos:").then(async () => {
                        Get.GetTeamsData().then(async data => {
                            let message = ''
                            for(i in data) {
                                message += `Equipo: ${data[i].TeamName}  ~  Cantidad de miembros: ${data[i].Players}\n`
                            }
                            await m.channel.send(message)
                        })
                    })
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