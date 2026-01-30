const http =require('node:http');
const fs = require('node:fs')
const desiredPort = process.env.PORT ?? 1234

const processRequest = (req, res)=>{
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    if (req.url=== '/'){
    fs.readFile('./IMAGEN.jpg', (err, data)=>{
        if(err){
            res.statusCode=500
            res.end('<h1>Error 500 Internal server error</h1>')
        }else{
            res.setHeader('Content-Tpy','imagen/png')
            res.end(data)
        }
    })
    }
}
const server = http.createServer(processRequest)

server.listen(desiredPort, () =>{
    console.log(`server listening on port http://localhost:${desiredPort}`);
    
})