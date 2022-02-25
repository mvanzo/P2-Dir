const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const app = express()

const PORT = process.env.PORT || 3000

// middleware
app.set('view engine', 'ejs')
app.use(ejsLayouts)
// app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res)=>{
    
})


app.listen(`listening on port: ${PORT}`)