const fs = require('fs')
const Team = require('./Schemes.js').Team
const Player = require('./Schemes').Player
const Search = require('./Search')
const Get = require('./Get')
const Modify = require('./Modify');
const GamesData = require('../data/games.json');

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
                        InitTeam(team.TeamName)
                        fs.writeFileSync('./data/teams/index.json', teams)
                        
                        resolve('Creado')
                    })
                    .catch(err => reject(err))
            })
    })
    return await promise
}


// Crear jugador vinculado a un equipo en especifico
async function CreatePlayer(player, TeamName = 'Reclutas Libres') {
    TeamName = TeamName.toLowerCase()
    let promise = new Promise((resolve, reject) => {
        // Buscar jugador, si existe salta error pero si no existe procede a crearlo
        Search.SearchPlayer(player, TeamName)
            .then(err => reject(err))
            .catch((message) => {
                // Obtener la lista de jugadores para actualizarla
                Get.GetTeamPlayers(TeamName)
                    .then(players => {
                        let id = players.length;
                        let newPlayer = new Player(id, player)
                        players.push(newPlayer)

                        players = JSON.stringify(players)
                        fs.writeFileSync(`./data/teams/${TeamName}/players.json`, players)

                        // Agregar +1 al número de jugadores de un equipo
                        Modify.AddPlayersNumbers({ TeamName: TeamName, Number: 1 })
                        resolve('Creado')
                    })
                    .catch(err => reject(err))
            })
    })

    return await promise
}

// Crear una tabla de Ranking
async function CreateRank({TeamName, game = 0}) {
    let GameSlug = GamesData[game].slug

    TeamName = TeamName.toLowerCase()

    let promise = new Promise((resolve, reject) => {
        let Rank = `[{ "${GameSlug}" : []}]`
        Rank = JSON.parse(Rank)
        // Busca el Ranking del juego en concreto, si ya existe saltará error.
        Search.SearchRanking(TeamName, game)
            .catch((err) => reject('El ranking ya existe: ' + err))
            .then(response => {
                if(response == false) {
                    // Lee la lista de Rankings de ese equipo y la actualiza agregando el nuevo ranking
                    let RankingsJSON = fs.readFileSync(`./data/teams/${TeamName}/rank.json`)
                    RankingsJSON = JSON.parse(RankingsJSON)
                    // Obtiene la lista de jugadores de un equipo para agregarlos al ranking
                    Get.GetTeamPlayers(TeamName)
                        .then(players => {
                            for(var p in players) {
                                let Player = players[p]
                                Rank[0][GameSlug].push({
                                    Player: Player.Username,
                                    Kills: 0,
                                    Tops: 0,
                                    Points: 0
                                })
                            }
                            Rank.sort((a, b) => b.Points - a.Points)
    
                            RankingsJSON.push(Rank[0])
                            fs.writeFileSync(`./data/teams/${TeamName}/rank.json`, JSON.stringify(RankingsJSON))
                            resolve('Ranking creado')
                        })
                        .catch(err => reject(err))
                } else if (response == true) {
                    reject('Error')
                }
            })

    })
    return await promise
}

// Crear los archivos necesarios para un nuevo equipo
async function InitTeam(TeamName) {
    let promise = new Promise(async (resolve, reject) => {
        TeamName = TeamName.toLowerCase()
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