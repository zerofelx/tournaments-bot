const fs = require('fs');

async function ActualBracket({ type = 'individual' }) {
    let promise = new Promise((resolve, reject) => {
        const path = `./data/brackets/${type.toLowerCase()}/actual.json`;
        fs.readFile(path, (err, data) => {
            if(err) { reject(err) };
            try {
                data = JSON.parse(data)
            } catch {
                data = []
            }
            resolve(data)
        })
    })
    return await promise
}

async function BracketsHistorial({ type = 'individual' }) {
    let promise = new Promise((resolve, reject) => {
        const path = `./data/brackets/${type.toLowerCase()}/actual.json`;
        fs.readFile(path, (err, data) => {
            if(err) { reject(err) };
            data = JSON.parse(data)
            resolve(data)
        })
    })
    return await promise
}

module.exports = {
    ActualBracket,
    BracketsHistorial
}