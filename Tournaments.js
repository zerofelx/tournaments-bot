const fs = require('fs');

const C = require('./tournament_functions/Create');
const G = require('./tournament_functions/Get');
const Scheme = require('./tournament_functions/Schemes');
const S = require('./tournament_functions/Search');

let Zerofelx = new Scheme.Player(368307243344461824,'Zerofelx', 20, 2 , 1000);
let Cris = new Scheme.Player(2, 'Cris', 35, 5 ,1750);
let Luis = new Scheme.Player(3, 'Luiis', 54, 10, 2700);

let Guayabitas = new Scheme.Team(1 ,'Guayabitas', [Zerofelx, Cris, Luis])


let GuayabitasRank = new Scheme.RankTable('Guayabitas', 'Call of Duty: Mobile', C.CreateRank(Guayabitas))

C.CreateTeam(Guayabitas).catch(err => console.log(err))

module.exports = {
    GuayabitasRank
}