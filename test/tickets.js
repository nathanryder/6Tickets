process.env.NODE_ENV = 'test';

var app = require('../app.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
var request = require('supertest');

var should = chai.should();
chai.use(chaiHttp);

describe("Tickets", () => {
    var ticketID = "";

    it("creates a ticket", (done) => {
        request(app).post("/api/tickets")
            .send({
                "sellerUsername": "test",
                "eventID": "0",
                "deliveryMethod": 2,
                "price": 20,
                "seatNo": "A1",
                "info": "Test"
            })
            .expect(function (res) {
                res.body.should.contain.property("success");
                ticketID = res.body._id;
            })
            .expect(201, done);
    });

    it("updates a ticket", (done) => {
        request(app).put("/api/tickets/" + ticketID)
            .send({
                "sellerUsername": "newSeller",
                "eventID": "0",
                "deliveryMethod": 2,
                "price": 50,
                "seatNo": "A1",
                "info": "Test updated"
            })
            .expect(function (res) {
                console.log(res.body);
                res.body.should.contain.property("success");
            })
            .expect(201, done);
    });

    it("gets tickets", (done) => {
        request(app).get("/api/tickets")
            .expect(function (res) {
                res.body.should.have.lengthOf(1);
            })
            .expect(200, done);
    });

    it("deletes tickets", (done) => {
       request(app).delete("/api/tickets/" + ticketID)
           .expect(function (res) {
               res.body.should.contain.property("success");
           })
           .expect(200, done);
    });

});