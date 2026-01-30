const express = require('express')
const movies = require('./movies.json')
const crypto =require ('node:crypto')
const { ValidateMovie, validatePartialMovie } = require('./schemas/movies')

const app= express()
app.use(express.json())

app.disable('x-powered-by')


app.get ('/movies',(req,res)=>{
    res.json(movies)
})
/*
app.get ('/movies/:id',(req,res)=> {
    const {id}=req.params
    const movie = movies.find(movie=>movie.id === id)
    if (movie) res.json(movie)
    res.status(404).json({error:'Movie not found'})
})
*/
app.get ('/movies/busqueda',(req,res)=>{
    const {genre} =req.query
    if (genre){
    const filterMovies = movies.filter(movie => movie.genre.some(g=>g.toLowerCase()=== genre.toLowerCase())
    )
    return res.json(filterMovies)
    }
    res.json(movies)
})

app.post('/movies',(req,res)=>{
    const result= ValidateMovie(req,res)

    if(result.error){
        return res.status(400).json({error:result.error.message})
    }
    const newMovie ={
        id: crypto.randomUUID(),
        ...result.data
       
    }
    movies.push(newMovie)
    res.status(201).json(newMovie)
})

app.patch('movies',(req,res)=>{
    const result = validatePartialMovie(req.body)

    if(!result.success){
        return res.status(404)({error:result.error.message})
    }

    const {id} = req.params

    const movieIndex = movies.findIndex(movie=>movie.id=== id)
    if (movieIndex ===-1){
        return res.status(404).json({error:'movie not found'})
    }
    const updateMovie ={
        ...movie[movieIndex],
        ...result.data
    }
    movies[movieIndex]=updateMovie
    return res.json(updateMovie)
})

const PORT= process.env.PORT ?? 1234

app.listen(PORT, ()=>{
    console.log(`Server listening on port http://localhost:${PORT}`);
    
})