const fs = require('fs');

const C = require('./tournament_functions/Create');
const G = require('./tournament_functions/Get');
const Scheme = require('./tournament_functions/Schemes');
const S = require('./tournament_functions/Search');

let Zerofelx = new Scheme.Player(368307243344461824,'Zerofelx');
let Cris = new Scheme.Player(2, 'Cris');
let Luis = new Scheme.Player(3, 'Luiis');

let Guayabitas = new Scheme.Team(1 ,'Guayabitas', 3)

C.CreateTeam(Guayabitas).catch(err => console.log(err))
    .then(() => {
        C.CreatePlayer('Zerofelx', Guayabitas.TeamName)
            .then(() => {
                C.CreateRank('Guayabitas', 'COD').then(() => {
                    G.GetRankingData('Guayabitas', 'COD')
                        .then(rank => console.log(rank))
                        .catch(err => console.log("Table: ", err))
                })
                .catch(m => console.log("Error creando el ranking  ", m))
            })
            .catch(e => console.log(e))
    })
    .catch(m => console.log("Error creando el team  ", m))

module.exports = {
    // GuayabitasRank
}