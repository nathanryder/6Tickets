process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app.js');

var should = chai.should();

chai.use(chaiHttp);

describe("Users", () => {

    it("creates a user", (done) => {
        chai.request(app).post("/api/users/test")
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
            .end((err, res) => {
                res.body.should.contain.property("success");

                done();
            });
    });

    it("doesn't allow duplicate user names", (done) => {
        chai.request(app).post("/api/users/test")
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
            .end((err, res) => {
                res.body.should.contain.property("error");

                done();
            });
    });

});