//create schema and model for dishes collection which stores documents for each dish
const mongoose = require('mongoose');
const Schema =mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency; 

//working with subdocument in database
const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
},{
    timestamps: true
})


const dishSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    image: {
       type: String,
       required: true
    },
    category: {
        type: String,
        required: true
     },
     label: {
        type: String,
        default: ''
     },
     price: {
         type: Currency,
         required: true,
         min: 0
     },
     featured: {
         type: Boolean,
         default: false
     },
     description:{
        type: String,
        required: true
     },
    comments: [ commentSchema ]   //array of comment documents
},{
    timestamps: true
});

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;