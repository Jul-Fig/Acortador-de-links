const mongoose = require('mongoose')
const urlSchema =   new mongoose.Schema({
    url:{
        type:String,
        required:[true, 'Url required'],
        trim:true,
        validate: {

            validator: function(v){
                return /^https?:\/\/.+\..+/.test(v)
        },
        message: prop =>`${prop.value} is not a valid URL`
    }
    },
    shortCode:{
       type: String,
       required:true,
       unique: true,
       trim:true,
       index:true
    },
    accessCount:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default: Date.now
    }
})

urlSchema.pre('save', function(next){
    this.set({updatedAt: Date.now()})
    next()
})

urlSchema.methods.toJSON = function(){
    const obj =this.toObject()
    obj.id = obj._id.toString()
    delete obj._id
    delete obj.__v
    return obj
}

module.exports=mongoose.model('Url', urlSchema)