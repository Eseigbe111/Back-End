// Using the exports object alone
// When we are using the exports, we can ppts to the export object:
exports.add = (a, b) => a + b;
exports.multiply = (a, b) => a * b;
exports.divide = (a, b) => a / b;

// When we import this module in the other side, we will get basically access to this exports object.
