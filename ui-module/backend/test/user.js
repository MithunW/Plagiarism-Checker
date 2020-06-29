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
        let user = {
          userId: "J.R.R. Tolkien",
          username: "tolkien",
          email: "tolkien@email.com"
        }
      chai.request(server)
          .post('/users/add')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('String');
                res.body.should.eql("User already exits in db!");
            done();
          });
    });

});

describe('/POST user', () => {
  it('it should not POST a user without email field', (done) => {
    let user = {
      userId: "J.R.R. T",
      username: "tolkien",
    }
    chai.request(server)
        .post('/users/add')
        .send(user)
        .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('String');
              res.body.should.eql('Error: ValidationError: email: Path `email` is required.');
          done();
        });
  });

});

describe('/POST user', () => {
  it('it should not POST a user without userId field', (done) => {
    let user = {
      username: "tolkien",
      email: "tolkien@email.com"
    }
    chai.request(server)
        .post('/users/add')
        .send(user)
        .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('String');
              res.body.should.eql('Error: ValidationError: userId: Path `userId` is required.');
          done();
        });
  });

});

describe('/POST user', () => {
  it('it should not POST a user without username field', (done) => {
    let user = {
      userId: "J.R.R. Tolkien",
      email: "tolkien@email.com"
    }
    chai.request(server)
        .post('/users/add')
        .send(user)
        .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('String');
              res.body.should.eql('Error: ValidationError: username: Path `username` is required.');
          done();
        });
  });

});