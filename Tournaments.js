class Player {
    constructor(Username, TotalKills, Points) {
        this.Username = Username,
        this.TotalKills = TotalKills,
        this.Points = Points
    }
}

class Team {
    constructor(TeamName, Players) {
        this.TeamName = TeamName,
        this.Players = Players
    }
}

class Bracket {
    constructor(BracketName, Game, BracketPlaces, Players) {
        this.BracketName = BracketName,
        this.Game = Game,
        this.BracketPlaces = BracketPlaces,
        this.Players = Players
    }
}

class TeamsBracket {
    constructor(BracketName, Game, BracketPlaces, Team) {
        this.BracketName = BracketName,
        this.Game = Game,
        this.BracketPlaces = BracketPlaces,
        this.Team = Team
    }
}

class RankTable {
    constructor(TableName, Game, Rank) {
        this.TableName = TableName,
        this.Game = Game,
        this.Rank = Rank
    }
}

let Zerofelx = new Player('Zerofelx', 20, 1000);
let Cris = new Player('Cris', 35, 1750);

let Guayabitas = new Team('Guayabitas', [Zerofelx, Cris])

let GuayabitasRank = new RankTable('Guayabitas', 'Call of Duty: Mobile', CreateRank(Guayabitas))

function CreateRank(team, order) {
    let Rank = []
    for(var p in team.Players) {
        let Player = team.Players[p]
        Rank.push({
            Player: Player.Username,
            Kills: Player.TotalKills,
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

console.log(GuayabitasRank)