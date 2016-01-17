var express = require('express');
var Room = require('../services/room');
var router = express.Router();

//create new room
router.post('/RegNewRoom', function(req, res) {
  Room.createRoom(req.body).then(function(room) {
    res.status(201).json(room);
  }, function(err) {
    res.status(400).json(err);
  });
});

//update room (currently unused)
router.put('/Room/:details', function(req, res) {
  var details = new Buffer(req.params.details, 'base64').toString('ascii').split(':');

  //details[0] = room name
  //details[1] = admin password
  Room.authenticateRoomAsAdmin(details[0], details[1]).then(function(room) {
    Room.updateRoom(details[0], req.body).then(function(room) {
      res.status(201).json(room);
    });
  }).catch(function(err) {
    res.status(400).json(err);
  });
});

//delete room (currently unused)
router.delete('/Room/:details', function(req, res) {
  var details = new Buffer(req.params.details, 'base64').toString('ascii').split(':');

  //details[0] = room name
  //details[1] = admin password
  Room.authenticateRoomAsAdmin(details[0], details[1]).then(function(room) {
    Room.removeRoom(req.body.name).then(function(room) {
      if(room == null)
        res.status(401).json({msg:'Error'});
      else
        res.status(200).json({});
    })
  }).catch(function(err) {
      res.status(400).json(err);
  });
});

//login to room
router.get('/EnterRoom/:details', function(req, res) {
  var details = new Buffer(req.params.details, 'base64').toString('ascii').split(':');

  //details[0] = room name
  //details[1] = room password
  Room.authenticateRoom(details[0], details[1]).then(function(room) {
    if(room == null)
      res.status(401).json({msg:'Not found'});
    else
      res.status(200).json(room);
  }, function(err) {
    res.status(400).json(err);
  });
});

//login to room as admin
router.get('/EnterRoomAdmin/:details', function(req, res) {
  var details = new Buffer(req.params.details, 'base64').toString('ascii').split(':');
  
  //details[0] = room name
  //details[1] = admin password  
  Room.authenticateRoomAsAdmin(details[0], details[1]).then(function(room) {
    if(room == null)
      res.status(401).json({msg: 'Not found'});
    else
      res.status(200).json(room);
  }, function(err) {
    res.status(400).json(err);
  });
})

module.exports = router;
