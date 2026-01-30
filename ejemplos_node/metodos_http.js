const http = require('node:http')
const dittoJSON = require('./pokemon/ditto.json')
const processRequest = (req, res)=>{
    const { method, url }=req
 switch (method) {
    case 'GET':
        switch(url){
            case '/pokemon/ditto':
                res.setHeader('Content-Type', 'application/json; charset=utf-8')
                return res.end(JSON.stringify(dittoJSON))
               }
        break;
        case '/':
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            return res.end ('pagina principal');
            console.log(err);
            
            break;
            
 case 'POST':
        switch(url) {
            case '/pokemon':
            let body =''
            
            req.on('data',chunk=>{
                body += chunk.toString()
            })

            req.on('end', ()=>{
                const data =JSON.parse(body)
                res.writeHead(201, { 'Content-Type':'application/json; charsen=utf-8'})

                data.timetamp =Date.now()
                res.end(JSON.stringify(data))
            })


            break;

    default:
        res.statusCode = 404
        res.setHeader ('Content-Type', 'text/plan; charset=utf-8')
        res.end('<h1>error 404</h1>')
        break;

    
///???
        } 
 }
}

const server = http.createServer(processRequest)

server.listen(1234, ()=>{
    console.log(`Server listening on port http://localhost:1234`);
    
})