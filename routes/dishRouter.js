//so it's better to create REST API end points for different groups in different files, so router comes in picture for this purpose

//implementation of handling REST API end point for /dishes and /dishes/:dishId
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();  //dishRouter is an express router/mini express application/ new Router object/mountable route handler

dishRouter.use(bodyParser.json());

//we need to mount this express router in index.js file
dishRouter.route('/')
.get((req,res,next) =>{
   //all the dishes to be returned
   Dishes.find({})
     .then((dishes) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(dishes);
     }, (err) => next(err))
     .catch((err) => next(err));
})
.post((req,res,next) =>{
    Dishes.create(req.body)
      .then((dish) => {
          console.log('dish created succesfully ', dish);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err));
})
.put((req,res,next) =>{
  res.statusCode = 403;
  res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next)=>{
    Dishes.remove({})
     .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
     }, (err) => next(err))
     .catch((err) => next(err));
});

//exercise solution
dishRouter.route('/:dishId')
.get((req,res,next) =>{
    //now the modified res object will be passed down from above
    // res.end('Will send the details of the dish ' + req.params.dishId + ' to you');
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        console.log('dish found succesfully ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) =>{
    res.statusCode = 403;
    res.end('post operation not supported on /dishes/'+req.params.dishId);
})
.put((req,res,next) =>{
    // res.write('updating the dish with: '+ req.params.dishId + '\n')
    // res.end('will update the dish: '+req.body.name + ' with details: '+req.body.description)
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {
        new: true
    })
    .then((dish) => {
        console.log('dish updated succesfully ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
   
})
.delete((req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
     }, (err) => next(err))
     .catch((err) => next(err));
});

//handling comments
dishRouter.route('/:dishId/comments')
.get((req,res,next) =>{
   //all the comments to be returned
   Dishes.findById(req.params.dishId)
     .then((dish) => {
         if(dish !== null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
         }
         else{
            err = new Error('Dish '+req.params.dishId +' not found');
            err.status = 404;
            return next(err);
         }
     }, (err) => next(err))
     .catch((err) => next(err));
})
.post((req,res,next) =>{
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if(dish !== null){
            dish.comments.push(req.body);
            dish.save()
             .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
             }, (err) => next(err));
         }
         else{
            err = new Error('Dish '+req.params.dishId +' not found');
            err.status = 404;
            return next(err);
         }
      }, (err) => next(err))
      .catch((err) => next(err));
})
.put((req,res,next) =>{
  res.statusCode = 403;
  res.end('PUT operation not supported on /dishes/'+req.params.dishId+'/comments');
})
.delete((req,res,next)=>{
    Dishes.findById(req.params.dishId)
     .then((dish) => {
        if(dish !== null){
            for(var i=0; i<(dish.comments.length) ; i++){
                dish.comments.id(dish.comments[i]._id).remove();
            }
        dish.save()
            .then((dish) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(dish);
            })
        }

        else{
            err = new Error('Dish '+req.params.dishId +' not found');
            err.status = 404;
            return next(err);
         }
     }, (err) => next(err))
     .catch((err) => next(err));
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish !== null && dish.comments.id(req.params.commentId) !== null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
         }
         else if(dish == null){
            err = new Error('Dish '+req.params.dishId +' not found');
            err.status = 404;
            return next(err);
         }
         else{
            err = new Error('Comment '+req.params.commentId +' not found');
            err.status = 404;
            return next(err);
         }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) =>{
    res.statusCode = 403;
    res.end('post operation not supported on /dishes/'+req.params.dishId+'/comments/'+req.params.commentId);
})
.put((req,res,next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish !== null && dish.comments.id(req.params.commentId) !== null){
            //UPDATE OF A SPECIFIC COMMENT
            if(req.body.rating){
                 dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment){
                 dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
             .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
             }, (err) => next(err));
         }
         else if(dish == null){
            err = new Error('Dish '+req.params.dishId +' not found');
            err.status = 404;
            return next(err);
         }
         else{
            err = new Error('Comment '+req.params.commentId +' not found');
            err.status = 404;
            return next(err);
         }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next)=>{
    //DELETE SPECIFIC COMMENT
    Dishes.findById(req.params.dishId)
    .then((dish) => {
       if(dish !== null && dish.comments.id(req.params.commentId) !== null){
       dish.comments.id(req.params.commentId).remove();
       dish.save()
           .then((dish) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(dish);
           })
       }
       else if(dish == null){
            err = new Error('Dish '+req.params.dishId +' not found');
            err.status = 404;
            return next(err);
      }
      else{
        err = new Error('Comment '+req.params.commentId +' not found');
        err.status = 404;
        return next(err);
     }
     }, (err) => next(err))
     .catch((err) => next(err));
});


module.exports = dishRouter;