//so it's better to create REST API end points for different groups in different files, so router comes in picture for this purpose

//implementation of handling REST API end point for /dishes and /dishes/:dishId
const express = require('express');
const bodyParser = require('body-parser')

const dishRouter = express.Router();  //dishRouter is an express router/mini express application/ new Router object/mountable route handler

dishRouter.use(bodyParser.json());

//we need to mount this express router in index.js file
dishRouter.route('/')
.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();    //it will continue to look down for any further requests for this end point
})
.get((req,res,next) =>{
   //now the modified res object will be passed down from above
   res.end('Will send all the dishes to you');
})
.post((req,res,next) =>{
   res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req,res,next) =>{
  res.statusCode = 403;
  res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next)=>{
    res.end('Deleting all the dishes');  //dangerous operations
});

//exercise solution
dishRouter.route('/:dishId')
.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();    //it will continue to look down for any further requests for this end point
})
.get((req,res,next) =>{
    //now the modified res object will be passed down from above
    res.end('Will send the details of the dish ' + req.params.dishId + ' to you');
})
.post((req,res,next) =>{
    res.statusCode = 403;
    res.end('post operation not supported on /dishes/'+req.params.dishId);
})
.put((req,res,next) =>{
    res.write('updating the dish with: '+ req.params.dishId + '\n')
    res.end('will update the dish: '+req.body.name + ' with details: '+req.body.description)
})
.delete((req,res,next)=>{
    res.end('Deleting the dish: '+req.params.dishId);
});


module.exports = dishRouter;