const express = require('express')                      // import express
const ejsLayouts = require('express-ejs-layouts')       // import ejs layouts
const cookieParser = require('cookie-parser')
const cryptoJS = require('crypto-js')
const db = require('./models/index.js')

require('dotenv').config()                              // allows us to access .env variables

const app = express()                                   // create an express instance
const PORT = process.env.PORT || 8000                   // allows us to access a 

// MIDDLEWARE
app.set('view engine', 'ejs')                           // set the view engine to ejs
app.use(ejsLayouts)                                     // tells express we want to use layouts
app.use(cookieParser())                                 // gives us access to req.cookies
app.use(express.urlencoded({ extended: false }))        // body parser to make req.body work

// CUSTOM LOGIN MIDDLEWARE
app.use(async (req, res, next)=>{
    if (req.cookies.userId) {
        // decrypting the incoming user ID from the cookie
        const decryptedId = cryptoJS.AES.decrypt(req.cookies.userId, process.env.SECRET)
        // converting the decrypted ID into a readable string
        const decryptedIdString = decryptedId.toString(cryptoJS.enc.Utf8)    // tells what characters to decrypt into
        // querying the db for the user with that id
        const user = await db.user.findByPk(decryptedIdString)
        // assigning the found user to res.locals.user in the routes and the user in the ejs
        res.locals.user = user                          // makes the variable user universally available
    } else {
        res.locals.user = null
    }
    // move onto the next middleware
    next()
})

// CONTROLLER middleware
app.use('/users', require('./controllers/users.js'))
app.use('/areas', require('./controllers/areas.js'))
app.use('/reports', require('./controllers/reports.js'))

app.get('/', async (req, res)=>{
    // pull all from areas table to be rendered on home page
    try {
        const allAreas = await db.area.findAll()
        res.render('home.ejs', { allAreas })
    } catch (err) {
        console.log('there was a stinking error', err)
    }
})

app.listen(PORT, () => {
    console.log('...listening on', PORT );
  });