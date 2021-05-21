const Create = require('./tournament_functions/Create');
const Get = require('./tournament_functions/Get');
const Modify = require('./tournament_functions/Modify');
const Scheme = require('./tournament_functions/Schemes');
const Search = require('./tournament_functions/Search');
const Discord = require('discord.js')


//
//      MENSAJES
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
let PromptColor = 3447003

for(G in GamesFieldsData) {
    GamesFields.push({ name: GamesFieldsData[G].name, value: "El comando para " + GamesFieldsData[G].name + " es #" + GamesFieldsData[G].value})
}

const Mensajes = {
    'Questions' : {
        'GameQuestion': new Discord.MessageEmbed({ title: '¿De cuál juego?', color: PromptColor, fields: GamesFields }),
        'GameAddPlayerQuestion': new Discord.MessageEmbed({ color: PromptColor, fields: { name: 'El jugador ¿De qué equipo es?', value: 'Responde con: #[Nombre del equipo]' } }),
        'PointsType': new Discord.MessageEmbed({ color: PromptColor, fields: { name: "¿Qué deseas agregar a la tabla de puntuaciones?", value: 'a'}})
    },
    'error' : {
        'CreateTeam': new Discord.MessageEmbed({ color: PromptColor, fields: { name: 'El equipo ya existe', value: 'Para ver los equipos que ya existen puedes usar el comando: !Mostrar equipos'}}),
        'RankShowErrMessage': new Discord.MessageEmbed({ color: PromptColor, fields: { name: 'El ranking de este juego aún no ha sido creado', value: 'Si deseas crearlo puedes usar el comando: !Crear ranking [Nombre del equipo]' } }),
        'RankErrMessage': new Discord.MessageEmbed({ color: PromptColor, fields: { name: 'El ranking de este juego ya existe', value: 'Si deseas verlo puedes usar el comando: !Mostrar ranking [Nombre del equipo]' } })
    }
}
//
//      FIN DE MENSAJES
//


//
//      CREAR: 
//
const Crear = {
    Equipo({args, m}) {
        if(args[2] != null) {
            m.channel.send("Verificando el equipo...").then(async () => {
                let spaces = args.length
                spaces = spaces - 1
                let TeamName = Auxiliar['format-teamName']({array: args, oWords: 2})
                
                let team = new Scheme.Team(0, TeamName.toLowerCase(), TeamName)
                Create.CreateTeam(team)
                    .then(() => {
                        m.channel.send(`Equpo '${TeamName}' creado satisfactoriamente`);
                    })
                    .catch((err) => {
                        m.channel.send(Mensajes.error.CreateTeam)
                    })
            })
        }
    },

    Jugador({args, m}) {
        if(args[2] != undefined && args[3] != undefined) {
            let Username = args[2]
    
            let TeamName = Auxiliar['format-teamName']({array: args, oWords: 3})
    
            Create.CreatePlayer(Username, TeamName)
                .then(message => m.channel.send(message))
                .catch(err => m.channel.send(err))
        }
    },

    Ranking({args, m}) {
        if(args[2] != undefined) {
            Auxiliar.question({ question: Mensajes.Questions.GameQuestion, m: m }).then(data => {
                let Game = data[1]
                let TeamName = Auxiliar['format-teamName']({array: args, oWords: 2});
    
                let conf = { game: Game, TeamName: TeamName }
        
                Create.CreateRank(conf)
                    .then(message => m.channel.send("Ranking creado - "+ message))
                    .catch(err => {
                        m.channel.send(Mensajes.error.RankErrMessage)
                        console.log(args)
                    })
            })
        }
    }
}
//
//      FIN DE CREAR
//


//
//      AGREGAR
//
const Agregar = {
    JugadorARankTable({args, m}) {
        let Username = args[3]

        if(Username != undefined) {
            Auxiliar.question({ m: m, question: Mensajes.Questions.GameAddPlayerQuestion})
            .then(data => {
                let TeamName = data;
                TeamName = TeamName.replace('#', '')
                let TeamSlug = TeamName.toLowerCase()

                Search.SearchPlayer(Username, TeamSlug)
                .then(() => {
                    Auxiliar.question({ m: m, question: Mensajes.Questions.GameQuestion})
                    .then(data2 => {
                        let Game = data2[1]

                        Modify.AddPlayerToRankTable({ TeamName: TeamName, PlayerName: Username, Game: Game})
                        .then(() => {
                            m.channel.send(`Jugador ${Username} se agregó al ranking del juego '${GamesData[Game].title}' del team ${TeamName}`)
                        })
                        .catch(err => m.channel.send("Error: " + err))
                    })
                })
                .catch(err => m.channel.send(err))
            })
        }
    },

    Puntuacion() {

    }

}
//
//      FIN DE AGREGAR
//


//
//      MOSTRAR:
//
const Mostrar = {
    Ranking({args, m}) {
        if(args[2] != undefined) {
            Auxiliar.question({ m: m, question: Mensajes.Questions.GameQuestion })
            .then(data => {
                console.log(data)
                let Game = data[1];
                let TeamName = Auxiliar['format-teamName']({array: args, oWords: 2})
                
                console.log(args[2])
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
                    .catch(err => { 
                        console.log("ERROR: ", err)
                        
                        m.channel.send(Mensajes.error.RankShowErrMessage)
                    })
            })
            .catch(err => console.log( err ))
        }
    },
    
    Equipos({m}) {
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
//
//      FIN DE MOSTRAR
//


//
//      FUNCIONES AUXILIARES:
//
const Auxiliar = {
    "format-teamName": FormatTeamName,
    "question": Prompt
}

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
    console.log('Entrando al prompt')
    let promise = new Promise((resolve, reject) => {
        const filter = m => m.content.includes('#')
    
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


module.exports = {
    Crear,
    Agregar,
    Mostrar
}