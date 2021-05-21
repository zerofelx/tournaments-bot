const fs = require('fs')
const Scheme = require('./Schemes')
const GamesData = require('../data/games.json');

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
    TeamName = TeamName.toLowerCase()
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
async function GetRankingData({TeamName, Game = 0}) {
    TeamSlug = TeamName.toLowerCase()

    let GameSlug = GamesData[Game].slug
    let GameTitle = GamesData[Game].title

    let promise = new Promise((resolve, reject) => {
        fs.readFile(`./data/teams/${TeamSlug}/rank.json`, (err, data) => {
            if(err) { reject(err) }
            try {
                let Rank = JSON.parse(data)

                if( Rank == 0) { reject(('Ranking vacío 1'), Rank) }

                for(i in Rank) {
                    if(Rank[i][GameSlug] != undefined) {
                        let Ranking = Rank[i][GameSlug].sort((a, b) => b.Points - a.Points)
                        let Table = new Scheme.RankTable(`${TeamName}`, GameTitle, Ranking)
                        resolve(Table)
                    }
                }
                reject('No existe')
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
    let TeamSlug = 'reclutas libres'

    let team = new Scheme.Team(0, TeamSlug,TeamName, 0)
    TeamName = TeamName.toLowerCase()
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
    TeamName = TeamName.toLowerCase()
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