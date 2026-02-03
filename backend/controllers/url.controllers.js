const Url = require('../models/Url.model')
const { generateShortCode }= require('../utils/shortcode.util')

class UrlController {
    async createShortUrl(req,res,next){
        try{
            const {url}=req.body
            let shortCode = generateShortCode()
            let attempts = 0
            let maxAttempts = 10
            while (attempts<maxAttempts) {
                const existingUrl = await Url.findOne({shortCode})

                if(!existingUrl) break
                shortCode = generateShortCode()

                attempts++

            }

            if(attempts === maxAttempts){
                return res.status(500).json({ error:'Could not generate unique short code'})
            }
            const newUrl = new Url({
                url,
                shortCode
            })
            await newUrl.save()
            res.status(201).json(newUrl.toJSON())
        }
        catch(error){
            next(error)
        }
    }
    async getUrl (req,res,next){
    try {
        const {shortCode}=req.params
        const url = await Url.findOneAndUpdate(
            {shortCode},
            {$inc:{accessCount:1}},
            {new:true}
        )
        if(!url){
           return res.status(404).json({error:'Short URL not found'})
        }
        res.status(200).json(url.toJSON())
    } catch (error) {
        next (error)
    }
}

    async updateUrl (req,res,next){
        try {
            const {shortCode}=req.params
            const {url}=req.body

            const updatedUrl  =await Url.findOneAndUpdate(
                {shortCode},
                {url, updatedAt:Date.now()},
                {new:true, runValidators:true}
            )

            if(!updatedUrl){
                res.status(404).json({error:'Short URL not found'})
            }
            res.status(200).json(updatedUrl.toJSON())
        } catch (error) {  
            next(error)          
        }
    }
    
    async deleteUrl (req,res,next){
        try{
            const{shortCode}=req.params
            const deletedUrl = await Url.findOneAndDelete({ shortCode }) 

            if(!deletedUrl){
                res.status(404).json({error:'Short URL not found'})
            }
            res.status(204).send()
        } catch(error){
            next (error)
        }
    }

    async getUrlStatus(req,res,next){
        try {
            const {shortCode}=req.params
            const url = await Url.findOne({shortCode})

            if(!url){
                res.status(404).json({error:'Short URL not found'})
            }
            res.status(200).json(url.toJSON())

        } catch (error) {
            
        }
        next()
    }
}
module.exports =new UrlController()