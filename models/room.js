var mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({
    name: { type: String, require: true },
    password: { type: String, require: true },
    adminPassword: { type: String, require: true },
    maxParticipants: { type: Number, require: true }
});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
