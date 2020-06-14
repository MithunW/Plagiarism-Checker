process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/user.model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


describe('/POST user', () => {
    it('it should not POST an user without unique details.', (done) => {
        let book = {
          userId: "J.R.R. Tolkien",
          username: "tolkien",
          email: "tolkien@email.com"
        }
      chai.request(server)
          .post('/users/add')
          .send(book)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('String');
                res.body.should.eql("User already exits in db!");
            done();
          });
    });

});