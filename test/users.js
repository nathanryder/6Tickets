process.env.NODE_ENV = 'test';

var app = require('../app.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
var request = require('supertest');

var should = chai.should();

chai.use(chaiHttp);

describe("Users", () => {

    it("successfully creates a user", (done) => {
        request(app).post("/api/users/test")
            .send({
                "password": "test",
                "firstname": "test",
                "lastname": "test",
                "emailAddress": "test@test.com",
                "phoneNo": "0000000000",
                "addressOne": "test",
                "city": "test",
                "country": "test"
            })
            .expect(function (res) {
                res.body.should.contain.property("success");
            })
            .expect(201, done);
    });

    it("doesn't allow duplicate user names", (done) => {
        request(app).post("/api/users/test")
            .send({
                "password": "test",
                "firstname": "test",
                "lastname": "test",
                "emailAddress": "test@test.com",
                "phoneNo": "0000000000",
                "addressOne": "test",
                "city": "test",
                "country": "test"
            })
            .expect(function (res) {
                res.body.should.contain.property("error");
            })
            .expect(400, done);
    });

    it ("successfully deletes a user", (done) => {

        request(app).delete("/api/users/test")
            .expect(200, done);

    });

});
