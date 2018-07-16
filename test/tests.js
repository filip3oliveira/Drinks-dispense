'use strict'

var expect = require('chai').expect,
    functions = require('../lib/functions.js');

describe('Buying drinks.', function() {

    context('When buying a cocacola with valid and enough coins', function() {

        it('It should be possible', function(done) {

            var expected = 'Drink droped: cocacola\nChange: 20';
            functions.drinkAndChange("cocacola", "20,50,50,20,20,50,10").then(function(res) {
                expect(res).to.be.equal(expected);
                done();
            })
        });
    }).timeout(2500)

    context('When buying a non existent drink', function() {

        it('It should not be possible', function(done) {

            var expected = 'The drink does not exist or does not have stock.';
            functions.drinkAndChange("coconut", "20,50,50").then(function(res) {
                expect(res).to.be.equal(expected);
                done();
            })
        });


    }).timeout(2500)

    context('When buying a cocacola with not enough amount', function() {

        it('It should not be possible', function(done) {

            var expected = 'Not enough money introduced.';
            functions.drinkAndChange("cocacola", "20,50,50,20").then(function(res) {
                expect(res).to.be.equal(expected);
                done();
            })
        });
    }).timeout(2500)

    context('When buying a cocacola with invalid coin', function() {

        it('It should not be possible', function(done) {

            var expected = 'A coins that was introduced is not valid.';
            functions.drinkAndChange("cocacola", "500").then(function(res) {
                expect(res).to.be.equal(expected);
                done();
            })
        });
    }).timeout(2500)

    context('When buying a cocacola and machine has not coins for change', function() {

        it('It should not be possible', function(done) {

            var expected = 'The machine cannot provide the change.';
            functions.drinkAndChange("cocacola", "50,50,50,50,10").then(function(res) {
                expect(res).to.be.equal(expected);
                done();
            })
        });
    }).timeout(2500)

    context('When buying a drink with corner change', function() {

        it('It should be possible', function(done) {

            var expected = 'Drink droped: cocacola\nChange: 20,20,20';
            functions.drinkAndChange("cocacola", "200,50,10").then(function(res) {
                expect(res).to.be.equal(expected);
                done();
            })
        });
    }).timeout(2500)

})

describe('Managing machine wallet', function() {

    context('When filling a slot with a invalid coin', function() {

        it('It should not be possible.', function(done) {

            var expected = 'Coin selected is not valid or the stock is full';
            expect(functions.fillWallet(3, 2)).to.be.equal(expected);
            done();
        });
    }).timeout(2500)

    context('When filling a slot with a valid coin without specifing quantity', function() {

        it('It should not be possible', function(done) {

            var expected = 'Coin selected is not valid or the stock is full';
            expect(functions.fillWallet("10", "")).to.be.equal(expected);
            done();
        });
    }).timeout(2500)

    context('When filling a slot with a valid coin with specifing quantity', function() {

        it('It should be possible.', function(done) {

            var expected = 'Coins of 10 has been increased for 10/10';
            expect(functions.fillWallet(200, 1)).to.be.equal(expected);
            done();
        });
    }).timeout(2500)

    context('When filling a slot with a drink instead of a coin', function() {

        it('It should not be possible.', function(done) {

            var expected = 'Coin selected is not valid or the stock is full';
            expect(functions.fillWallet("cocacola", 100)).to.be.equal(expected);
            done();
        });
    }).timeout(2500)
    
    context('Empty a non valid drink stock', function() {

        it('It should not be possible.', function(done) {

            var expected = 'Drink does not exist.';
            expect(functions.emptyDrinks("watermelonwater")).to.be.equal(expected);
            done();
        });
    }).timeout(2500)

})

describe('Managing machine drinks', function() {

    context('When filling a slot for an already existent drink without full stock', function() {

        it('It should be possible.', function(done) {

            var expected = 'Stock of water has now 9/10';
            expect(functions.refillDrinks("water", 1, false)).to.be.equal(expected);
            done();
        });
    }).timeout(2500)

    context('When filling a slot for an non existent drink', function() {

        it('It should not be possible.', function(done) {

            var expected = 'Drink has not been available.';
            expect(functions.refillDrinks(123, 1, false)).to.be.equal(expected);
            done();
        });
    }).timeout(2500)

    context('When adding a new drink to machine with quantity exceeded', function() {

        it('It should not be possible.', function(done) {

            var expected = 'The quantity exceeds the supported.';
            expect(functions.refillDrinks("redwater", "11", "200")).to.be.equal(expected);
            done();
        });
    }).timeout(2500)

    context('When adding a new drink to machine with valid options', function() {

        it('It should be possible.', function(done) {

            var expected = 'New drink has been added to the machine.';
            expect(functions.refillDrinks("redwater", "10", "200")).to.be.equal(expected);
            done();
        });
    }).timeout(2500)

    context('When adding a new drink to machine with awry price', function() {

        it('It should not be possible.', function(done) {

            var expected = 'Price is not supported by the machine change.';
            expect(functions.refillDrinks("redwater", "10", "235")).to.be.equal(expected);
            done();
        });
    }).timeout(2500)

    context('Empty a valid drink stock', function() {

        it('It should be possible.', function(done) {

            var expected = 'Drink has been empty.';
            expect(functions.emptyDrinks("cocacola")).to.be.equal(expected);
            done();
        });
    }).timeout(2500)
})