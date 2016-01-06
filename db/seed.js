var Room = require('../models/room');

exports.run = function(callback, errback) {
    Room.create({name: 'Test-Room-1', password: '1234', adminPassword: '1234', maxParticipants: 10},
                {name: 'Test-Room-2', password: '5678', adminPassword: '5678', maxParticipants: 2},
                function(err, rooms) {
        if (err) {
            errback(err);
            return;
        }
        callback(rooms);
    });
};

if (require.main === module) {
    require('./connect');
    exports.run(function() {
        var mongoose = require('mongoose');
        mongoose.disconnect();
    }, function(err) {
        console.error(err);
    });
}
