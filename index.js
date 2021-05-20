//
//      INICIAR SERVIDOR PARA MANTENER EL BOT 24/7
//

const Express = require('express');
const app = Express()

app.get('/', function (req, res) {
    res.send('Hello World')
})
let port = process.env.PORT || 3000;
app.listen(port)

require('dotenv').config()
console.log('Iniciando...')

//
//      FIN DEL SERVIDOR
//

//
//      INICIO DEL BOT
//

const Discord = require('discord.js');
const auth = process.env.token;
const client = new Discord.Client();

const Scheme = require('./tournament_functions/Schemes')
const Create = require('./tournament_functions/Create')
const Get = require('./tournament_functions/Get')


client.on('ready', () => {
    console.log("ON");
});

//
// INFORMACIÓN DE JUEGOS:
//

class GameFieldScheme {
    constructor(name, value) {
        this.name = name,
        this.value = value
    }
}
let GamesFieldsData = {
    'PUBG': new GameFieldScheme('PUBG Mobile', 1),
    'FreeFire': new GameFieldScheme('FreeFire', 2),
    'COD': new GameFieldScheme('Call of Duty: Mobile', 3),
    'Fortnite': new GameFieldScheme('Fortnite', 4)
}
let GamesFields = []

for(G in GamesFieldsData) {
    GamesFields.push({ name: GamesFieldsData[G].name, value: "El comando para " + GamesFieldsData[G].name + " es !" + GamesFieldsData[G].value})
}

const Messages = {
    'GameQuestion': new Discord.MessageEmbed({ title: '¿De cuál juego?', color: 3447003, fields: GamesFields })
}

//
//      FIN DE INFORMACIÓN
//

//
//      COMANDOS:
//

const Auxiliar = {
    "format-teamName": FormatTeamName,
    "question": Prompt
}

const Commands = {
    'calcula': calcular,
    'test': test,
    'crear' : {
        'equipo'    : CrearEquipo,
        'jugador'   : CrearJugador,
        'ranking'      : CrearRanking
    },
    'mostrar': {
        'equipos': MostrarEquipos,
        'ranking': MostrarRanking
    }
}

client.on('message', m => {

    client.login(auth);
    if(m.content.substring(0, 2) == '**') {
        let args = m.content.substring(2).split(' ');

        let command = args[0];
        let subcommand = args[1]
        command = command.toLowerCase()
        subcommand = subcommand.toLowerCase()
        if(command != '') {
            try {
                Commands[command][subcommand]({args: args, m: m})
            } catch {
                console.log("Error?: " + command, subcommand)
            }
        }
    } else if(m.content.substring(0, 1) == '!') {
        let args = m.content.substring(1).split(' ');
        let command = args[0];
        
        command = command.toLowerCase()
        if(command != '') {
            try {
                Commands[command]({args: args, m: m})
            } catch {
                console.log("Error?: " + command)
            }
        }
    }
});
//
//      FIN DE COMANDOS
//

//
//      FUNCIONES:
//

//
//      CREAR: 
//

function CrearEquipo({args, m}) {
    if(args[2] != null) {
        m.channel.send("Creando equipo...").then(async () => {
            let spaces = args.length
            spaces = spaces - 1
            let TeamName = Auxiliar['format-teamName']({array: args, oWords: 2})
            console.log(TeamName)
            
            let team = new Scheme.Team(0, TeamName.toLowerCase(), TeamName)
            Create.CreateTeam(team)
                .then(() => {
                    m.channel.send(`Equpo '${TeamName}' creado satisfactoriamente`);
                })
                .catch((err) => {
                    m.channel.send(err)
                })
        })
    }
}

function CrearJugador({args, m}) {
    if(args[2] != undefined && args[3] != undefined) {
        let Username = args[2]

        let TeamName = Auxiliar['format-teamName']({array: args, oWords: 3})

        Create.CreatePlayer(Username, TeamName)
            .then(message => m.channel.send(message))
            .catch(err => m.channel.send('Error: ' + err))
    }
}

function CrearRanking({args, m}) {
    if(args[2] != undefined) {
        Auxiliar.question({ question: Messages.GameQuestion, m: m }).then(data => {
            let Game = data[1]
            let TeamName = Auxiliar['format-teamName']({array: args, oWords: 2});
            let conf = { game: Game, TeamName: TeamName }
    
            Create.CreateRank(conf)
                .then(message => m.channel.send(message))
                .catch(err => {
                    m.channel.send(err)
                    console.log(args)
                })
        })
    }
}

//
//      FIN DE CREAR
//

//
//      MOSTRAR:
//

function MostrarRanking({args, m}) {
    if(args[2] != undefined) {
        Auxiliar.question({ m: m, question: Messages.GameQuestion }).then(data => {
            let Game = data[1];
            let TeamName = Auxiliar['format-teamName']({array: args, oWords: 2})
    
            Get.GetRankingData({ TeamName: TeamName, Game: Game})
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
        })
    }
}

function MostrarEquipos({m}) {
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

//
//      FIN DE MOSTRAR
//

//
//      FUNCIONES AUXILIARES:
//


function calcular({args, m}) {
    let result = false
    const Operation = {
        "-": (a, b) => { return a - b},
        "+": (a, b) => { return a + b},
        "raiz": (a, b) => { return Math.pow(a, 1 / b) },
        "*": (a, b) => { return a * b},
        "x": (a, b) => { return a * b},
    }

    if(args[1] != null && args[3] != null) {
        let a = args[1];
        let Operator = args[2];
        let b = args[3]

        result = Operation[Operator](a, b)

        m.channel.send("Resultado: " + result)
    }
}

function test({m}) {
    Prompt({ m: m, question: Messages.GameQuestion}).then(d => console.log(d)).catch(err => console.log(err))
}

function FormatTeamName({array, oWords = 2}) {
    let spaces = array.length
    spaces -= 1
    let TeamName = '';
    if(array[oWords] != undefined) {
        for(i = oWords; i <= spaces; i++) {
            TeamName += array[i]
            if(i < spaces) {
                TeamName += ' '
            }
        }
    } else {
        TeamName = array[oWords]
    }
    return TeamName
}

async function Prompt({m, question}) {
    let promise = new Promise((resolve, reject) => {
        const filter = m => m.content.includes('!')
    
        m.channel.send(question).then(() => {
            m.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    resolve(collected.first().content)
                })
                .catch(collected => {
                    reject('Ups')
                })
        })
    })
    return await promise
}

//
//      FIN DE FUNCIONES AUXILIARES
//

client.login(auth);