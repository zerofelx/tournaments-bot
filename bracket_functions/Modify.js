const fs = require('fs');
const Get = require('./Get');
const Search = require('./Search');

async function AddPoints({ ID = '', type = 'individual', TeamName = '', Points = 0 }) {
    let TeamSlug = TeamName.toLowerCase()

    let promise = new Promise((resolve, reject) => {
        Get.ActualBracket({ type: type })
        .then(data => {
            for(b in data) {
                if(data[b][ID]) {
                    try {
                        for(t in data[b][ID].teams) {
                            let team = data[b][ID].teams[t]
                            let teamSlug = team[0].toLowerCase();

                            if(teamSlug == TeamSlug) {
                                team[1] = Points
    
                                let write = JSON.stringify(data)
                                fs.writeFileSync(`./data/brackets/${type}/actual.json`, write)
                                resolve('Se editaron correctamente los puntos del equipo ' + TeamName + " | Puntos: " + Points)
                            }
                        }
                        reject('No se encontró ningún participante con ese nombre, revísalo y vuelve a intentarlo. Nombre: ' + TeamName)
                    } catch {
                        reject('No se encontró ningún participante con ese nombre, revísalo y vuelve a intentarlo. Nombre: ' + TeamName)
                        
                    }
                } else {
                    reject("No se encontró el torneo con el ID: " + ID)
                }
            }
        })
    })
    return await promise
}

async function NextStage({ ID = '', type = 'individual'}) {
    const path = `./data/brackets/${type}/actual.json`;
    const finalPath = `./data/brackets/${type}/historial.json`;
    let promise = new Promise((resolve, reject) => {
        Get.ActualBracket({ type: type })
        .then(data => {
            let message = {
                'Stage': 'Bracket',
                'Message': ''
            }
            for(b in data) {
                if(data[b][ID]) {
                    let teams = data[b][ID].teams
                    let status = data[b][ID].actualStatus
                    let losers = data[b][ID].losers

                    let winners = []
                    let addWinner = []
                    let addLosers = []
                    let count = 0

                    for(c in status) {
                        count++
                    }
                    if(count > 1) {
                        for(r in status) {
                            let firstTeamPoints = teams[status[r][0]][1]
                            let SecondTeamPoints = teams[status[r][1]][1]

                            if(firstTeamPoints > SecondTeamPoints) {
                                winners.push(teams[status[r][0]])
                                addLosers.push(teams[status[r][1]])
                            } 
                            if(firstTeamPoints < SecondTeamPoints) {
                                winners.push(teams[status[r][1]])
                                addLosers.push(teams[status[r][0]])
                            }
                            if(SecondTeamPoints == firstTeamPoints){
                                reject("Hay un empate entre los equipos: " + teams[status[r][0]][0] + " y " + teams[status[r][1]][0] )
                                return
                            }
                        }

                        let winnersObject = '{'
                        for(p in winners) {
                            winnersObject += `"${parseInt(p)+1}": ["${winners[p][0]}", 0]`
                            if(p < winners.length -1) { winnersObject += ',' }
                        }
                        winnersObject += '}'; winnersObject = JSON.parse(winnersObject); data[b][ID].teams = winnersObject;

                        let actualStatus = '{'
                        let currentPID = 1
                        for(r = 1; r <= winners.length/2; r++) {
                            actualStatus += `"${r}": [${currentPID++}, ${currentPID++}]`
                            if(r < winners.length/2) { actualStatus += ',' }
                        }
                        actualStatus += '}'; actualStatus = JSON.parse(actualStatus); data[b][ID].actualStatus = actualStatus;

                        let rounds = 0
                        for(enf in actualStatus) {
                            rounds++
                        }
                        
                        losers.push(addLosers); data[b][ID].losers = losers;

                        let write = JSON.stringify(data);
                        
                        fs.writeFileSync(path, write)

                        if(rounds == 8) {
                            message.Stage = "Etapa: Octavos de final" 
                        }
                        if(rounds == 4) {
                            message.Stage = "Etapa: Cuartos de final"
                        }
                        if(rounds == 2) {
                            message.Stage = "Etapa: Semifinal"
                        }
                        if(rounds == 1) {
                            message.Stage = "Etapa: Final"
                        }
                        message.Message = 'Se cambió correctamente de etapa'

                        resolve(message)
                    } else {
                        let firstFinalist = teams[status[1][0]]
                        let secondFinalist = teams[status[1][1]]
                        if(firstFinalist[1] > secondFinalist[1]) {
                            addWinner = firstFinalist
                            data[b][ID].teams = []
                            data[b][ID].winner = addWinner
                        }
                        if(firstFinalist[1] < secondFinalist[1]) {
                            addWinner = secondFinalist
                            data[b][ID].teams = []
                            data[b][ID].winner = addWinner
                        }
                        if(firstFinalist[1] == secondFinalist[1]) {
                            reject(firstFinalist[0] + " y " + secondFinalist[0] + " tienen el mismo puntaje.")
                            return
                        }
                        
                        let finalFile = fs.readFileSync(finalPath);
                        try {
                            finalFile = JSON.parse(finalFile);
                        } catch {
                            finalFile = []
                        }
                        finalFile.push(data[b])
                        finalWrite= JSON.stringify(finalFile);
                        fs.writeFileSync(finalPath, finalWrite)

                        data.splice(b, 1);
                        let updateActual = JSON.stringify(data);
                        fs.writeFileSync(path, updateActual)

                        message.Stage = 'Ganador';
                        message.Message = 'El ganador es: ' + addWinner[0] + ' con ' + addWinner[1] +' puntos finales!'
                        resolve(message)
                    }

                } else {
                    reject("No se encontró el torneo con el ID: " + ID)
                }
            }
        })
    })
    return await promise
}

async function DeleteBracket({ID = '', Type = ''}) {
    const Path = `./data/brackets/${Type}/actual.json`;

    let promise = new Promise((resolve, reject) => {
        let file = fs.readFileSync(Path);
        file = JSON.parse(file);

        for(b in file) {
            if(file[b][ID]) {
                if(b == 0) {
                    file.shift()
                } else {
                    file.splice(b)
                }
                file = JSON.stringify(file);
                fs.writeFileSync(Path, file)
                resolve('hecho')
            }
        }
        reject('Error')
    })

    return await promise
}

module.exports = {
    AddPoints,
    NextStage,
    DeleteBracket
}