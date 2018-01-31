var mocha = require('mocha');
var expect = require('chai').expect;
var app = require('./app');

describe('loading app', function (done) {
    it('should meet expectation 01', function test(done) {
        var input = [
            [1,2,3],
            [4,5,6],
            [7,8,9]
        ];
        var result = app.rotateMatrix(input);
        
        /* expect
            [
                [7,4,1],
                [8,5,2],
                [9,6,3]
            ]
        */
        console.log(result);
        expect(result[0][0]).to.equal(7);
        expect(result[0][1]).to.equal(4);
        expect(result[0][2]).to.equal(1);

        expect(result[1][0]).to.equal(8);
        expect(result[1][1]).to.equal(5);
        expect(result[1][2]).to.equal(2);

        expect(result[2][0]).to.equal(9);
        expect(result[2][1]).to.equal(6);
        expect(result[2][2]).to.equal(3);
        
        done();
    });
  
    it('should meet expectation 02', function test(done) {
        var input = [
            [ 5, 1, 9,11],
            [ 2, 4, 8,10],
            [13, 3, 6, 7],
            [15,14,12,16]
        ];
        var result = app.rotateMatrix(input);
        
        /*
            [
                [15,13, 2, 5],
                [14, 3, 4, 1],
                [12, 6, 8, 9],
                [16, 7,10,11]
            ]
        */
        console.log(result);
        expect(result[0][0]).to.equal(15);
        expect(result[0][1]).to.equal(13);
        expect(result[0][2]).to.equal(2);
        expect(result[0][3]).to.equal(5);

        expect(result[1][0]).to.equal(14);
        expect(result[1][1]).to.equal(3);
        expect(result[1][2]).to.equal(4);
        expect(result[1][3]).to.equal(1);

        expect(result[2][0]).to.equal(12);
        expect(result[2][1]).to.equal(6);
        expect(result[2][2]).to.equal(8);
        expect(result[2][3]).to.equal(9);

        expect(result[3][0]).to.equal(16);
        expect(result[3][1]).to.equal(7);
        expect(result[3][2]).to.equal(10);               
        expect(result[3][3]).to.equal(11);

        done();
    });
});