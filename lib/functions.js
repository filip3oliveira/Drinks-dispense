'use strict'

var Promise = require('bluebird');

var machineWallet = [
    { coin: 200, stock: 9 },
    { coin: 100, stock: 10 },
    { coin: 50, stock: 10 },
    { coin: 20, stock: 10 },
    { coin: 10, stock: 0 }
];

var drinkSlot = [
    { drink: "cocacola", price: 200, stock: 10 },
    { drink: "water", price: 100, stock: 8 },
    { drink: "orangejuice", price: 250, stock: 10 },
    { drink: "beer", price: 50, stock: 10 },
    { drink: "icedtea", price: 20, stock: 10 }
];

var changeWallet = [];

function drinkAndChange(drink, coinsInput) {
    return new Promise(function(resolve, reject) {
        var paid = coinsInput.split(",")
            .map(elem => {
                return parseFloat(elem);
            });

        //validate ea coin introduced
        var paidTotal = 0;
        for (var i = 0; i < paid.length; i++) {
            var status = validateCoins(paid[i]);
            if (!status) {
                resolve("A coins that was introduced is not valid.");
                return;
            }
            paidTotal += paid[i];
        }

        var drinkApproved = drinkStock(drink);
        if (drinkApproved !== false) {

            var liveBalance = bankBalance();
            var change = changeCalc(drinkApproved.price, paidTotal);

            if (change < 0) {
                resolve("Not enough money introduced.");
                return;
            }

            if (liveBalance > change) {
                var changeFinal = change;
                var changeTotalSum = 0; // temporay sum of selected coins
                var count = 0; // interactive wallet tracker position 
                changeWallet = [];
                //for virtual porpouse
                var walletTemp = JSON.parse(JSON.stringify(machineWallet));
                makeChange(walletTemp, change, changeFinal, changeTotalSum, 0, count).then(function(changePossible) {
                    var res = "Drink droped: " + drink + '\n' + "Change: " + changeWallet;
                    if (changePossible) {
                        dropDrink(drink);
                        if (changeWallet.length === 0) {
                            res = "Drink droped: " + drink + '\n' + "No change needed.";
                        }
                    }
                    resolve(res);
                }).catch((err) => {
                    resolve("The machine cannot provide the change.", err)
                })
            }
        } else {
            resolve("The drink does not exist or does not have stock.")
        }
    });
}

function validateCoins(coin) {
    var validate = true;
    var validCoins = [200, 100, 50, 20, 10];

    if (validCoins.indexOf(coin) < 0) {
        validate = false;
    }

    return validate;

}

function bankBalance() {
    var balance = 0;

    for (var i = 0; i < machineWallet.length; i++) {
        balance += machineWallet[i].coin * machineWallet[i].stock;
    }

    return balance;
}

//check if the choosen drink is available
function drinkStock(drink) {
    var drinkInfo = {};
    for (var i = 0; i < drinkSlot.length; i++) {
        if (drinkSlot[i].drink === drink) {
            if (drinkSlot[i].stock > 0) {
                drinkInfo.drink = drink;
                drinkInfo.price = drinkSlot[i].price;
                return drinkInfo;
            }
        };
    }

    return false;
}

function changeCalc(price, paid) {
    return paid - price;
}

//calculate the change for the costumer
function makeChange(walletTemp, change, changeFinal, changeTotalSum, pos, count) {
    return new Promise(function(resolve, reject) {

        if (pos > Object.keys(walletTemp).length) {
            reject()
            return;
        }

        if (change === 0) {
            machineWallet = walletTemp.slice();
            resolve(true);
            return;
        } else if (pos === Object.keys(walletTemp).length) {
            count++;
            pos = count;
            changeWallet = [];
            changeTotalSum = 0;
            walletTemp = JSON.parse(JSON.stringify(machineWallet));

            resolve(makeChange(walletTemp, changeFinal, changeFinal, changeTotalSum, pos, count));
            return;
        }

        var coin = walletTemp[pos].coin;
        var coinStock = walletTemp[pos].stock;

        if (change >= coin && coinStock > 0) {
            //coin to change wallet
            changeWallet.push(coin);
            //decrease change left
            change -= coin;
            //add coin total
            changeTotalSum += coin;
            //coin used, wallet coins stock decreased
            walletTemp[pos].stock--;
            resolve(makeChange(walletTemp, change, changeFinal, changeTotalSum, pos, count));
        } else {
            pos++;
            resolve(makeChange(walletTemp, change, changeFinal, changeTotalSum, pos, count));
        }
    });
}

//drop drink to costumer after operation approved
function dropDrink(drink) {
    for (var i = 0; i < drinkSlot.length; i++) {
        if (drinkSlot[i].drink === drink) {
            drinkSlot[i].stock--;
        }
    }
}

// fill the machine with drinks
function refillDrinks(drinkSelected, quantity, price) {
    price = parseInt(price);
    quantity = parseInt(quantity);
    var res = "Fill the machine failed.";

    //drink stock limit
    var priceValidation = price % 10;
    var drinkExists = false;
    var slotLimit = 10;

    if (quantity > slotLimit) return "The quantity exceeds the supported.";

    //price does not end with 0
    if (price) {
        if (priceValidation !== 0) {
            return "Price is not supported by the machine change.";
        }
    }

    for (var i = 0; i < drinkSlot.length; i++) {
        if (drinkSlot[i].drink === drinkSelected) {
            //drink exists already, only increse the stock available
            drinkExists = true;

            var stockTotal = drinkSlot[i].stock + quantity;
            if (stockTotal >= slotLimit) {
                return "The quantity selected exceeds the machine capacity for each drink slot.";
            } else {
                drinkSlot[i].stock = stockTotal;
                return "Stock of " + drinkSelected + " has now " + drinkSlot[i].stock + "/10";
            }
        }
    }

    if (!drinkExists && !price) {
        return "Drink has not been available.";
    } else {
        drinkSlot.push({ drink: drinkSelected, price: parseInt(price), stock: parseInt(quantity) });
        return "New drink has been added to the machine.";
    }
}

// remove drinks from machine
function emptyDrinks(drinkSelected) {
    var drinkExists = false;
    for (var i = 0; i < drinkSlot.length; i++) {
        if (drinkSlot[i].drink === drinkSelected) {
            drinkSlot.splice(i, 1);
            return "Drink has been empty.";
        }
    }

    return "Drink does not exist.";
}

// fill machine wallet with coins
function fillWallet(coin, quantity) {
    if (isNaN(coin) || isNaN(quantity)) {
        coin = parseInt(coin);
        quantity = parseInt(quantity);
    }

    for (var i = 0; i < machineWallet.length; i++) {
        if (machineWallet[i].coin === coin) {
            if (machineWallet[i].stock < 10 && (machineWallet[i].stock + quantity <= 10)) {
                machineWallet[i].stock = machineWallet[i].stock + quantity;
                return "Coins of " + machineWallet[i].stock + " has been increased for " + machineWallet[i].stock + "/10";
            }
        }
    }

    return "Coin selected is not valid or the stock is full";
}

function fullStockCheck() {
    console.log("Drink stock state:")
    console.log(drinkSlot)
    console.log("Coin stock state")
    console.log(machineWallet)
}

module.exports = { drinkAndChange, refillDrinks, emptyDrinks, fillWallet, fullStockCheck };