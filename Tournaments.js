const fs = require('fs');

const C = require('./tournament_functions/Create');
const G = require('./tournament_functions/Get');
const Scheme = require('./tournament_functions/Schemes');
const S = require('./tournament_functions/Search');

let Zerofelx = new Scheme.Player(368307243344461824,'Zerofelx');
let Cris = new Scheme.Player(2, 'Cris');
let Luis = new Scheme.Player(3, 'Luiis');

let Guayabitas = new Scheme.Team(1 ,'Guayabitas', 3)

// GuayabitasRank = new Scheme.RankTable('Guayabitas', 'Call of Duty: Mobile', C.CreateRank(Guayabitas, 'Call of Duty: Mobile'))
G.GetRankingData('Guayabitas', 'LoL').then(rank => console.log(rank)).catch(err => console.log(err))

C.CreateTeam(Guayabitas).catch(err => console.log(err))

C.CreatePlayer('Zerofelx', Guayabitas.TeamName).then(m => console.log(m)).catch(e => console.log(e))

module.exports = {
    // GuayabitasRank
}