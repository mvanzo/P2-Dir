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
            res.redirect(`/areas/${req.body.areaId}`)
        } catch (err) {
            console.log('there is an error with report creation', err)
        }
    } else {
        console.log('/users.login.ejs')     // not sure why this is console.logging...
    }
})

// GET edit TR form
router.get('/edit/:id', async (req, res)=> {
    const foundReports = await db.report.findAll({
        where: {id: req.params.id}
    })
    try {
        res.render('./reports/edit.ejs', {foundReports})
    }
    catch (err) {
        console.log('error finding edit page', err)
    }
})

// EDIT trip report
router.put('/:id', async (req, res)=> {
    try {
        const foundReport = await db.report.findOne({
            where: {id: req.params.id}
        })
        // console.log('THIS IS THE REPORT THAT WAS PRODUCED', foundReport.report)
        foundReport.update({
            report: req.body.report
        })
        await foundReport.save();
        res.redirect(`/areas/${req.params.id}`)
    }
    catch (err) {
        console.log('error editing the trip report', err);
    }
})

router.delete('/:id', async (req, res)=> {
    try {

    } catch (err) {
        console.log('error deleting the TR', err)
    }
})

module.exports = router