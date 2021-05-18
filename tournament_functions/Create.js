const fs = require('fs')
const Team = require('./Schemes.js').Team
const Player = require('./Schemes').Player
const Search = require('./Search')
const Get = require('./Get')

// Crear un Team 
async function CreateTeam(team = Team) {
    let promise = new Promise((resolve, reject) => {
        // Buscar si ya existe un Team con el nombre otorgado
        Search.SearchTeam(team.TeamName)
            // Si ya existe tal nombre lanzará un error
            .then(err => reject(err))
            .catch((message) => {
                // Obtener data del archivo "teams" para adjuntar el nuevo grupo
                Get.GetTeamsData()
                    .then(teams => {
                        let id = teams.length;
                        team.TeamID = id
                        team.Players = 0
                        teams.push(team)

                        teams = JSON.stringify(teams)
                        fs.writeFileSync('./data/teams/index.json', teams)
                        
                        resolve('Creado')
                    })
                    .catch(err => reject(err))
            })
    })
    return await promise
}


async function CreatePlayer(player, TeamName) {
    let promise = new Promise((resolve, reject) => {
        Search.SearchPlayer(player, TeamName)
            .then(err => reject(err))
            .catch((message) => {
                Get.GetTeamPlayers(TeamName)
                    .then(players => {
                        let id = players.length;
                        let newPlayer = new Player(id, player)
                        players.push(newPlayer)

                        players = JSON.stringify(players)
                        fs.writeFileSync(`./data/teams/${TeamName}/players.json`, players)
                        
                        resolve('Creado')
                    })
                    .catch(err => reject(err))
            })
    })

    return await promise
}

// Crear una tabla de Ranking
async function CreateRank(team, game) {
    let promise = new Promise((resolve, reject) => {
        let Rank = `[{ "${game}" : []}]`
        Rank = JSON.parse(Rank)
        Get.GetTeamPlayers(team.TeamName)
            .then(players => {
                for(var p in players) {
                    let Player = players[p]
                    Rank[0][game].push({
                        Player: Player.Username,
                        Kills: 0,
                        Tops: 0,
                        Points: 0
                    })
                }
                Rank.sort((a, b) => b.Points - a.Points)
                fs.writeFileSync(`./data/teams/${team.TeamName}/rank.json`, JSON.stringify(Rank))
                resolve(Rank)
            })
            .catch(err => reject(err))
    })
    return await promise
}

async function InitTeam(TeamName) {
    let promise = new Promise(async (resolve, reject) => {
        let whiteFile = []
        whiteFile = JSON.stringify(whiteFile)
        await fs.mkdirSync(`./data/teams/${TeamName}`, {recursive: true})
        await fs.writeFileSync(`./data/teams/${TeamName}/players.json`, whiteFile)
        await fs.writeFileSync(`./data/teams/${TeamName}/rank.json`, whiteFile)
        await fs.writeFileSync(`./data/teams/${TeamName}/brackets.json`, whiteFile)
    })

    return await promise
}

module.exports = {
    CreateTeam,
    CreateRank,
    InitTeam,
    CreatePlayer
}