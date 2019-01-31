//var request = require('supertest');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app.js');

var should = chai.should();

chai.use(chaiHttp);

// describe('GET /', () => {
//   it("respond with hello world", (done) => {
//     chai.request(app).get("/test")
//       .end((err, res) => {
// 	res.text.should.be.eql('hello world');
//         done();
//       });
//   });
// });
