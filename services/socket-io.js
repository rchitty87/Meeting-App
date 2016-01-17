var socket_io = require('socket.io');
var Room = require('./room');

var activeRooms = {};
var people = {};

var socketHandler = function(socket) {
  socket.on('join', function(data) {
      people[socket.id] = { socketId: socket.id, personName: data.personName, roomId: data.roomId, inRoom: false, isAdmin: data.isAdmin, timeStamp: new Date().getTime() };
      socket.emit('joined', people[socket.id]);
  });
  
  socket.on('joinRoomAdmin', function(roomId) {
    Room.findRoom(roomId).then(function(room) {
      if(room == null)
        socket.emit('error', {});
      
      room.currParticipants = 1;
      room.owner = socket.id;
      room.clients = [];
      room.clients.push(people[socket.id]);
      activeRooms[roomId] = room;
           
      socket.emit('entered', {});
      socket.join(roomId);
      
      //invite waiting participants
      var sorted = [];
      
      for(var id in people)
        sorted.push(people[id]);
      
      sorted.sort(function(a, b) {
          return a.timeStamp - b.timeStamp;
      });
      
      var count = 0;
      var delta = room.maxParticipants - room.currParticipants;
      
      for(var id in sorted) {
        var person = people[sorted[id].socketId];
        
        if(person.roomId == roomId && person.inRoom == false && person.isAdmin == false && count < delta) {  
          socket.to(person.socketId).emit('waitFinish', {});
          count += 1;
        }
      } 
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
    
    socket.emit('entered', {});
    socket.join(roomId);
    
    //send participants list
    socket.emit('participantsList', currRoom.clients);
    
    currRoom.clients.push(people[socket.id]);
    
    socket.broadcast.to(people[socket.id].roomId).emit('rcvChatInfo', people[socket.id].personName + ' has joined the room.'); 
    socket.broadcast.to(people[socket.id].roomId).emit('newParticipant', people[socket.id]);
  });

  socket.on('sendChatMsg', function(msg) {
    var socketId = socket.id;
    var personName = people[socket.id].personName;
    
    socket.broadcast.to(people[socket.id].roomId).emit('rcvChatMsg', { socketId: socketId, personName: personName, data: msg });
  });
  
  socket.on('sendWhisper', function(data) {
    socket.to(data.recepient).emit('rcvWhisper', { msg: data.msg, sender: socket.id});
  });
  
  socket.on('disconnect', function() {
    console.log(socket.id + ' is leaving');
    
    if(people[socket.id].isAdmin == true) {
      var roomId = people[socket.id].roomId;
      socket.leave(roomId);
      socket.broadcast.to(roomId).emit('rcvChatInfo', people[socket.id].personName + ' has left the room. Room will now close.'); 
      delete people[socket.id];
      
      //kick out all clients
      socket.broadcast.to(roomId).emit('kicked', {});
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
    }
    else {
      var roomId = people[socket.id].roomId;
      socket.leave(roomId);
      socket.broadcast.to(roomId).emit('rcvChatInfo', people[socket.id].personName + ' has left the room.');
      socket.broadcast.to(roomId).emit('participantLeft', people[socket.id]); 
      delete people[socket.id];
      
      for(var i in activeRooms[roomId].clients) {
        if(activeRooms[roomId].clients[i].socketId == socket.id) {
          activeRooms[roomId].clients.splice(i, 1);
          break; 
        }         
      }
      
      //invite any waiters
      var room = activeRooms[roomId];      
      var sorted = [];
        
      for(var id in people)
        sorted.push(people[id]);
      
      sorted.sort(function(a, b) {
          return a.timeStamp - b.timeStamp;
      });
      
      var count = 0;
      var delta = room.maxParticipants - room.currParticipants;
      
      for(var id in sorted) {
        var person = people[sorted[id].socketId];
      
        if(person.roomId == roomId && person.inRoom == false && person.isAdmin == false && count < delta) {  
          socket.to(person.socketId).emit('waitFinish', {});
          count += 1;
        }
      }       
    }
  });
};

exports.connectSocket = function(server) {
  var io = socket_io(server);
  io.on('connection', socketHandler);
  return io;
}
