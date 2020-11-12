const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { totalmem } = require('os')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Alec Zebrick'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Alec Zebrick'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Some helpful text',
        name: 'Alec Zebrick',
        title: 'Help'
    })
})


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Unable to find location. Try another search'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error)  {
            return res.send({ error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData, 
                location,
                address: req.query.address
            })
        })
    })
    
})


app.get('/help/*', (req,res) => {
   res.render('404', {
       title: '404',
       name: 'Alec Zebrick',
       errorMessage: 'Help article not found.'
   })
})

app.get('*', (req, res) => {
   res.render('404', {
       title: '404',
       name: 'Alec Zebrick',
       errorMessage: 'Page not found'
   })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})