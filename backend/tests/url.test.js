const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../server')
const Url = require('../models/Url.model')

jest.setTimeout(30000);

const ATLAS_CONNECTION_OPTION ={
    serverSelectionTimeoutMS:10000,
    socketTimeoutMS:45000
}

beforeAll (async () => {
    const testDbUrl = process.env.MONGODB_TEST_URL


if (!testDbUrl) {
    throw new error(
    ' MONGODB_TEST_URL no está definida.\n' +
    'Agrega tu connection string de Atlas en el archivo .env.test:\n' +
    'MONGODB_TEST_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/url-shortener-test'
    )
}

if (mongoose.connection.readyState !==0){
    await mongoose.disconnect()
}

await mongoose.connect(testDbUrl, ATLAS_CONNECTION_OPTION)
console.log(`Conectado a BD (test): ${mongoose.connection.name}`)
})

afterEach(async () => {
    await Url.deleteMany({})
    
})

afterAll(async () => {
    await Url.deleteMany({})

    await mongoose.connection.close()
    console.log ('conexión con DB Cerrada')
})


describe('POST /api/shorten - Crear URL corta', ()=>{

    it('Debe crear URl corta exitosamente', async () => {
        const urlData = {
            url: 'http://wwww.example.com/very/long/url'
        }

        const response = await request(app)
        .post('/api/shorten')
        .send(urlData)
        .expect('Content-type', /json/)
        .expect(201)

        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('url', urlData.url)
        expect(response.body).toHaveProperty('shortCode')
        expect(response.body.shortCode).toHaveLength(6)
        expect(response.body).toHaveProperty('accessCount',0)
        expect(response.body).toHaveProperty('createdAt')

        expect(response.body).not.toHaveProperty('_id')
        expect(response.body).not.toHaveProperty('__v')
    })

    it('Debe rechazar un solicitud sin URL', async () => {
        const response = await request(app)
        .post('/api/shorten')
        .send({})
        .expect('content-type',/json/)
        .expect(400)

        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('URL is required')      
    })
    it('Debe rechazar una URL formato inválido', async () => {
        const response = await request(app)
        .post('/api/shorten')
        .send({url:'Invalid-url'})
        .expect('Content-Type',/json/)
        .expect(400)

        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Invalid URL format')
    })
    it('Rechazar URL vacía', async () => {
        const response = await request(app)
        .post('/api/shorten')
        .send({ url:' ' })
        .expect('Content-Type', /json/)
        .expect(400)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('URL must be a non-empty string')
    })
    it('Rechazar URL demasiado largas', async () => {
        const longUrl = 'http://example.com/' + 'a'.repeat(2050)
        const response = await request(app)
        .post('/api/shorten')
        .send({url:longUrl})
        .expect('Content-Type',/json/)
        .expect(400)

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('URL is too long');
    })
    it('Generar diferentes codigos', async () => {
        const url1={url:'http://www.example1.com'}
        const url2={url:'http://www.example2.com'}

        const response1 = await request(app)
        .post('/api/shorten')
        .send(url1)
        .expect(201)

        const response2 = await request(app)
        .post('/api/shorten')
        .send(url2)
        .expect(201)

        expect(response1.body.shortCode).not.toBe(response2.body.shortCode)
    })
})


describe('GET api/shorten/:shortCode - Obtener URL original', () =>{
    it('Debe obtener la url orginal', async ()=>{
    const createResponse = await request(app)
        .post('/api/shorten')
        .send({url:'http://www.example.com'})
        .expect('Content-type',/json/)
        expect(201)

        const {shortCode}= createResponse.body

        const getResponse = await request(app)
        .get(`/api/shorten/${shortCode}`)
        .expect('Content-Type',/json/)
        .expect(200)


        expect(getResponse.body).toHaveProperty('url','http://www.example.com')
        expect(getResponse.body).toHaveProperty('shortCode',shortCode)
        expect(getResponse.body).toHaveProperty('accessCount',1)
    })
    
    it('Debe incrementar contador', async()=>{
        const createResponse = await request(app)
        .post('/api/shorten')
        .send({url:'http://www.example.com'})
        .expect(201)

        const {shortCode}= createResponse.body

        await request(app).get(`/api/shorten/${shortCode}`).expect(200)
        await request(app).get(`/api/shorten/${shortCode}`).expect(200)
        const thirdAccess= await request(app).get(`/api/shorten/${shortCode}`).expect(200)

        expect(thirdAccess.body.accessCount).toBe(3)
    })

    it('Debe retornar 404 si el código corto no existe', async ()=>{
        const response = await request(app)
        .get('/api/shorten/noexiste')
        .expect('Content-Type',/json/)
        .expect(404)

        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Short URL not found')
    })
    it ('Debe rechazar un código con formato inválido', async()=>{
        const response = await request(app)
        .get('/api/shorten/invalid-code!')
        .expect('Content-Type',/json/)
        .expect(400)

        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Invalid short code format')
    })
})

describe('PUT api/shorten/:shortCode - Actualizar URL', () =>{
    it('Debe actualizar la URL exitosamente', async()=>{
        const createResponse = await request(app)
        .post('/api/shorten')
        .send({url:'http://www.example.com'})
        .expect(201)

        const { shortCode } = createResponse.body

        const updateResponse = await request(app)
        .put(`/api/shorten/${shortCode}`)
        .send({ url: 'http://www.newexample.com' })
        .expect('Content-Type', /json/)
        .expect(200)

        expect(updateResponse.body).toHaveProperty('url','http://www.newexample.com')
        expect(updateResponse.body).toHaveProperty('shortCode', shortCode)

        const originalUpdatedAt = new Date(createResponse.body.updatedAt)
        const newUpdatedAt = new Date(updateResponse.body.updatedAt)
        expect(newUpdatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime())
    })

    it('Debe retornar 404 si el código no existe', async ()=>{
        const response = await request(app)
        .put('/api/shorten/noexiste')
        .send({url:'http://www.newexample.com'})
        .expect('Content-Type', /json/)
        .expect(404)


        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Short URL not found')
    })

    it('Debe rechazar actualización con URL inválida', async ()=>{
        const createResponse = await request(app)
        .post('/api/shorten')
        .send({url:'http://www.example.com'})
        .expect(201)

        const {shortCode} = createResponse.body

        const updateResponse= await request(app)
        .put(`/api/shorten/${shortCode}`)
        .send({url:'invalid-url'})
        .expect('Content-Type',/json/)
        .expect(400)

        expect(updateResponse.body).toHaveProperty('error')      
    } )

    it('Debe mantener contador de acceso al actualizar', async()=>{
        const createResponse = await request(app)
        .post('/api/shorten')
        .send({url:'http://www.example.com'})
        .expect(201)

        const{shortCode}=createResponse.body

        await request(app).get(`/api/shorten/${shortCode}`)
        await request(app).get(`/api/shorten/${shortCode}`)

        const updateResponse=await request(app)
        .put(`/api/shorten/${shortCode}`)
        .send({url: 'http://www.newexample.com'})
        .expect(200)

        expect(updateResponse.body.accessCount).toBe(2)
    })
})

describe('DELETE Api/shorten/:shorten - Eliminar URL corta', ()=>{

    it('Debe eliminar una URL exitosamente', async () => {
    
    const createResponse = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://www.example.com' })
      .expect(201);

        const {shortCode}=createResponse.body

        await request(app)
        .delete(`/api/shorten/${shortCode}`)
        .expect(204)

        await request(app)
        .get(`/api/shorten/${shortCode}`)
        .expect(404)
    })

    it('Debe retornar 404 si el código no existe', async()=>{
        const response = await request(app)
        .delete('/api/shorten/noexiste')
        .expect('Content-Type', /json/)
        .expect(404)

        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Short URL not found')
    })

    it('Debe rechazar shortCode con formato invalido ', async()=>{
        const response = await request(app)
        .delete('/api/shorten/invalid-code')
        .expect('Content-Type',/json/)
        .expect(400)

        expect(response.body).toHaveProperty('error')
    })
})

describe('GET /api/shorten:shortCode/stats -obtener estadísticas', ()=>{
    it('Obtener estadísticas sin incrementar el contador', async()=>{
        const createResponse = await request(app)
        .post('/api/shorten/')
        .send({url:'http://www.example.com'})
        .expect(201)

        const {shortCode}= createResponse.body

        const statsResponse = await request(app)
        .get(`/api/shorten/${shortCode}/stats`)
        .expect('Content-Type', /json/)
        .expect(200)

        expect(statsResponse.body).toHaveProperty('url','http://www.example.com')
        expect(statsResponse.body).toHaveProperty('accessCount',0)
        expect(statsResponse.body).toHaveProperty('createdAt')
        expect(statsResponse.body).toHaveProperty('updatedAt')

        const statsResponse2 = await request(app)
        .get(`/api/shorten/${shortCode}/stats`)
        .expect(200)
        
        expect(statsResponse2.body.accessCount).toBe(0)
    })

    it('Debe mostrar el contador correcto despues de varios accesos', async()=>{
        const createResponse = await request(app)
        .post('/api/shorten')
        .send({url:'https://www.example.com'})
        .expect(201)

        const {shortCode} = createResponse.body

        for(let i=0;i<5;i++){
            await request(app).get(`/api/shorten/${shortCode}`)
        }
        const statsResponse = await request(app)
        .get(`/api/shorten/${shortCode}/stats`)
        .expect(200)

        expect(statsResponse.body.accessCount).toBe(5)

    })

//     it('Debe retornar 404 si el codigo no existe',async()=>{

//         const response = await request(app)
//         .get('/api/shorten/noexiste')
//         .expect('Content-Type', /json/)
//         .expect(404)

//         expect(response.body).toHaveProperty('error')
//         expect(response.body.erro).toBe('Short URL not found')
//     })
// })

// describe('GET /api/shorten - Health Check',()=>{
//     it('Retornar el estado del servidor', async()=>{
//         const response = await request(app)
//         .get()
//     })
})