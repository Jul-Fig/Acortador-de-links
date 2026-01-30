function validateUrl(req,res,next){
    const {url}= req.body

    if(!url){
        re.status(400).json({error:'URL is required'})
    }

   if(typeof url !=='string' || utl.trim().length ===0){
    res.status(400).json({error:'URL must be a non-empty string'})
   }

   const urlPattern =/^https?:\/\/.+\..+/

   if (!urlPattern.test(url)){
    return res.status(400).json({error:'Invalid URL format'})
   }
   if(url.length>2048){
    return res.status(400).json({error:'URL is too long'})
   }

   next()
}

function validateShortCode(req,res,next){
    const {shortCode} = req.params
    if(!shortCode){
        return res.status(400).json({error:'Short code is required'})

    }
    if(!/^[a-zA-Z0-9]+$/.test(shortCode)){
        res.status(400).json({error:'Invalid short code format'})
    }
    next()
}
module.exports={validateUrl,validateShortCode}
