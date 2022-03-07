const express = require('express')
const router = express.Router()
const db = require('../models')     // link to database
const axios = require('axios')      // prob don't need this
require('dotenv').config()      // prob don't need this

router.get('/', async (req, res)=> {
    try {
        res.render('favorites/show.ejs')
    } catch (err) {
        console.log('there was an error finding favorites page', err)
    }
})

// READ new favorite form
router.get('/new', async (req, res)=> {
    try {
        res.render('favorites/new.ejs')
    } catch (err) {
        console.log('there was an error finding favorites page', err)
    }
})

// READ selected favorite current weather
router.get('/:name/current', async (req, res)=> {
    try {
        const favoriteArea = await db.favorite.findOne({
            where: {name: req.params.name}
        })
        let findWeather = await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${favoriteArea.latitude}%2C${favoriteArea.longitude}?unitGroup=us&key=${process.env.WEATHER_API_KEY}&contentType=json`)             

        // description
        let dayDescription = await (findWeather.data.description)

        // OBJECT TO PULL DATA FROM
        let hourlyWeather = await findWeather.data.days[0].hours
        
        // hours array for x-axis of all charts
        let hours = await (hourlyWeather).map(el=> {return el.datetime})
        
        //temp chart
        let temps = await (hourlyWeather).map(el=> {return el.temp})
        
        // wind chart
        let windSpeed = await (hourlyWeather).map(el=> {return el.windspeed})
        let windGusts = await (hourlyWeather).map(el=> {return el.windgust})
        
        // precip chart
        let precip = await (hourlyWeather).map(el=> {return el.precip})

        // percentages chart
        let cloudCover = await (hourlyWeather).map(el=> {return el.cloudcover})
        let precipProb = await (hourlyWeather).map(el=> {return el.precipprob})

        res.render('./areas/currentweather.ejs', {
            location: favoriteArea.name,

            // DESCRIPTION
            dayDescription,

            // CURRENT CONDITIONS
            currentConditions: findWeather.data.currentConditions.conditions,
            currentTemp: findWeather.data.currentConditions.temp,
            currentFeelsLike: findWeather.data.currentConditions.feelslike,
            currentWindSpeed: findWeather.data.currentConditions.windspeed,
            currentWindDir: findWeather.data.currentConditions.winddir,
            currentCloudCover: findWeather.data.currentConditions.cloudcover,

            // HOURLY
            hours,
            temps,
            windSpeed,
            windGusts,
            precip,
            cloudCover,
            precipProb,
            
            // SNOWPACK
            snowDepth: findWeather.data.days[0].snowdepth,
        })
    } catch (err) {
        console.log('there was an error finding the current forecast for favorite area', err)
    }
})

// READ selected favorite weather forecast
router.get('/:name/forecast', async (req, res)=> {
    try {
        const favoriteArea = await db.favorite.findOne({
            where: {name: req.params.name}
        })
        // ajax weather forecast
        let forecastUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${favoriteArea.latitude}%2C${favoriteArea.longitude}/next7days?unitGroup=us&key=${process.env.WEATHER_API_KEY}&contentType=json`
        let findWeather = await axios.get(forecastUrl)
        
        // dates array for x-axis of all charts
        let dates = await (findWeather.data.days).map(el=> {return el.datetime})
        
        // temp chart
        let highTemps = await (findWeather.data.days).map(el=> {return el.tempmax}) 
        let lowTemps = await (findWeather.data.days).map(el=> {return el.tempmin})

        // wind chart
        let windSpeeds = await (findWeather.data.days).map(el=> {return el.windspeed})
        let windGusts = await (findWeather.data.days).map(el=> {return el.windgust})
        
        // precip chart
        let precip = await (findWeather.data.days).map(el=> {return el.precip})

        // percentages chart
        let cloudCover = await (findWeather.data.days).map(el=> {return el.cloudcover})
        let precipProb = await (findWeather.data.days).map(el=> {return el.precipprob})
        

        res.render('./areas/forecast.ejs', {
            location: favoriteArea.name,
            forecastDescription: findWeather.data.description,
            forecastDays: findWeather.data.days,
            dates,
            highTemps,
            lowTemps,
            windSpeeds,
            windGusts,
            precip,
            cloudCover,
            precipProb
        })

    } catch (err) {
        console.log('there was an error finding the forecast', err)
    }
})

// CREATE new fave location
router.post('/', async (req, res)=> {
    try {
        const newFavorite = await db.favorite.create({
            name: req.body.nickname,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            userId: req.body.userId
        })
        res.redirect(`/users/profile/${req.body.userId}`)
    } catch (err) {
        console.log('error adding to list of favorites ', err)
    }
})

// READ edit page
router.get('/edit/:id', async (req, res)=> {
    try {
        const foundFaves = await db.favorite.findAll({
            where: {id: req.params.id}
        })
        res.render('favorites/edit.ejs', {foundFaves})
    } catch (err) {
        console.log('error loading edit favorites form')
    }
})

// EDIT favorite
router.put('/:id', async (req, res)=> {
    try {
        const foundFaveEdit = await db.favorite.findOne({
            where: {id: req.params.id}
        })
        await foundFaveEdit.update({
            name: req.body.nickname,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        })
        await foundFaveEdit.save();
        res.redirect(`/users/profile/${req.body.userId}`)
    } catch (err) {
        console.log('error editing the favorite', err)
    }
})

router.delete('/:id', async (req, res)=> {
    try {
        const foundFaveDelete = await db.favorite.findOne({
            where: {id: req.params.id}
        })
        await foundFaveDelete.destroy();
        res.redirect(`/users/profile/${req.body.userId}`)
    } catch (err) {
        console.log('error deleting from favorites list', err)
    }
})

module.exports = router