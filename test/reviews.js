process.env.NODE_ENV = 'test';

var app = require('../app.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
var request = require('supertest');

var should = chai.should();

chai.use(chaiHttp);

describe("Reviews", () => {
    var reviewId = "";

    it("successfully creates a review", (done) => {
        request(app).post("/api/reviews/test")
            .send({
                "stars": 4,
                "review": "This is a test review"
            })
            .expect(function (res) {
                res.body.should.contain.property("success");
                reviewId = res.body._id;
            })
            .expect(201, done);

    });

    it("fails to creates a review", (done) => {
        request(app).post("/api/reviews/test")
            .send({
                "review": "This is a test review"
            })
            .expect(function (res) {
                res.body.should.contain.property("error");
            })
            .expect(400, done);
    });

    it("can get review by ID", (done) => {
        request(app).get("/api/reviews/id/" + reviewId)
            .expect(function (res) {
                res.body.should.have.lengthOf(1);
            })
            .expect(200, done);
    });

    it("can get all reviews", (done) => {
        request(app).get("/api/reviews/")
            .expect(function (res) {
                res.body.should.have.lengthOf(1);
            })
            .expect(200, done);
    });

    it("can get review by username", (done) => {
        request(app).get("/api/reviews/test")
            .expect(function (res) {
                res.body.should.have.lengthOf(1);
            })
            .expect(200, done);
    });

    it("can get review by username", (done) => {
        request(app).delete("/api/reviews/id/" + reviewId)
            .expect(function (res) {
                res.body.should.contain.property("status");
            })
            .expect(200, done);
    });

});