//
//      INICIAR SERVIDOR PARA MANTENER EL BOT 24/7
//

const Express = require('express');
const Path = require('path');
const app = Express()

app.get('/', function (req, res) {
    res.sendFile(Path.join(__dirname, '/index.html'))
})

app.get('/bracket-individual', function (req, res) {
    res.sendFile(Path.join(__dirname, '/data/brackets/individual/actual.json'))
})

app.get('/bracket-teams', function (req, res) {
    res.sendFile(Path.join(__dirname, '/data/brackets/teams/actual.json'))
})

app.get('/teams', function (req, res) {
    res.sendFile(Path.join(__dirname, '/data/teams/index.json'))
})

app.get('/games', function (req, res) {
    res.sendFile(Path.join(__dirname, '/data/games.json'))
})



let port = process.env.PORT || 3000;
app.listen(port)

require('dotenv').config()
console.log('Iniciando...')

//
//      FIN DEL SERVIDOR
//

//
//      INICIO DEL BOT
//
