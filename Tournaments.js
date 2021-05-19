const fs = require('fs');

const Scheme = require('./tournament_functions/Schemes');
const C = require('./tournament_functions/Create');
const G = require('./tournament_functions/Get');
const S = require('./tournament_functions/Search');
const A = require('./tournament_functions/Modify')

let Guayabitas = new Scheme.Team(1, 'guayabitas','Guayabitas', 3)


C.CreateTeam(Guayabitas).catch(err => console.log(err))
    .then(() => {
        C.CreatePlayer('Zerofelx', Guayabitas.TeamName)
            .then(() => {
                C.CreateRank('Guayabitas', 1).then((m) => {
                    console.log(m)
                    G.GetRankingData('Guayabitas', 1).then(m => console.log(m)).catch(err => console.log("Error obteniendo Ranking: ", err))
                }).catch(err => console.log("Error creando Ranking: ", err))
            })
            .catch(e => console.log(e))
    })
    .catch(m => console.log("Error creando el team  ", m))
 
let PlayerPoints = {
    Player: 'Zerofelx',
    Team: 'Guayabitas',
    Game: 'COD',
    Tops: 1,
    Kills: 8,
    Points: 500
}

// A.AddPlayerPoints(PlayerPoints).then(m => console.log(m)).catch(err => console.log(err))

module.exports = {
    // GuayabitasRank
}