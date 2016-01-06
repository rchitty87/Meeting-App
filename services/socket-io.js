var socket_io = require('socket.io');
var Room = require('../services/room');

var activeRooms = {};
var people = {};

var socketHandler = function(socket) {
  socket.on('join', function(data) {
      console.log('person joined');
      people[socket.id] = { personName: data.personName, roomId: data.roomId, inRoom: false, isAdmin: false, timeStamp: new Date().getTime() };
      socket.emit('joined', {});
  });

  socket.on('joinRoomAdmin', function(roomId) {
    Room.findRoom(roomId).then(function(room) {
      if(room == null)
        socket.emit('error', {});
      
      room.currParticipants = 1;
      room.owner = socket.id;
      room.clients = {};
      activeRooms[roomId] = room;
           
      socket.emit('enteredAdmin', {});
      socket.join(roomId);
      
      //invite waiting participants
      var sorted = people.sort(function(a, b) {
          return a.timeStamp - b.timeStamp;
      });
      
      var count = 0;
      var delta = room.maxParticipants - room.currParticipants;
      
      for(var key in sorted) {
        if(sorted[key].roomId == roomId && sorted[key].inRoom == false && count < delta) {          
          socket.to(key).emit('waitFinish', {});
          count += 1;
        }
      }      
    }).catch(function(error) {
      socket.emit('error', error);
    });
  });

  socket.on('joinRoom', function(roomId) {
    var currRoom = activeRooms[roomId];

    if(currRoom == null) {
        socket.emit('waitForAdmin', {});
        return;
    }
    else if(currRoom.currParticipants == currRoom.maxParticipants) {
        socket.emit('waitForSlot', {});
        return;
    }
        
    people[socket.id].inRoom = true;   
    currRoom.currParticipants += 1;
    currRoom.clients[socket.id] = {};
    
    socket.emit('entered', {});
    socket.join(roomId);
    
    socket.broadcast.to(people[socket.id].roomId).emit('rcvChatInfo', people[socket.id].name + ' has joined the room.'); 
  });

  socket.on('sendChatMsg', function(msg) {
    socket.broadcast.to(people[socket.id].roomId).emit('rcvChatMsg', msg);
  });
  
  socket.on('sendWhisper', function(data) {
    socket.to(data.recepient).emit('rcvWhisper', { msg: data.msg, sender: socket.id});
  });

  socket.on('leaveRoom', function(data) {  
    var roomId = people[socket.id].roomId;
    socket.leave(roomId);
    socket.broadcast.to(people[socket.id].roomId).emit('rcvChatInfo', people[socket.id].name + ' has left the room.'); 
    delete people[socket.id];
    
    //invite any waiters
    var sorted = people.sort(function(a, b) {
          return a.timeStamp - b.timeStamp;
    });
      
    var room = activeRooms[roomId];
    var count = 0;
    var delta = room.maxParticipants - room.currParticipants;
    
    for(var key in sorted) {
      if(sorted[key].roomId == roomId && sorted[key].inRoom == false && count < delta) {          
        socket.to(key).emit('waitFinish', {});
        count += 1;
      }
    }      
  });
  
  socket.on('leaveRoomAdmin', function(data) {
     var roomId = people[socket.id].roomId;
     socket.leave(roomId);
     socket.broadcast.to(people[socket.id].roomId).emit('rcvChatInfo', people[socket.id].name + ' has left the room. Room will now close.'); 
     delete people[socket.id];
     
     //kick out all clients
     socket.broadcast.to(people[socket.id].roomId).emit('kicked', {});
     delete activeRooms[roomId];
     
     //remove from people
     //inform any waiters
     for(var key in people) {
       if(people[key].roomId == roomId) {
          if(people[key].inRoom == false) 
            socket.to(key).emit('closed', {});
          delete people[key];       
       }       
     }
  });
};


exports.connectSocket = function(server) {
  var io = socket_io(server);
  console.log('binding');
  io.on('connection', socketHandler);
  return io;
}
