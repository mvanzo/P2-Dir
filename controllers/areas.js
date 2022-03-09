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
                
        // description
        let dayDescription = await (findWeather.data.description)

        // OBJECT TO PULL DATA FROM
        let hourlyWeather = await findWeather.data.days[0].hours
        
        // hours array for x-axis of all charts
        let hours = await (hourlyWeather).map(el=> {return el.datetime.substring(0,5)})
        
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
            location: backcountryLocation.name,

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
            location: backcountryLocation.name,
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

module.exports = router