function errorHandler(err,req,res,next){
    console.error(err.stack)

    if (err.name ==='Validation'){

        const messages = Object.values(err.errors).map(e=>e.message)

        return res.status(400).json({error:messages.join(',')})
    }
    if(err.name==='CastError'){
        return res.status(400).json({error:'Invalid ID format'})
    }

    if(err.code ===11000){
        return res.status(409).json({error:'Short code already exists'})
    }

    res.status(500).json({
        error: 'Internal Server Error',

        message: process.env.NODE_ENV ==='development'? err.message:undefined
    })

}

module.exports = errorHandler