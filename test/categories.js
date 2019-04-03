process.env.NODE_ENV = 'test';

var app = require('../app.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
var request = require('supertest');

var should = chai.should();

chai.use(chaiHttp);

describe("Categories", () => {
    var categoryID = "";

    it("creates a category", (done) => {
        request(app).post("/api/categories/")
            .send({
                "name": "Test category"
            })
            .expect(function (res) {
                res.body.should.contain.property("success");
                categoryID = res.body._id;
            })
            .expect(201, done);
    });

    it("edits a category", (done) => {
        request(app).put("/api/categories/" + categoryID)
            .send({
                "newName": "Updated test category"
            })
            .expect(function (res) {
                res.body.should.contain.property("success")
            })
            .expect(201, done);
    });

    it("gets categories", (done) => {
        request(app).get("/api/categories")
            .expect(function (res) {
                res.body.should.have.lengthOf(1);
                console.log("Name: " + res.body[0].name);
                res.body[0].name.should.equal("Updated test category");
            })
            .expect(200, done);
    });

    it("deletes categories", (done) => {
        request(app).delete("/api/categories/" + categoryID)
            .expect(function (res) {
                res.body.should.contain.property("success")
            })
            .expect(200, done);
    })

});