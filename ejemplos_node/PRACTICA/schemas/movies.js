const { default: z } = require('zod')

const movieSchema = z.object({
        title: z.string({
            Invalid_type_error: 'Movie title must be a string',
            required_error: 'Movie title is required'
        }),
        year: z.number().int().min(1900).max(2026),
        director: z.string(),
        duration: z.number().int().positive(),
        poster: z.string().url(),
        rate: z.number().min(0).max(10).optional(),
        genre: z.array(z.enum(['Action','Comedy','Drama','Horror','Romance','Sci-Fi','Documentary']),
    {
        invalid_type_error:'Genre must be an array of strings',
        required_error:'Genre is required'
    })
    })

    function ValidateMovie(object){
        return movieSchema.safeParse(object)
    }

    function validatePartialMovie(object){
        return movieSchema.partial().safeParse(object)
        
    }

    module.exports={ValidateMovie, validatePartialMovie}