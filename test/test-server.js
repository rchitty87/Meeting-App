var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Room = require('../models/room');
var seed = require('../db/seed');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Test Endpoints', function() {
    before(function(done) {
        seed.run(function() {
            done();
        });
    });

    it('should add a new room on POST', function(done){
    	chai.request(app)
            .post('/rooms')
            .send({name: 'Test-Room-3', password: 'abcd', adminPassword: 'abcd', maxParticipants: 10})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                done();
            });
    });

    it('should edit a room on PUT', function(done){
    	chai.request(app)
          .put('/rooms/VGVzdC1Sb29tLTM6YWJjZA==')
          .send({name: 'New-Room', password: 'aaaa', adminPassword: 'aaaa', maxParticipants: 5})
          .end(function(err, res){
              should.equal(err, null);
              res.should.have.status(201);
              res.should.be.json;
              res.body.name.should.be.a('string');
              res.body.name.should.equal('New-Room');
              done();
          });
    });

    it('should delete a room on DELETE', function(done){
       chai.request(app)
           .del('/rooms/TmV3LVJvb206YWFhYQ==')
           .end(function(err, res){
              res.should.have.status(200);
              done();
           });
     });

     it('should be able enter room as User', function(done) {
       chai.request(app)
           .get('/enterRoom/VGVzdC1Sb29tLTE6MTIzNA==')
           .end(function(err, res) {
              should.equal(err, null);
              res.should.have.status(200);
              done();
           })
     });
});
