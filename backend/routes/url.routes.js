const express = require('express')
const router = express.Router()

const UrlController = require('../controllers/url.controllers')


const {validateUrl, validateShortCode}=require('../middleware/validation.middleware')

router.post('/',validateUrl,UrlController.createShortUrl)

router.get('/:shortCode',validateShortCode,UrlController.getUrl)

router.put('/:shortCode',validateShortCode,validateUrl,UrlController.updateUrl)

router.delete('/:shortCode',validateShortCode,UrlController.deleteUrl)

router.get('/:shortCode/stats',validateShortCode,UrlController.getUrlStatus)

module.exports=router