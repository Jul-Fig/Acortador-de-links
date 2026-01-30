const express = require('express');
const mongoose = require('mongoose')
const cors =require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()
const urlRoutes = require('./routes/url.routes')
const errorHandler = require('./middleware/error.middleware')
const app = express()
app.use(helmet())
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',

    credentials:true
}))

const limiter = rateLimit({
    windowMs:15 * 60 * 1000,
    max:100,
    message:'Too many requests from this IP, please try again later'
})

app.use('/api', limiter)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
mongoose.connect(
    process.env.MONGODB_URL || 'mongodb://localhost:27017/url-shortener',
)
.then(()=> console.log('mongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err))

app.use('/api/shorten', urlRoutes)
app.get('/api/health', (req,res)=>{
    res.status(200).json({
        status: 'OK',
        timestamp:new Date().toISOString()
    })
})
app.use(errorHandler)
app.use((req,res)=>{
    res.status(404).json({error:'Route not found'})
})
const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Server runnig on port http://localhost:${PORT}`); 
})

module.exports = app