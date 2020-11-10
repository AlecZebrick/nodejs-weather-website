const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=a243610b0865d603985b9e40826f5916&query=' + latitude + ',' + longitude + '&units=f'

    request ({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, body.current.weather_descriptions + ' It is currently ' + body.current.temperature + ' degress out. There is a ' + body.current.precip+ '% chance of rain.')
        }
    })
}

module.exports = forecast