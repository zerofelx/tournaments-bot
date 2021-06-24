const fs = require('fs');
const Get = require('./Get');
const { SearchPlayer, SearchTeam } = require('./Search');
const GamesData = require('../data/games.json');

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

async function AddPlayerToRankTable({TeamName = '', PlayerName = '', Game = 0, Type = 'individual', Title = ''}) {
    const individual = (Type == 'individual')
    let  Participant = '';
    if(individual) { Participant = PlayerName }
    if(!individual) { Participant = TeamName }
    const rankPath = individual ? `./data/teams/${TeamName.toLowerCase()}/rank.json` : `./data/teams/ranking.json`;
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
                TitleSlug = Title.toLowerCase()
                rankFile = JSON.parse(rankFile)
    
                let Rank = ''
                for(r in rankFile) {
                    for(i in rankFile[r][Game]) {
                        if(rankFile[r][Game][i][TitleSlug]) {
                            Rank = rankFile[r][Game][i][TitleSlug]
                            for(p = 1; p < Rank.length; p++) {
                                if(Rank[p].Player.toLowerCase() == Participant.toLowerCase()) {
                                    reject('El jugador ya existe en el ranking')
                                    return
                                }
                            }
                        }
                    }
                }

                let Crear = true
    
                if(Rank == undefined) { reject('El ranking no existe') }
                try {
                    for(p in Rank) {
                        if(Rank[p].Player.toLowerCase() == ParticipantSlug) {
                            Crear = false
                        }
                    }
                }
                catch {
                    Crear = true
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

async function AddPlayerPoints({
    TeamName = 'Reclutas Libres', 
    Type = 'individual', 
    Participant = 'VoidPlayer', 
    Game = 0, Kills = 0, Posicion = 0, Puntos = 0,
    Title = ''}) 
    {
    const individual = (Type == 'individual');
    let TeamSlug = TeamName.toLowerCase()
    let promise = new Promise((resolve, reject) => {
        Get.GetRankingData({ TeamName: TeamName, Game: Game, Type: Type, Title: Title })
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
                Title = Title.toLowerCase();
                filePath = './data/teams/ranking.json'
            }

            let file = fs.readFileSync(filePath)
            file = JSON.parse(file)
            
            for(r in file) {
                if(file[r][GamesData[Game].slug]) {
                    let edit = []

                    if(individual) {
                        edit = file[r][GamesData[Game].slug]
                    }
                    if(!individual) {
                        let rankings = file[r][GamesData[Game].slug]
                        for(i in rankings) {
                            if(rankings[i][Title]) {
                                edit = file[r][GamesData[Game].slug][i][Title]
                            }
                        }
                    }

                    let MakeChange = false
                    let index = 0

                    if(individual) {
                        for(p in edit) {
                            if(edit[p].Player == Participant) {
                                MakeChange = true
                                index = p
                            }
                        }
                    }
                    if(!individual) {
                        for(p = 1; p < edit.length; p++) {
                            if(edit[p].Player.toLowerCase() == Participant.toLowerCase()) {
                                MakeChange = true
                                index = p
                            }
                        }
                    }
                    if(!MakeChange) {
                        reject('No se encontró este participante')
                    }

                    if(edit[index].Kills == 0) {
                        edit[index].Kills = '',
                        edit[index].Kills += Kills
                    } else {
                        edit[index].Kills += ', ' + Kills
                    }

                    if(edit[index].Tops == 0) {
                        edit[index].Tops = ''
                        edit[index].Tops += Posicion
                    } else {
                        edit[index].Tops += ", " + Posicion
                    }
                    edit[index].Points += puntuacion

                    file = JSON.stringify(file);
                    fs.writeFileSync(filePath, file)
                    resolve(`Agregado`)
                    }
                }
        })
        .catch(err => reject(err))
    })
    return await promise
}

async function ResetRanking({TeamName = '', Game = 0, Type = 'individual', Title = ''}) {
    const individual = (Type == 'individual')
    const Participant = TeamName
    const rankPath = individual ? `./data/teams/${TeamName.toLowerCase()}/rank.json` : `./data/teams/ranking.json`;
    ParticipantSlug = Participant.toLowerCase()
    Game = GamesData[Game].slug

    let promise = new Promise((resolve, reject) => {
        let file = fs.readFileSync(rankPath);
        file = JSON.parse(file);
        
        if(individual) {
            for(rank in file) {
                if(file[rank][Game]) {
                    for(player in file[rank][Game]) {
                        file[rank][Game][player].Kills = 0;
                        file[rank][Game][player].Tops = 0;
                        file[rank][Game][player].Points = 0;
                    }
                }
            }
            file = JSON.stringify(file)
            fs.writeFileSync(rankPath, file)
            resolve('Modificado')
        }
        if(!individual) {
            for(rank in file) {
                for(r in file[rank]) {
                    for(i in file[rank][r]) {
                        if(file[rank][r][i][Title.toLowerCase()]) {
                            let largo = file[rank][r][i][Title.toLowerCase()].length
                            for(p = 1; p < largo; p++) {
                                file[rank][r][i][Title.toLowerCase()][p].Kills = 0
                                file[rank][r][i][Title.toLowerCase()][p].Tops = 0
                                file[rank][r][i][Title.toLowerCase()][p].Points = 0
                            }
                        }
                    }
                }
            }
            file = JSON.stringify(file)
            fs.writeFileSync(rankPath, file)
            resolve('Modificado')
        }
        reject('No se logró')
    })

    return await promise
}

async function DeleteRanking({TeamName = '', Game = 0, Type = 'individual', Title = '' }) {
    const individual = (Type == 'individual')
    const Participant = TeamName
    const rankPath = individual ? `./data/teams/${TeamName.toLowerCase()}/rank.json` : `./data/teams/ranking.json`;
    ParticipantSlug = Participant.toLowerCase()
    Game = GamesData[Game].slug

    let promise = new Promise((resolve, reject) => {
        let file = fs.readFileSync(rankPath);
        file = JSON.parse(file);

        if(individual) {
            for(rank in file) {
                if(file[rank][Game]) {
                    for(index in file[rank]) {
                        if(file[rank][index] == file[rank][Game]) {
                            delete file[rank][index]
                            for(i in file) {
                                if(Object.keys(file[i]).length === 0) {
                                    if(i == 0) {
                                        file.shift()
                                    } else {
                                        file.splice(i)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            file = JSON.stringify(file)
            fs.writeFileSync(rankPath, file)
            resolve('Modificado')
        }
        if(!individual) {
            for(rank in file) {
                for(r in file[rank]) {
                    for(i in file[rank][r]) {
                        if(file[rank][r][i][Title.toLowerCase()]) {
                            let index = parseInt(i)
                            if(index == 0) {
                                file[rank][r].shift()
                            } else {
                                file[rank][r].splice(index)
                            }
                        }
                    }
                }
            }
            for(rank in file) {
                for(r in file[rank]) {
                    if(file[rank][r].length == 0) {
                        if(rank == 0) {
                            file.shift()
                        } else {
                            file.splice(rank)
                        }
                    }
                }
            }
            file = JSON.stringify(file)
            fs.writeFileSync(rankPath, file)
            resolve('Modificado')
        }
        reject('No se logró')
    })

    return await promise
}

module.exports = {
    AddPlayerPoints,
    AddPlayersNumbers,
    AddPlayerToRankTable,
    AddPlayerPoints,
    ResetRanking,
    DeleteRanking
}