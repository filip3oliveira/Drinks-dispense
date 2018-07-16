

# Drinks dispense

### How it works!

##### Requirements
```
node.js
```

##### Install environment

First install node.js according to your OS.

PS: It was developed with 8.x version.


Go to the application folder and install all the node.js dependecies
 
```sh
npm install
```

##### Start the application

Now go to main folder and run:

```sh
node index.js
```

##### Application usage:

I've build an interactive menu for testing propose, it runs on the console, just after running the node command.

Please follows the menus to test the application. To introduce the coins, it just needs to be write as a string, each coin separator by "," without spaces;

For convention the coins are on folloing formats:

| Input Coins                |  value                       |
| -------------------------- | ---------------------------- | 
| 200                        |  2€                          |
| 100                        |  1€                          |
| 50                         |  0.50€                       |
| 20                         |  0.20€                       |
| 10                         |  0.10€                       |

The application uses in-memory storage.

For testing porpose I set some data as default: 

```javascript
var machine_wallet = [
    { coin: 200, stock: 9 },
    { coin: 100, stock: 10 },
    { coin: 50, stock: 10 },
    { coin: 20, stock: 10 },
    { coin: 10, stock: 10 }
];

var drink_slot = [
    { drink: "cocacola", price: 200, stock: 10 },
    { drink: "water", price: 100, stock: 8 },
    { drink: "orangejuice", price: 250, stock: 10 },
    { drink: "beer", price: 50, stock: 10 },
    { drink: "icedtea", price: 20, stock: 10 }
];
```

### Automated testing!

Mocha and chai have been used to develop BDD testing.

To run all the test set:
```
npm test
```