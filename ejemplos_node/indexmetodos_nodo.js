const express = require('express')
const ditto =require('./pokemon/ditto.json')
const app =express()

app.disable('x-powered-by')
const PORT = process.env.PORT ?? 1234

app.use((req,res,next)=>{
   if(req.method !== 'POST')return next
   if(req.headers['content-type'] !== 'application/json')return next()
   
})

app.get('/pokemon/ditto', (req,res)=>{
    res.json(ditto)
})

app.post ('/pokemon',(req,res)=>{
    let body =''
            
            req.on('data',chunk=>{
                body += chunk.toString()
            })

            req.on('end', ()=>{
                const data =JSON.parse(body)
                 data.timetamp =Date.now()
                req.body = data
                next()
            })

})

app.use((req,res)=>{
    res.status(404).send('Not Found')
})
app.listen(PORT,()=>{
    console.log(`Server listenig on port http//localhost:${PORT}`);
    
})