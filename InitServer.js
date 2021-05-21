//
//      INICIAR SERVIDOR PARA MANTENER EL BOT 24/7
//

const Express = require('express');
const app = Express()

app.get('/', function (req, res) {
    res.send('Hello World')
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
