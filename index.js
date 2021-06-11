require('./InitServer');
const Discord = require('discord.js');
const auth = process.env.token;
const client = new Discord.Client();
const Get = require('./tournament_functions/Get')

client.on('ready', () => {
    console.log("OK");

    Get.GetTeamsData()
});

//
//      COMANDOS:
//

const Funciones = require('./Funciones');
const Agregar = Funciones.Agregar
const Crear = Funciones.Crear;
const Mostrar = Funciones.Mostrar;

const Commands = {
    'crear' : {
        'equipo'    : Crear.Equipo,
        'jugador'   : Crear.Jugador,
        'ranking'   : Crear.Ranking,
        'bracket'   : Crear.Bracket
    },
    'mostrar': {
        'equipos': Mostrar.Equipos,
        'ranking': Mostrar.Ranking,
        'bracket': Mostrar.Bracket
    },
    'ranking' : {
        'agregar' : {
            'jugador' : Agregar.JugadorARankTable,
            'puntuacion': Agregar.Puntuacion,
            'puntuación': Agregar.Puntuacion,
            'equipo' : Agregar.EquipoARankTable
        }
    },
    'bracket' : {
        'agregar' : {
            'puntuacion': Agregar.BracketPuntuacion,
            'puntuación': Agregar.BracketPuntuacion
        },
        'siguiente' : {
            'etapa': Agregar.NetxStage
        }
    }
}

client.on('message', m => {

    client.login(auth);
    if(m.content.substring(0, 1) == '!') {
        let args = m.content.substring(1).split(' ');

        let command = args[0];
        let subcommand = args[1]
        command = command.toLowerCase()
        subcommand = subcommand.toLowerCase()
        if(command != '') {
            try {
                Commands[command][subcommand]({args: args, m: m})
            } catch {
                console.log("Error de comando?: " + command, subcommand)
            }
        }
    } else if (m.content.substring(0, 2) == '**') {
        try {
            let args = m.content.substring(2).split(' ');
    
            let command = args[0];
            let second = args[1]
            let third = args[2]
    
            command = command.toLowerCase()
            second = second.toLowerCase()
            third = third.toLowerCase()
            if(command != '') {
                try {
                    Commands[command][second][third]({args: args, m: m})
                } catch {
                    console.log("Error de comando?: " + command + second + third)
                }
            }
        }
        catch {}
    } else if(m.content.substring(0, 2) == '--') {
        let args = m.content.substring(2).split(' ');
        let command = args[0];
        
        command = command.toLowerCase()
        if(command != '') {
            try {
                Commands[command]({args: args, m: m})
            } catch {
                console.log("Error?: " + command)
            }
        }
    }
});

//
//      FIN DE COMANDOS
//

client.login(auth);