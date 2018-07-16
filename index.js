var prompt = require('prompt'),
    Promise = require('bluebird'),
    functions = require('./lib/functions.js');

//
// Start the prompt
//
prompt.start();

var count = 0;

async function validate() {
    await ask()
    validate();
}

function ask() {
    return new Promise(function(resolve, reject) {
        console.log("Please, select the functionality to execute:")
        console.log("1: Choose drink");
        console.log("2: Refill wallet");
        console.log("3: Refill drinks");
        console.log("4: Check all stocks machine")
        console.log("0: exit");

        prompt.get(['option'], function(err, result) {

            switch (result.option) {
                case "1":
                    prompt.get(['drink', 'coinsInput'], function(err, result) {
                        var selected = result.drink,
                            paid = result.coinsInput;

                        functions.drinkAndChange(selected, paid).then(function(res) {
                            console.log(res)
                            resolve();
                        }).catch(function(err) {
                            console.log("App has found an error. ", err)
                        });
                    })
                    break;
                case "2":
                    console.log("Please insert the coin and then the quantity:")
                    prompt.get(['coin', 'quantity'], function(err, result) {
                        var fillwallet = functions.fillWallet(result.coin, result.quantity);
                        console.log(fillwallet);
                        resolve();
                    })
                    break;
                case "3":

                    console.log("Please, select task")
                    console.log("1: Fill drink");
                    console.log("2: Add new drink");
                    console.log("3: Empty drink (only drink is required once it erases the drink from the storage)");

                    prompt.get(['func', 'drink', 'quantity', 'price'], function(err, result) {
                        switch (result.func) {
                            case '1':
                                var fill = functions.refillDrinks(result.drink, result.quantity, false);
                                console.log(fill);
                                break;
                            case "2":
                                var add = functions.refillDrinks(result.drink, result.quantity, result.price);
                                console.log(add)
                                break;
                            case "3":
                                var empty = functions.emptyDrinks(result.drink);
                                console.log(empty)
                                break;
                            default:
                                console.log("Invalid Data.")
                                ask();
                        }
                        resolve();
                    })
                    break;
                case "4":
                    functions.fullStockCheck();
                    resolve()
                    break;
                default:
                    process.exit(0);
            }
        })
    });
}

validate();