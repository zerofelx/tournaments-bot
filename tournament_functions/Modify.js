const fs = require('fs');
const Get = require('./Get');
const { SearchPlayer, SearchTeam } = require('./Search');
const GamesData = require('../data/games.json');

// Agrega puntos a los jugadores para el ranking
async function AddPlayerPoints({Player, Team = 'reclutas libres', Game, Tops = 0, Kills = 0, Points = 0}) {
    Team = Team.toLowerCase()
    let promise = new Promise((resolve, reject) => {
        Get.GetRankingData(Team, Game)
            .then(response => {
                console.log(response)
            })
            .catch(err => reject(err))
    })

    return await promise
}


// Obtiene la lista del índice para actualizar el equipo en concreto sumándole el número de jugadores que se le indique
async function AddPlayersNumbers({TeamName = '', Number = 0}) {
    TeamName = TeamName.toLowerCase()
    let path = './data/teams/index.json';
    let promise = new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if(err) { reject(err) }

            let teams = JSON.parse(data);

            for(t in teams) {
                if(teams[t].Slug == TeamName) {
                    teams[t].Players += Number
                    teams = JSON.stringify(teams)
                    fs.writeFileSync(path, teams)
                }
            }
        })
    })
    return await promise
}

async function AddPlayerToRankTable({TeamName = '', PlayerName = '', Game = 0, Type = 'individual'}) {
    const individual = (Type == 'individual')
    const Participant = individual ? PlayerName : TeamName
    const rankPath = individual ? `./data/teams/${TeamName}/rank.json` : `./data/teams/ranking.json`;
    ParticipantSlug = Participant.toLowerCase()
    Game = GamesData[Game].slug
    
    let promise = new Promise((resolve, reject) => {
        if(individual) {
            SearchPlayer(PlayerName, TeamName)
            .then(() => {
                let rankFile = fs.readFileSync(rankPath);
                rankFile = JSON.parse(rankFile)
    
                let Rank = rankFile[0][Game]
                let Crear = true
    
                if(Rank == undefined) { reject('Este ranking no existe') }
                for(p in Rank) {
                    if(Rank[p].Player.toLowerCase() == ParticipantSlug) {
                        Crear = false
                    }
                }
                if(Crear) {
                    Rank.push({
                        Player: Participant,
                        Kills: 0,
                        Tops: 0,
                        Points: 0
                    })
                    let data = JSON.stringify(rankFile)
                    fs.writeFileSync(rankPath, data)
                    resolve('Jugador agregado')
                } else if(!Crear) {
                    reject('El jugador ya existe en este ranking')
                }
            })
        }
        if(!individual) {
            SearchTeam(TeamName)
            .then(() => {
                let rankFile = fs.readFileSync(rankPath);
                rankFile = JSON.parse(rankFile)
    
                let Rank = ''
                for(r in rankFile) {
                    if(rankFile[r][Game]) {
                        Rank = rankFile[r][Game]
                    }
                }

                let Crear = true
    
                if(Rank == undefined) { reject('El ranking no existe') }
                for(p in Rank) {
                    if(Rank[p].Player.toLowerCase() == ParticipantSlug) {
                        Crear = false
                    }
                }
                if(Crear) {
                    Rank.push({
                        Player: Participant,
                        Kills: 0,
                        Tops: 0,
                        Points: 0
                    })
                    let data = JSON.stringify(rankFile)
                    fs.writeFileSync(rankPath, data)
                    resolve('Equipo agregado')
                } else if(!Crear) {
                    reject('El equipo ya existe en este ranking')
                }
            })
            .catch(err => reject(err))
        }
    })
    return await promise
}

async function AddPlayerPoints({TeamName = 'Reclutas Libres', Type = 'individual', Participant = 'VoidPlayer', Game = 0, Kills = 0, Posicion = 0, Puntos = 0}) {
    const individual = (Type == 'individual');
    let TeamSlug = TeamName.toLowerCase()
    let promise = new Promise((resolve, reject) => {
        Get.GetRankingData({ TeamName: TeamName, Game: Game, Type: Type })
        .then(() => {
            const Points = {
                1:30,   2:22,   3:19,
                4:16,   5:14,   6:12,
                7:10,   8:8,    9:7,
                10:6,   11:5,   12:4,
                13:3,   14:2,   15:1
            }
            let puntuacion = 0;
            if(Points[Posicion] != undefined) {
                puntuacion = Points[Posicion]
            }
            puntuacion += parseInt(Kills) + parseInt(Puntos)

            let filePath = ''
            if(individual) {
                filePath = `./data/teams/${TeamSlug}/rank.json`
            }
            if(!individual) {
                filePath = './data/teams/ranking.json'
            }

            let file = fs.readFileSync(filePath)
            file = JSON.parse(file)
            
            for(r in file) {
                if(file[r][GamesData[Game].slug]) {
                    let edit = file[r][GamesData[Game].slug]
                    for(p in edit) {
                        if(edit[p].Player == Participant) {
                            edit[p].Kills += parseInt(Kills);
                            if(edit[p].Tops == 0) {
                                edit[p].Tops = ''
                                edit[p].Tops += Posicion
                            } else {
                                edit[p].Tops += ", " + Posicion
                            }
                            edit[p].Points += puntuacion

                            file = JSON.stringify(file);
                            fs.writeFileSync(filePath, file)
                            resolve(`Agregado`)
                        }
                    }
                }
            }
        })
        .catch(err => reject(err))
    })
    return await promise
}

module.exports = {
    AddPlayerPoints,
    AddPlayersNumbers,
    AddPlayerToRankTable
}