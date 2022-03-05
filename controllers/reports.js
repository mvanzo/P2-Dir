const express = require('express')
const router = express.Router()
const db = require('../models')     // link to database
const axios = require('axios')      // prob don't need this
require('dotenv').config()      // prob don't need this

router.get('/', (req, res)=> {
    res.send('testing reports controller')
})

// READ all trip reports
router.get('/:id', async (req, res)=> {
    try {
        const backcountryLocation = await db.area.findOne({
            where: {id: req.params.id},
            include: {
                model: db.report,
                include: {
                    model: db.user
                }
            },
        })
        res.render('./reports/show.ejs', {
            location: backcountryLocation.name,
            id: backcountryLocation.id,
            reports: backcountryLocation.reports
        })
    } catch (err) {
        console.log('error loading all trip reports', err)
    }
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
            res.redirect(`/reports/${req.body.areaId}`)
        } catch (err) {
            console.log('there is an error with report creation', err)
        }
    } else {
        console.log('/users.login.ejs')     // not sure why this is console.logging...
    }
})

// READ edit TR form
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
        foundReport.update({
            report: req.body.report,
            areaId: req.body.report.areaId
        })
        await foundReport.save();
        // console.log('checking TO FIND IF THIS IS WORKING', foundReport.areaId)
        res.redirect(`/areas/${foundReport.areaId}`);
    }
    catch (err) {
        console.log('error editing the trip report', err);
    }
})

// DELETE trip report
router.delete('/:id', async (req, res)=> {
    try {
        // console.log(`this is the id of the report ${req.params.id}`)
        const foundReport = await db.report.findOne({
            where: {id: req.params.id}
        })
        await foundReport.destroy();
        res.redirect(`/areas/${foundReport.areaId}`);
    } catch (err) {
        console.log('error deleting the TR', err);
    }
})

module.exports = router