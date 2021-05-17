const fs = require('fs')
const Create = require('./Create')
const Scheme = require('./Schemes')

// Obtener los datos del archivo de Teams
async function GetTeamsData(Filename = String) {
    let promise = new Promise((resolve, reject) => {
        fs.readFile(`./data/${Filename}.json`, (err, data) => {
            if(err) { reject('El archivo no tiene datos o no existe') }
            try {
                let filedata = JSON.parse(data)
                resolve(filedata)
            } catch {
                // Si no existe ningún team entonces creará uno nuevo
                CreateFirstTeam()
                resolve(GetRawData(Filename))
            }
        });
    })
    return await promise
}

// Crear el team "Reclutas libres"
async function CreateFirstTeam() {
    let team = new Scheme.Team(0, 'Reclutas Libres', [])
    team = JSON.stringify([team])
    fs.writeFileSync('./data/teams.json', team)
}

module.exports = {
    GetTeamsData
}