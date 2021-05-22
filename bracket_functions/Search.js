const Get = require('./Get');


async function ActualBracket({ ID = '', type = 'individual' }) {
    let promise = new Promise((resolve, reject) => {
        Get.ActualBracket({ type: type})
        .then(data => {
            for(b in data) {
                if(data[b][ID]) {
                    resolve(data[b][ID])
                }
            }
            reject('No existe')
        })
    })
    return await promise
}





module.exports = {
    ActualBracket
}