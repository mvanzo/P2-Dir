const express = require('express')
const router = express.Router()
const db = require('../models')     // link to database
const axios = require('axios')
const { append } = require('express/lib/response')
require('dotenv').config()

router.get('/', (req, res)=> {
    res.render('./areas/index.ejs')
})

// READ current weather
router.get('/:id/current', async (req, res)=>{
    try {
        const backcountryLocation = await db.area.findOne({
            where: {id: req.params.id}
        })
        let findWeather = await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${backcountryLocation.latitude}%2C${backcountryLocation.longitude}?unitGroup=us&key=${process.env.WEATHER_API_KEY}&contentType=json`)             
        // res.json(findWeather.data.currentConditions)    
        res.render('./areas/currentweather.ejs', {
            location: backcountryLocation.name,

            // CURRENT CONDITIONS
            currentConditions: findWeather.data.currentConditions.conditions,
            currentTemp: findWeather.data.currentConditions.temp,
            currentFeelsLike: findWeather.data.currentConditions.feelslike,
            currentWindSpeed: findWeather.data.currentConditions.windspeed,
            currentWindDir: findWeather.data.currentConditions.winddir,
            currentVisibility: findWeather.data.currentConditions.visbility,
            currentCloudCover: findWeather.data.currentConditions.cloudcover,
            currentSolarRadiation: findWeather.data.currentConditions.solarradiation,
            currentSolarEnergy: findWeather.data.currentConditions.solarenergy,
            currentUvIndex: findWeather.data.currentConditions.uvindex,

            // TODAY
            todayDescription: findWeather.data.days[0].description,
            todayPrecipProb: findWeather.data.days[0].precipprob,
            todayTempMax: findWeather.data.days[0].tempmax,
            todayTempMin: findWeather.data.days[0].tempmin,
            currentPrecipType: findWeather.data.days[0].preciptype,   // this is an array
            
            // SNOWPACK
            snowDepth: findWeather.data.days[0].snowdepth,

            // ALERTS
        })

    } catch (err) {
        console.log('error finding the weather', err)
    }
})

// READ forecast
router.get('/:id/forecast', async (req, res)=> {
    try {
        const backcountryLocation = await db.area.findOne({
            where: {id: req.params.id}
        })
        // ajax weather forecast
        let forecastUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${backcountryLocation.latitude}%2C${backcountryLocation.longitude}/next7days?unitGroup=us&key=${process.env.WEATHER_API_KEY}&contentType=json`
        let findWeather = await axios.get(forecastUrl)
        
        let dates = (findWeather.data.days).map(el=> {return el.datetime})
        let highTemps = (findWeather.data.days).map(el=> {return el.tempmax}) 
        // let lowTemps = (findWeather.data.days).map(el=> {return el.tempmin})

        res.render('./areas/forecast.ejs', {
            location: backcountryLocation.name,
            forecastDescription: findWeather.data.description,
            forecastDays: findWeather.data.days,
            dates,
            highTemps,
            // lowTemps
        })

    } catch (err) {
        console.log('there was an error finding the forecast', err)
    }
})





module.exports = router