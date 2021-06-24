const fs = require('fs')
const Create = require('./tournament_functions/Create');
const Get = require('./tournament_functions/Get');
const Modify = require('./tournament_functions/Modify');
const Scheme = require('./tournament_functions/Schemes');
const Search = require('./tournament_functions/Search');
const CreateBracket = require('./bracket_functions/Create.js')
const GetBracket = require('./bracket_functions/Get.js')
const ModifyBracket = require('./bracket_functions/Modify.js')
const SearchBracket = require('./bracket_functions/Search.js')
const GamesData = require('./data/games.json');
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
let successColor = "#008f39"
let ErrorColor = "#ff3333"

for(G in GamesFieldsData) {
    GamesFields.push({ name: GamesFieldsData[G].name, value: "El comando para " + GamesFieldsData[G].name + " es #" + GamesFieldsData[G].value})
}

const Mensajes = {
    'Questions' : {
        'bracket': (fase, mensaje) => {return new Discord.MessageEmbed({color: PromptColor, fields: { name: fase, value: mensaje }})},
        'custom' : (message) => {return new Discord.MessageEmbed({color: PromptColor, fields: { name: 'Información:', value: message }})},
        'AddPoints': {
            'Points': new Discord.MessageEmbed({ color: PromptColor, fields: { name: 'Dime las puntuaciones', value: '#[Cantidad de Kills] [El número del top]'} }),
            'BracketPoints': new Discord.MessageEmbed({ color: PromptColor, fields: { name: '¿Cuántos puntos deseas agregar?', value: 'Responde con #[Puntos]' }}),
        },
        'General': {
            'sure': new Discord.MessageEmbed({ color: PromptColor, fields: { name: '¿Estás seguro de esta acción? ¡No se puede deshacer!', value: 'Responde con #[si] para continuar, en caso contrario no respondas nada.' }}),
            'ID': new Discord.MessageEmbed({ color: PromptColor, fields: { name: 'Dime el ID', value: 'Responde con #[ID]' }}),
            'Rtitle': new Discord.MessageEmbed({ color: PromptColor, fields: { name: 'Dime el título', value: 'Responde con #[Nombre del Ranking]' }}),
            'Ttitle': new Discord.MessageEmbed({ color: PromptColor, fields: { name: 'Dime el título', value: 'Responde con #[Nombre del torneo]' }}),
            'Participants': new Discord.MessageEmbed({ color: PromptColor, fields: { name: 'Dime el nombre de los participantes', value: 'Responde con #[Nombres de los participantes separados por comas]' }}),
            'Player': new Discord.MessageEmbed({ color: PromptColor, fields: { name: 'Dime el nombre del jugador', value: 'Responde con #[Nombre del jugador] por favor.'} }),
            'Team': new Discord.MessageEmbed({ color: PromptColor, fields: { name: 'Dime el equipo', value: 'Responde con #[Nombre del equipo] por favor.'} }),
            'GameQuestion': new Discord.MessageEmbed({ title: '¿De cuál juego?', color: PromptColor, fields: GamesFields }),
            'type': new Discord.MessageEmbed({color: PromptColor, fields: { name: '¿Individual o en equipos?', value: 'Responde con #1 para individual y #2 para equipos.' }}),
            'GameAddPlayerQuestion': new Discord.MessageEmbed({ color: PromptColor, fields: { name: 'El jugador ¿De qué equipo es?', value: 'Responde con: #[Nombre del equipo] por favor.' } }),
        }
    },
    'success': (message) => {return new Discord.MessageEmbed({ color: successColor, fields: { name: 'Hecho', value: message }})},
    'error' : {
        'GeneralError': (message) => {return new Discord.MessageEmbed({color: ErrorColor, fields: { name: 'Error:', value: message }})},
        'CreateTeam': new Discord.MessageEmbed({ color: ErrorColor, fields: { name: 'El equipo ya existe', value: 'Para ver los equipos que ya existen puedes usar el comando: !Mostrar equipos'}}),
        'SearchingTeam': new Discord.MessageEmbed({ color: ErrorColor, fields: { name: 'Este equipo no existe', value: 'Si deseas crearlo puedes usar el comando: !Crear equipo [Nombre del equipo]' } }),
        'SearchingPlayer': new Discord.MessageEmbed({ color: ErrorColor, fields: { name: 'Este jugador no existe en este equipo', value: 'Si deseas crearlo puedes usar el comando: !Crear jugador [Nombre del jugador]' } }),
        'RankShowErrMessage': new Discord.MessageEmbed({ color: ErrorColor, fields: { name: 'El ranking de este juego aún no ha sido creado', value: 'Si deseas crearlo puedes usar el comando: !Crear ranking' } }),
        'RankErrMessage': new Discord.MessageEmbed({ color: ErrorColor, fields: { name: 'El ranking de este juego ya existe', value: 'Si deseas verlo puedes usar el comando: !Mostrar ranking' } })
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
        if(args[2] != undefined) {
            let Username = args[2]
            Auxiliar.question({question: Mensajes.Questions.General.Team, m:m})
            .then(TeamName => {
                Create.CreatePlayer(Username, TeamName)
                .then(message => m.channel.send(message))
                .catch(err => {
                    message = Mensajes.error.GeneralError(err)
                    m.channel.send(message)
                })
            })
        }
    },

    Ranking({m}) {
        Auxiliar.question({ question: Mensajes.Questions.General.type, m: m})
        .then(t => {
            Auxiliar.question({ question: Mensajes.Questions.General.GameQuestion, m: m })
            .then(async data => {
                const Type = (t == 1) ? 'individual' : 'teams';
                
                let Team = '';
                let title = '';
                
                let Game = data
                
                if(Type == 'individual') {
                    Team = await Auxiliar.question({ question: Mensajes.Questions.General.Team, m: m})
                    .then(data2 => {
                        let team = data2;
                        return team
                    })
                } else {
                    title = await Auxiliar.question({ question: Mensajes.Questions.General.Rtitle, m:m })
                    .then(title => { return title })

                }
                
                    let conf = { game: Game, TeamName: Team, Type: Type, Title: title}

                    Create.CreateRank(conf)
                    .then(message => m.channel.send(Mensajes.success(message)))
                    .catch(err => {
                        message = Mensajes.error.GeneralError(err)
                        m.channel.send(message)
                    })
            })
        })
    },

    Bracket({m}) {
        Auxiliar.question({m:m, question: Mensajes.Questions.General.type})
        .then(t => {
            Auxiliar.question({m:m, question: Mensajes.Questions.General.GameQuestion})
            .then(Game => {
                Auxiliar.question({m:m, question: Mensajes.Questions.General.Participants})
                .then(Participants => {
                    const Type = (t == 1) ? 'individual' : 'teams';
                    CreateBracket.NewBracket({Game: Game, Participants: Participants.split(', '), type: Type})
                    .then(ID => {
                        m.channel.send('ID: ' + ID)
                    })
                    .catch(err => m.channel.send(Mensajes.error.GeneralError(err)))
                })
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
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
        console.log(Username)
        if(Username != undefined) {
            Auxiliar.question({ m: m, question: Mensajes.Questions.General.GameAddPlayerQuestion})
            .then(data => {
                let TeamName = data;
                let TeamSlug = TeamName.toLowerCase()

                Search.SearchPlayer(Username, TeamSlug)
                .then(() => {
                    Auxiliar.question({ m: m, question: Mensajes.Questions.General.GameQuestion})
                    .then(data2 => {
                        let Game = data2

                        Modify.AddPlayerToRankTable({ TeamName: TeamName, PlayerName: Username, Game: Game})
                        .then(() => {
                            m.channel.send(`Jugador ${Username} se agregó al ranking del juego '${GamesData[Game].title}' del team ${TeamName}`)
                        })
                        .catch(err => m.channel.send(Mensajes.error.GeneralError(err)))
                    })
                })
                .catch(err => m.channel.send(err))
            })
        }
    },

    EquipoARankTable({m:m}) {
        Auxiliar.question({ question: Mensajes.Questions.General.Team, m: m})
        .then(Team => {
            Auxiliar.question({ question: Mensajes.Questions.General.GameQuestion, m: m })
            .then(Game => {
                Auxiliar.question({question: Mensajes.Questions.General.Rtitle, m: m })
                .then(title => {
                    let TeamName = Auxiliar.fixTeamName({TeamName: Team})
                    Modify.AddPlayerToRankTable({ TeamName: TeamName, Game: Game, Type : 'teams' , Title: title})
                    .then((message) => { m.channel.send(Mensajes.success(message)) })
                    .catch(err => m.channel.send(Mensajes.error.GeneralError(err)))
                })
            })
        })
    },

    Puntuacion({m}) {
        Auxiliar.question({m:m, question: Mensajes.Questions.General.type})
        .then(t => {
            Auxiliar.question({m:m, question: Mensajes.Questions.General.Team})
            .then(team => {
                Auxiliar.question({m:m, question: Mensajes.Questions.General.GameQuestion})
                .then(Game => {
                    const Type = (t == 1) ? 'individual' : 'teams';
                    let TeamName = Auxiliar.fixTeamName({ 'TeamName': team });
                    if(TeamName == false) {
                        Auxiliar.question({m:m, question: Mensajes.error.GeneralError('No existe este equipo')})
                        return
                    }
                    Search.SearchTeam(TeamName)
                    .then(async () => {
                        let participant = ''
    
                        if(Type == 'individual') {
                            await Auxiliar.question({m:m, question: Mensajes.Questions.General.Player})
                            .then(Username => {
                                Search.SearchPlayer(Username, TeamName)
                                .then(() => {participant = Username})
                                .catch(err => m.channel.send(Mensajes.error.GeneralError(err)))
                            })
                        }

                        let title = ''
                        if(Type == 'teams') {
                            await Auxiliar.question({m:m, question: Mensajes.Questions.General.Rtitle})
                            .then(Title => {
                                title = Title
                            })
                            await Search.SearchTeam(team)
                            .then(() => { participant = team })
                            .catch(err => console.log(err))
                        }

                        Auxiliar.question({m:m, question: Mensajes.Questions.AddPoints.Points})
                        .then(datos => {
                            let puntos = datos.split(' ');
                            const kills = puntos[0]
                            const top = puntos[1]

                            console.log('Agregando puntos...')

                            Modify.AddPlayerPoints({
                                'Game': Game,
                                'Participant': participant,
                                'Type': Type,
                                'TeamName': TeamName,
                                'Kills': kills,
                                'Posicion': top,
                                'Title': title
                            }).then(msg => m.channel.send(Mensajes.success(msg)))
                        }) .catch(err => m.channel.send(Mensajes.error.GeneralError(err)))
                    })
                    .catch(err => m.channel.send(Mensajes.error.GeneralError(err))) 
                })
            })
        })
    },

    BracketPuntuacion({m}) {
        Auxiliar.question({m:m, question: Mensajes.Questions.General.type})
        .then(t => {
            Auxiliar.question({m:m, question: Mensajes.Questions.General.ID})
            .then(async ID => {
                const Type = (t == 1) ? 'individual' : 'teams';
                let participant = ''
                
                if(Type == 'individual') {
                    await Auxiliar.question({m:m, question: Mensajes.Questions.General.Player})
                    .then(player => participant = player)
                }
                if(Type == 'teams') {
                    await Auxiliar.question({m:m, question: Mensajes.Questions.General.Team})
                    .then(Team => {
                        Search.SearchTeam(Team)
                        .then(participant = Team)
                    })
                }

                Auxiliar.question({m:m, question: Mensajes.Questions.AddPoints.BracketPoints})
                .then(points => {
                    ModifyBracket.AddPoints({ID: ID, TeamName: participant, type: Type, Points: points})
                    .then(msg => m.channel.send(Mensajes.success(msg)))
                    .catch(err => m.channel.send(Mensajes.error.GeneralError(err)))
                })
            })
        })
    },

    NetxStage({m}) {
        Auxiliar.question({m:m, question: Mensajes.Questions.General.type})
        .then(t => {
            Auxiliar.question({m:m, question: Mensajes.Questions.General.ID})
            .then(ID => {
                Auxiliar.question({m:m, question: Mensajes.Questions.General.sure})
                .then(sure => {
                    const Type = (t == 1) ? 'individual' : 'teams';
                    if(sure.toLowerCase() == 'si') {
                        ModifyBracket.NextStage({ID: ID, type: Type})
                        .then(Msg => {
                            m.channel.send(Mensajes.Questions.bracket(Msg.Stage, Msg.Message))
                        })
                        .catch(err => m.channel.send(Mensajes.error.GeneralError(err)))
                    }
                })
            })
        })
    }

}
//
//      FIN DE AGREGAR
//


//
//      MOSTRAR:
//
const Mostrar = {
    Ranking({m}) {
        Auxiliar.question({m: m, question: Mensajes.Questions.General.type})
        .then(t => {
            Auxiliar.question({ m: m, question: Mensajes.Questions.General.GameQuestion })
            .then(async data => {
                let TeamSlug = ''
                let TeamName = ''
                const Type = (t == 1) ? 'individual' : 'teams';
    
                if(Type == 'individual') {
                    TeamSlug = await Auxiliar.question({ m:m, question: Mensajes.Questions.General.Team }).then(data2 => {return data2});
                    TeamName = Auxiliar.fixTeamName({ TeamName: TeamSlug });
                    type = 'individual'
                }
    
                let Game = data;
                title = ''
                if(Type == 'teams') {
                    await Auxiliar.question({m:m, question: Mensajes.Questions.General.Rtitle}).then(t => {title = t})
                }

                Get.GetRankingData({ TeamName: TeamName, Game: Game, Type: Type, Title: title})
                    .then(async RankTable => {
                        let table = '';
                        if(RankTable.Rank != undefined) {
                            if(Type == 'individual') {

                                for(i in RankTable.Rank) {
                                    table += `#${parseInt(i)+1} ${RankTable.Rank[i].Player}:         Kills: ${RankTable.Rank[i].Kills}    |   Tops: ${RankTable.Rank[i].Tops}    |   ${RankTable.Rank[i].Points} Puntos\n`
                                }
                                if(RankTable.Rank.length != 0) {
                                    await m.channel.send(`${RankTable.TeamName} - ${RankTable.Game} Ranking: `)
                                    await m.channel.send(table)
                                } else {
                                    await m.channel.send(Mensajes.error.GeneralError('Aún no hay ningún participante en este ranking'))
                                }
                            }
                            if(Type == 'teams') {
                                
                                for(i = 1; i < RankTable.Rank.length; i++) {
                                    table += `#${parseInt(i)} ${RankTable.Rank[i].Player}:         Kills: ${RankTable.Rank[i].Kills}    |   Tops: ${RankTable.Rank[i].Tops}    |   ${RankTable.Rank[i].Points} Puntos\n`;
                                }
                                if(RankTable.Rank.length != 0) {
                                    await m.channel.send(`${RankTable.Game} - ${RankTable.Rank[0]} Ranking: `)
                                    await m.channel.send(table)
                                } else {
                                    await m.channel.send(Mensajes.error.GeneralError('Aún no hay ningún participante en este ranking'))
                                }
                            }
                        } else {
                            m.channel.send(Mensajes.error.GeneralError('No existe el ranking de ese juego'))
                        }
                    })
                    .catch(err => { 
                        console.log(err)
                        m.channel.send(Mensajes.error.GeneralError('No se encontró el ranking'))
                    })
            })
            .catch(err => m.channel.send( err ))
            })
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
    },

    Bracket({m}) {
        Auxiliar.question({m:m, question: Mensajes.Questions.General.type})
        .then(t => {
            Auxiliar.question({m:m, question: Mensajes.Questions.General.ID})
            .then(ID => {
                const Type = (t == 1) ? 'individual' : 'teams';
                SearchBracket.ActualBracket({type: Type, ID: ID})
                .then(data => {
                    let players = '';
                    let status = 'Estado actual: \n';
                    Game = GamesData[data.Game].title

                    for(p in data.teams) {
                        players += Capitalize(data.teams[p][0]) + ' '
                    }
                    players = players.split(' '); players = 'Participantes ('+ (players.length - 1 )+'):   | ' + players.join(' | ');
                    
                    for(s in data.actualStatus) {
                        let fp = data.actualStatus[s][0];
                        let sp = data.actualStatus[s][1];

                        status += Capitalize(data.teams[fp][0]) + ' ('+ data.teams[fp][1] +') vs ('+ data.teams[sp][1] +') ' + Capitalize(data.teams[sp][0]) + '\n'
                    }

                    let losers = ''
                    for(p in data.losers) {
                        for(s in data.losers[p]) {
                            losers += Capitalize(data.losers[p][s][0]) + ' '
                        }
                    }
                    losers = losers.split(' '); 
                    if((losers.length - 1 ) != 0) {
                        losers = 'Ya perdieron ('+ (losers.length - 1 )+'):   | ' + losers.join(' | ');
                    }

                    m.channel.send(Mensajes.Questions.custom(status))
                    .then(() => {
                        m.channel.send(Mensajes.Questions.custom(losers))
                    })
                })
            })
        })
    }
    
}
//
//      FIN DE MOSTRAR
//


//
//      RESETEAR:
//
const Resetear = {
    Ranking({m}) {
        Auxiliar.question({m:m, question: Mensajes.Questions.General.type})
        .then(t => {
            Auxiliar.question({m:m, question: Mensajes.Questions.General.GameQuestion})
            .then(async Game => {
                const Type = (t == 1) ? 'individual' : 'teams';
                let TeamName = ''
                let title = ''

                if(Type == 'individual') {
                    await Auxiliar.question({m:m, question: Mensajes.Questions.General.Team})
                    .then(team => {TeamName = team})
                }
                if(Type == 'teams') {
                    await Auxiliar.question({m:m, question: Mensajes.Questions.General.Rtitle})
                    .then(tit => {title = tit})
                }

                Modify.ResetRanking({'TeamName': TeamName, 'Game': Game, 'Title': title, 'Type': Type})
                .then(msg => m.channel.send(Mensajes.success(msg)))
                .catch(msg => m.channel.send(Mensajes.error.GeneralError(msg)))
            })
        })
    }
}
//
//      FIN DE RESETEAR
//


//
//      ELIMINAR:
//
const Eliminar = {
    Bracket({m}) {
        Auxiliar.question({m:m, question: Mensajes.Questions.General.type})
        .then(t => {
            Auxiliar.question({m:m, question: Mensajes.Questions.General.ID})
            .then(ID => {
                Auxiliar.question({m:m, question: Mensajes.Questions.General.sure})
                .then(sure => {
                    if(sure == "si") {
                        const Type = (t == 1) ? 'individual' : 'teams';
                        ModifyBracket.DeleteBracket({'ID': ID, 'Type': Type})
                        .then(msg => m.channel.send(Mensajes.success(msg)))
                        .catch(msg => m.channel.send(Mensajes.error.GeneralError(msg)))
                    }
                })
            })
        })
    },
    Ranking({m}) {
        Auxiliar.question({m:m, question: Mensajes.Questions.General.type})
        .then(t => {
            Auxiliar.question({m:m, question: Mensajes.Questions.General.GameQuestion})
            .then(async Game => {
                const Type = (t == 1) ? 'individual' : 'teams';
                let TeamName = ''
                let title = ''

                if(Type == 'individual') {
                    await Auxiliar.question({m:m, question: Mensajes.Questions.General.Team})
                    .then(team => {TeamName = team})
                }
                if(Type == 'teams') {
                    await Auxiliar.question({m:m, question: Mensajes.Questions.General.Rtitle})
                    .then(tit => {title = tit})
                }

                Modify.DeleteRanking({'Type': Type, 'Game': Game, 'Title': title, 'TeamName': TeamName})
                .then(msg => m.channel.send(Mensajes.success(msg)))
                .catch(msg => m.channel.send(Mensajes.error.GeneralError(msg)))
            })
        })
    }
}
//
//      FIN DE ELIMINAR
//


//
//      FUNCIONES AUXILIARES:
//
const Auxiliar = {
    "format-teamName": FormatTeamName,
    "question": Prompt,
    'Capitalize': Capitalize,
    'fixTeamName': fixTeamName
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

function Capitalize(str = '') {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function fixTeamName({TeamName = ''}) {
    TeamName = TeamName.toLowerCase();

    let TeamsData = fs.readFileSync('./data/teams/index.json');
    TeamsData = JSON.parse(TeamsData)

    for(t in TeamsData) {
        if(TeamsData[t].Slug == TeamName) {
            return TeamsData[t].TeamName
        }
    }
    return false
}

async function Prompt({m, question}) {
    let promise = new Promise((resolve, reject) => {
        const filter = m => m.content.includes('#')
    
        m.channel.send(question).then(() => {
            m.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    let content = collected.first().content
                    let response = content.substring(1)
                    resolve(response)
                })
                .catch(collected => {
                    console.log('No se respondió el mensaje')
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
    Mostrar,
    Resetear,
    Eliminar
}