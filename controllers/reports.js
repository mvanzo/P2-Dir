const express = require('express')
const router = express.Router()
const db = require('../models')     // link to database
const axios = require('axios')      // prob don't need this
require('dotenv').config()      // prob don't need this

router.get('/', (req, res)=> {
    res.send('testing reports controller')
})

// POST new trip report
router.post('/', async (req, res)=> {
    if (req.cookies.userId) {
        try {
            // res.send(`user is logged in and their report states ${req.body.report} the areaId is ${req.body.areaId} and the userId is ${req.body.userId}`)
            const newReport = await db.report.create({
                report: req.body.report,
                userId: req.body.userId,
                areaId: req.body.areaId
            })
            res.redirect('/')
        } catch (err) {
            console.log('there is an error with report creation', err)
        }
    } else {
        console.log('/users.login.ejs')
    }
})

module.exports = router