const fs = require('fs')
const Create = require('./Create')
const Scheme = require('./Schemes')

// Obtener los datos del archivo de Teams
async function GetTeamsData() {
    let promise = new Promise((resolve, reject) => {
        fs.readFile(`./data/teams/index.json`, (err, data) => {
            if(err) { reject('El archivo no tiene datos o no existe') }
            try {
                let filedata = JSON.parse(data)
                resolve(filedata)
            } catch {
                // Si no existe ningún team entonces creará uno nuevo
                CreateFirstTeam()
                resolve(GetTeamsData())
            }
        });
    })
    return await promise
}


// Obtener los jugadores de un Team
async function GetTeamPlayers(TeamName) {
    let promise = new Promise((resolve, reject) => {
        fs.readFile(`./data/teams/${TeamName}/players.json`, (err, data) => {
            if(err) { reject('El archivo no tiene datos o no existe') }
            try {
                let filedata = JSON.parse(data)
                resolve(filedata)
            } catch {
                CreateFirstPlayer(TeamName)
                resolve(GetTeamPlayers)
            }
        })
    })

    return await promise
}

// Obtener los datos de un Ranking
async function GetRankingData(TeamName, Game) {
    let promise = new Promise((resolve, reject) => {
        fs.readFile(`./data/teams/${TeamName}/rank.json`, (err, data) => {
            if(err) { reject(err) }
            try {
                let Rank = JSON.parse(data)
                let Table = new Scheme.RankTable(`${TeamName}`, Game, Rank[0][Game])
                resolve(Table)
            } catch {
                reject('No existe este ranking')
            }
        })
    })

    return await promise
}

// Crear el team "Reclutas libres"
async function CreateFirstTeam() {
    let TeamName = 'Reclutas Libres'

    let team = new Scheme.Team(0, TeamName, 0)
    team = JSON.stringify([team])
    await fs.writeFileSync('./data/teams/index.json', team)

    let whiteFile = []
    whiteFile = JSON.stringify(whiteFile)
    await fs.mkdirSync(`./data/teams/${TeamName}`, {recursive: true})
    await fs.writeFileSync(`./data/teams/${TeamName}/players.json`, whiteFile)
    await fs.writeFileSync(`./data/teams/${TeamName}/rank.json`, whiteFile)
    await fs.writeFileSync(`./data/teams/${TeamName}/brackets.json`, whiteFile)
}


// Crear el jugador Null
async function CreateFirstPlayer(TeamName) {
    let User = 'NullPlayer'

    let player = new Scheme.Player(0, User, 0, 0, 0)
    player = JSON.stringify([player])
    fs.writeFileSync(`./data/teams/${TeamName}/players.json`, player)
}

module.exports = {
    GetTeamsData,
    GetTeamPlayers,
    GetRankingData
}