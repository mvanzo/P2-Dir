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

router.get('/new', async (req, res)=> {
    try {
        res.render('favorites/new.ejs')
    } catch (err) {
        console.log('there was an error finding favorites page', err)
    }
})

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

module.exports = router