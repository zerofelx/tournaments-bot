const fs = require('fs');
const nanoid = require('nanoid').nanoid;
const Get = require('./Get')
const Search = require('./Search')

async function NewBracket({ Game = 0, Participants = [], type = 'individual'}) {
    let promise = new Promise((resolve, reject) => {
        Get.ActualBracket({ type: type })
        .then(data => {
            if(Participants.length %2 == 0){
                const ID = nanoid(6);
                let bracket = `{"${ID}": {}}`
                bracket = JSON.parse(bracket)

                let teams = '{'

                for(p in Participants) {
                    teams += `"${parseInt(p)+1}": ["${Participants[p]}", 0]`
                    if(p < Participants.length -1) {
                        teams += ','
                    }
                }
                teams += '}'
                teams = JSON.parse(teams)

                let rounds = Participants.length / 2;
                
                if(rounds%2 == 0) {
                    let actualStatus = '{'
                    let currentPID = 1

                    for(r = 1; r <= rounds; r++) {
                        actualStatus += `"${r}": [${currentPID++}, ${currentPID++}]`
                        if(r < rounds) {
                            actualStatus += ','
                        }
                    }
                    actualStatus += '}'

                    actualStatus = JSON.parse(actualStatus)

                    let BracketData = { 
                        "Game" : Game, 
                        teams, 
                        actualStatus,
                        losers: [],
                        winner: []
                    }
    
                    bracket[ID] = BracketData
                    data.push(bracket)
                    
                    let write = JSON.stringify(data)
                    fs.writeFile(`./data/brackets/${type}/actual.json`, write, (err) => {
                        if(err) { reject(err) }
                        resolve(ID)
                    })
                }

            }
        })
    })
    return await promise
}

module.exports = {
    NewBracket
}