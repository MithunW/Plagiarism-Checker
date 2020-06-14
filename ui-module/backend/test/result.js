process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Result = require('../models/result.model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        Result.remove({}, (err) => { 
           done();           
        });        
    });
/*
  * Test the /GET route
  */
  describe('/GET user', () => {
      it('it should GET all the users', (done) => {
        chai.request(server)
            .get('/results')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  /*
  * Test the /POST route
  */
 describe('/POST result', () => {
  it('it should not POST a result without userId field', (done) => {
      let result = {
        files : ['file1.pdf', 'file2.pdf'],
        checktype : 'compare',
        similarity : 4.85
      }
    chai.request(server)
        .post('/results/add')
        .send(result)
        .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('String');
              res.body.should.eql('Error: ValidationError: userId: Path `userId` is required.');
              // res.body.errors.should.have.property('pages');
              // res.body.errors.pages.should.have.property('kind').eql('required');
          done();
        });
  });

});

});
