const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) =>{
//    res.end('Will send all the leaders to you');
        Leaders.find({})
        .then((leaders) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leaders);
        },(err) => next(err))
        .catch((err) => next(err));
})
.post((req,res,next) =>{
//    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
        Leaders.create(req.body)
        .then((leader) => {
        console.log('leader created succesfully ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
        },(err) => next(err))
        .catch((err) => next(err));
})
.put((req,res,next) =>{
  res.statusCode = 403;
  res.end('PUT operation not supported on /leaders');
})
.delete((req,res,next)=>{
//   res.end('Deleting all the leaders');  //dangerous operations
        Leaders.remove({})
        .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
        },(err) => next(err))
        .catch((err) => next(err));
});

leaderRouter.route('/:leaderId')
.get((req,res,next) =>{
    // res.end('Will send the details of the leader ' + req.params.leaderId + ' to you');
     Leaders.findById(req.params.leaderId)
        .then((leader) => {
        console.log('promotion found succesfully ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    },(err) => next(err))
    .catch(err => next(err));
})
.post((req,res,next) =>{
    res.statusCode = 403;
    res.end('post operation not supported on /leaders/'+req.params.leaderId);
})
.put((req,res,next) =>{
    // res.write('updating the leader with: '+ req.params.leaderId + '\n')
    // res.end('will update the leader: '+req.body.name+ ' with details: '+req.body.description)
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    },{
        new: true
    })
    .then((leader) => {
        console.log('leader updated succesfully ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next)=>{
    // res.end('Deleting the leader: '+req.params.leaderId);
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
     }, (err) => next(err))
     .catch((err) => next(err));
});




module.exports = leaderRouter;