process.env.NODE_ENV = 'test';

var app = require('../app.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
var request = require('supertest');

var should = chai.should();
chai.use(chaiHttp);

describe("Events", () => {
    var eventId = "";

    it("creates an event", (done) => {
        request(app).post("/api/events/")
            .send({
                "eventName": "Test event",
                "category": "sport",
                "description": "Test description",
                "venue": "Venue Name",
                "startDate": "2019-03-15T12:11:44.164Z",
                "endDate": "2019-03-20T12:11:44.164Z"
            })
            .expect(function (res) {
                res.body.should.contain.property("success");
                eventId = res.body._id;
            })
            .expect(201, done);
    });

    it("updates an event", (done) => {
        request(app).put("/api/events/" + eventId)
            .send({
                "name": "Test event updated",
                "category": "music",
                "description": "Updated test description",
                "venue": "Venue",
                "startDate": "2019-03-15T12:11:44.164Z",
                "endDate": "2019-03-20T12:11:44.164Z"
            })
            .expect(function (res) {
                res.body.should.contain.property("success");
            })
            .expect(201, done);
    });

    it("gets events", (done) => {
       request(app).get("/api/events/")
           .expect(function (res) {
               res.body.should.have.lengthOf(1);
           })
           .expect(200, done);
    });

    it("gets event details", (done) => {
        request(app).get("/api/events/" + eventId)
            .expect(function (res) {
                res.body.should.have.lengthOf(1);
            })
            .expect(200, done);
    });

    it("can search events", (done) => {
        request(app).get("/api/events/search?q=test&category=music")
            .expect(function (res) {
                res.body.should.have.lengthOf(1);
            })
            .expect(200, done);
    });

    it("can delete events", (done) => {
        request(app).delete("/api/events/" + eventId)
            .expect(function (res) {
                res.body.should.contain.property("success");
            })
            .expect(200, done);
    })

});