const express = require('express')
const { route } = require('express/lib/application')
const router = express.Router()
const db = require('../models')     // link to database
require('dotenv').config()

router.get('/', (req, res)=> {
    res.render('./areas/index.ejs')
})

router.get('/:id', async (req, res)=> {
    try {
        const backcountryLocation = await db.area.findOne({
            where: {id: req.params.id}
        })

        res.render('./areas/index.ejs', {backcountryLocation})
    } catch (err) {
        console.log('error finding the right ski area', err)
    }

})

module.exports = router