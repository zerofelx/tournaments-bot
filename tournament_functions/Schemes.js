class Player {
    constructor(UserID, Username) {
        this.UserID = UserID,
        this.Username = Username
    }
}

class Team {
    constructor(TeamID, Slug, TeamName, Players) {
        this.TeamName = TeamName,
        this.Slug = Slug,
        this.TeamID = TeamID,
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
    constructor(TeamName, Game, Rank) {
        this.TeamName = TeamName,
        this.Game = Game,
        this.Rank = Rank
    }
}

class TeamRankTable {
    constructor(Type, Title, Game, Rank) {
        this.Type = Type,
        this.Title = Title,
        this.Game = Game,
        this.Rank = Rank
    }
}

module.exports = {
    Player,
    Team,
    RankTable,
    TeamRankTable
}