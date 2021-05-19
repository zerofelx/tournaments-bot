const fs = require('fs')
const Get = require('./Get')
const GamesData = require('../data/games.json');


// Buscar un equipo
async function SearchTeam(TeamName) {
    let promise = new Promise((resolve, reject) => {
        Get.GetTeamsData('teams')
            .then(teams => {
                for(T in teams) {
                    if(teams[T].TeamName == TeamName) {
                        resolve(`El team '${TeamName}' existe.`)
                    }
                }
                reject(`El team '${TeamName}' no existe.`)
            }).catch(err => reject(err))
    })

    return await promise
}

// Buscar el raking de un equipo
async function SearchRanking(TeamName, Game = 0) {
    TeamName = TeamName.toLowerCase()
    let GameSlug = GamesData[Game].slug

    let promise = new Promise((resolve, reject) => {
        fs.readFile(`./data/teams/${TeamName}/rank.json`, (err, data) => {
            if(err) { reject(err) }
            try {
                let Rank = JSON.parse(data)
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
    let promise = new Promise((resolve, reject) => {
        Get.GetTeamPlayers(TeamName)
            .then(players => {
                for(P in players) {
                    if(players[P].Username == PlayerName) {
                        resolve(`El jugador '${PlayerName}' ya existe`)
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