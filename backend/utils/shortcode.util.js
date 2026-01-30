const crypto = require('crypto')

function generateShortCode(length=6){
    const characters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    let shortCode=''

    const randomByte = crypto.randomByte(length)

    for (let i = 0;i<length; i++ ){
        const randomIndex = randomByte[i] % characters.length

        shortCode += characters[randomIndex]

    }
    return shortCode

}

module.exports={generateShortCode}