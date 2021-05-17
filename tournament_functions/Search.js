const Get = require('./Get')

async function SearchTeam(TeamName = String) {
    let promise = new Promise((resolve, reject) => {
        Get.GetTeamsData('teams')
            .then(teams => {
                for(T in teams) {
                    if(teams[T].TeamName == TeamName) {
                        resolve(`El team '${TeamName}' existe.`)
                    }
                }
                reject(`El team '${TeamName}' no existe.`)
            }).catch(err => reject(err))
    })

    return await promise
}

async function SearchTeamByID(ID) {
    let promise = new Promise((resolve, reject) => {
        Get.GetTeamsData('teams').then(teams => {
            for(T in teams) {
                if(parseInt(teams[T].TeamID) == ID) {
                    resolve(`El team con el ID '${ID}' existe.`)
                }
            }
            resolve(`El team con el ID '${ID}' no existe.`)
        }).catch(err => reject(err))
    })

    return await promise
}

module.exports = {
    SearchTeam,
    SearchTeamByID
}