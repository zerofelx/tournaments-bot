const fs = require('fs');
const Get = require('./Get');
const { SearchPlayer } = require('./Search');
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
}

async function AddPlayerToRankTable({TeamName = '', PlayerName, Game = 0}) {
    TeamName = TeamName.toLowerCase()
    Game = GamesData[Game].slug

    let promise = new Promise((resolve, reject) => {
        SearchPlayer(PlayerName, TeamName)
        .then(() => {
            let rankPath = `./data/teams/${TeamName}/rank.json`;
            let rankFile = fs.readFileSync(rankPath);
            rankFile = JSON.parse(rankFile)

            let Rank = rankFile[0][Game]
            let Crear = true

            if(Rank == undefined) { reject('Este ranking no existe') }
            for(p in Rank) {
                if(Rank[p].Player == PlayerName) {
                    Crear = false
                }
            }
            if(Crear) {
                Rank.push({
                    Player: PlayerName,
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
    })
    return await promise
}

module.exports = {
    AddPlayerPoints,
    AddPlayersNumbers,
    AddPlayerToRankTable
}