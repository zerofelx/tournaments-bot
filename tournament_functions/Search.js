const fs = require('fs')
const Get = require('./Get')
const GamesData = require('../data/games.json');


// Buscar un equipo
async function SearchTeam(TeamName) {
    let promise = new Promise((resolve, reject) => {
        Get.GetTeamsData('teams')
            .then(teams => {
                for(T in teams) {
                    if(teams[T].TeamName.toLowerCase() == TeamName.toLowerCase()) {
                        resolve(`El team '${TeamName}' existe.`)
                    }
                }
                reject(`El team '${TeamName}' no existe.`)
            }).catch(err => reject(err))
    })

    return await promise
}

// Buscar el raking de un equipo
async function SearchRanking({TeamName = '', Game = 0, Type = 'individual'}) {
    let GameSlug = GamesData[Game].slug
    const individual = (Type == 'individual')

    let promise = new Promise((resolve, reject) => {
        let filePath = '';
        if(individual) {
            TeamName = TeamName.toLowerCase()
            filePath = `./data/teams/${TeamName}/rank.json`;
        }
        if (!individual) {
            filePath = './data/teams/ranking.json'
        }
        fs.readFile(filePath, (err, data) => {
            if(err) { reject(err) }
            try {
                let Rank = []
                try {
                    Rank = JSON.parse(data)
                } catch {
                    Rank = []
                }

                if( Rank == 0) { resolve(false) }

                for(i = 0; i < Rank.length; i++) {
                    if(Rank[i][GameSlug]) {
                        resolve(true)
                    }
                }
                resolve(false)

            } catch {
                reject('No existe este ranking')
            }
        })
    })

    return await promise
}

// Buscar un jugador
async function SearchPlayer(PlayerName, TeamName) {
    TeamName = TeamName.toLowerCase()
    let promise = new Promise((resolve, reject) => {
        Get.GetTeamPlayers(TeamName)
            .then(players => {
                for(P in players) {
                    if(players[P].Username == PlayerName) {
                        resolve(`El jugador '${PlayerName}' ya existe en este equipo`)
                    }
                }
                reject(`El jugador ${PlayerName} no existe`);
            }) 
            .catch(err => reject(err))
    })

    return await promise
}

// Buscar un jugador por su ID
async function SearchTeamByID(ID) {
    let promise = new Promise((resolve, reject) => {
        Get.GetTeamsData('teams').then(teams => {
            for(T in teams) {
                if(parseInt(teams[T].TeamID) == ID) {
                    resolve(`El team con el ID '${ID}' existe.`)
                }
            }
            resolve(`El team con el ID '${ID}' no existe.`)
        }).catch(err => reject(err))
    })

    return await promise
}

module.exports = {
    SearchTeam,
    SearchTeamByID,
    SearchPlayer,
    SearchRanking
}