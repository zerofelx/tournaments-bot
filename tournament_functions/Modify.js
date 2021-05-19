const fs = require('fs');
const Get = require('./Get');

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

module.exports = {
    AddPlayerPoints,
    AddPlayersNumbers
}