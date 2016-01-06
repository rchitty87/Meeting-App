var Room = require('../models/room');
var q = require('q');

exports.findRoom = function(id) {
  return q(Room.findOne({ 'id': id }).exec());
}

exports.createRoom = function(room) {
  return q(Room.create(room));
}

exports.authenticateRoom = function(name, passwd) {
  return q(Room.findOne({ 'name': name, 'password': passwd }, { id: 1 }).exec());
}

exports.authenticateRoomAsAdmin = function(name, adminPasswd) {
  return q(Room.findOne({ 'name': name, 'adminPassword': adminPasswd }, { id: 1 }).exec());
}

exports.updateRoom = function(name, room) {
  return q(Room.findOneAndUpdate({ 'name': name }, room, { new: true }));
}

exports.removeRoom = function(name) {
  return q(Room.findOneAndRemove({ 'name': name }));
}
