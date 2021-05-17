class Player {
    constructor(UserID, Username, TotalKills, Tops, Points) {
        this.UserID = UserID,
        this.Username = Username,
        this.TotalKills = TotalKills,
        this.Tops = Tops
        this.Points = Points
    }
}

class Team {
    constructor(TeamID, TeamName, Players) {
        this.TeamName = TeamName,
        this.TeamID = TeamID
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

module.exports = {
    Player,
    Team,
    RankTable
}