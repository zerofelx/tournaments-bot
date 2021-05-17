const fs = require('fs')
const Team = require('./Schemes.js').Team
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
                Get.GetTeamsData('teams')
                    .then(teams => {
                        let id = teams.length;
                        team.TeamID = id
                        teams.push(team)

                        teams = JSON.stringify(teams)
                        fs.writeFileSync('./data/teams.json', teams)
                        resolve('Creado')
                    })
                    .catch(err => reject(err))
            })
    })
    return await promise
}


// Crear una tabla de Ranking
function CreateRank(team = Team, order = String) {
    let Rank = []
    for(var p in team.Players) {
        let Player = team.Players[p]
        Rank.push({
            Player: Player.Username,
            Kills: Player.TotalKills,
            Tops: Player.Tops,
            Points: Player.Points
        })
    }
    switch (order) {
        case "kills":
            Rank.sort((a, b) => b.Kills - a.Kills)
        case "nombre":
            Rank.sort((a, b) => b.Points - a.Points)
            break;
        default:
            Rank.sort((a, b) => b.Points - a.Points)
            break;
    }
    return Rank
}

module.exports = {
    CreateTeam,
    CreateRank
}