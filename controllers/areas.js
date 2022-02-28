const express = require('express')
const { route } = require('express/lib/application')
const router = express.Router()
const db = require('../models')     // link to database
require('dotenv').config()

router.get('/', (req, res)=> {
    res.render('./areas/index.ejs')
})

router.get('/crystal', (req, res)=> {
    res.render('./areas/crystal.ejs')
})

module.exports = router