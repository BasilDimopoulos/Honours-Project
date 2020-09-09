const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require("../index.js");
const fs = require("fs");
const path = require("path");

chai.use(chaiHttp);
chai.should();

describe('Population Simulation: Web Access Test', () => {
    
    describe("GET /popsim", () => {
        it("Should send valid response", (done) => {
            chai.request(app)
                .get("/popsim")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it("Should return correct html file", (done) => {
            chai.request(app)
                .get("/popsim")
                .end((err, res) => {
                    res.should.have.status(200);                    
                    var testfile = fs.readFileSync(path.resolve(__dirname + "/../pages/popsim2.html"), "utf8");
                    if(testfile === res.text){
                        done();
                    } else {
                        done("Incorrect File Returned");
                    }
                });
        });
    });

    describe("POST /popsim", () => {
        it("Should send valid response", (done) => {
            chai.request(app)
                .post("/popsim")
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({duration: '4'})
                .end(function(err, res){
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });

        it("Should return image location html code", (done) => {
            chai.request(app)
                .post("/popsim")
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({duration: '4'})
                .end(function(err, res){
                    if (err && "<img src=/graphs/image.png width=80%>" == req.text) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });

    });
});
