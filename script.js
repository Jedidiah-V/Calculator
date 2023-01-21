/* Calculator Functions */

// Only two arguments at a time for each basic function

function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
}

// One function to call them all

function operate(operator, num1, num2) {
    if (operator == "+") { 
        return add(num1, num2);
    } else if (operator == "-") {
        return subtract(num1, num2);
    } else if (operator == "*") {
        return multiply (num1, num2);
    } else if (operator == "/") {
        return divide(num1, num2);
    } else {
        return "What operator is this?";
    }
}


let numKeys = document.querySelectorAll('.number');
let opKeys = document.querySelectorAll('.operator');
let backspace = document.querySelector('#backspace');
let clearEntry = document.querySelector('#CE');
let clear = document.querySelector('#C');

let keypad = document.getElementById('keypad');
// let keyArray = ['C','CE','backspace','/','7','8','9','*','4','5','6','-','1','2','3','+','+/-','0','.','='];
let equationDisplay = document.querySelector(".display-equation");
let currentDisplay = document.querySelector(".display-current");

let currentValue = [];
let operator = '';
let num1 = 0;
let num2 = 0;
let total = 0;
let numPressed = false;
let first = true;
let newPair = true;

/* Add digits (and decimal) to currentValue if number keys are pressed */

function addNumListeners() {
    for (let i = 0; i < numKeys.length; i++) {
        numKeys[i].addEventListener('click', pushCurrentValue);
    }
}

addNumListeners();

function pushCurrentValue(e) {
    switch (e.target.id) {
        case "1":
            currentValue.push(1);
            break;
        case "2":
            currentValue.push(2);
            break;
        case "3":
            currentValue.push(3);
            break;
        case "4":
            currentValue.push(4);
            break;
        case "5":
            currentValue.push(5);
            break;
        case "6":
            currentValue.push(6);
            break;
        case "7":
            currentValue.push(7);
            break;
        case "8":
            currentValue.push(8);
            break;
        case "9":
            currentValue.push(9);
            break;
        case "0":
            currentValue.push(0);
            break;
        case ".":
            currentValue.push('.');
            break;
        default:
            currentValue = "?";
    }
    numPressed = true;
    // Update the display's "current" row with the number in progress
    currentDisplay.textContent = currentValue.join(''); 
    // Activate the opKeys
    addOpKeyListeners();
};

/* Add operators to the equation if opKeys are pressed */

function addOpKeyListeners() {
    for (let i = 0; i < opKeys.length; i++) {
        opKeys[i].addEventListener('click', defineOp);
    }
}

function removeOpKeyListeners() {
    for (let i = 0; i < opKeys.length; i++) {
        opKeys[i].removeEventListener('click', defineOp);
    }
}

function firstOp(first, op) {
    if (first == true) {
        operator = op;
    }
    return operator;
}

function defineOp(e) {
    switch (e.target.id) {
        case "+":
            operator = firstOp(first, "+");
            executeOp(operator);
            operator = "+"
            break;
        case "-":
            operator = firstOp(first, "-");
            executeOp(operator);
            operator = "-"
            break;
        case "*":
            operator = firstOp(first, "*");
            executeOp(operator);
            operator = "*"
            break;
        case "/":
            operator = firstOp(first, "/");
            executeOp(operator);
            operator = "/"
            break;
        case "=":
            if (operator == '') { // If "=" is the first operator pressed, giving an identity equation
                // pastValue = currentValue;
                equationDisplay.textContent = currentValue.join('') + " =";
                currentValue = [];
            } else { // If any other operator is pressed first, then "="
                num1 = total;
                num2 = Number(currentValue.join(''));
                total = operate(operator, num1, num2);
                if (total == Infinity) {
                    currentDisplay.textContent = 'To Infinity, and Beyond!';
                }
                equationDisplay.textContent = num1 + ' ' + operator + ' ' + num2 + ' =';
                currentDisplay.textContent = total;
                num1 = total;
                num2 = Number(currentValue.join(''));
                currentValue = [];
            }
            break;
        default:
            operator = "?"
    }
    numPressed = false;
}

function executeOp(nextOp) { // If operations are being chained before pressing "="
    if (currentValue == []) { // Treat an empty current value as zero
        currentValue = [0];
    }
    if (first == true) { // Establish the first total
        total = Number(currentValue.join(''));
        equationDisplay.textContent = total + " " + nextOp;
        op = nextOp;
        first = false;
        newPair = false;
    } else {
        if (newPair == true) { // Starting a new binomial
            equationDisplay.textContent = total + " " + nextOp;
            op = nextOp;
            newPair = false;
        } else { // Completing the binomial before pressing the next operator
            num1 = total;
            num2 = Number(currentValue.join(''));
            total = operate(op, num1, num2);
            equationDisplay.textContent = num1 + " " + op + ' ' + num2;
            currentDisplay.textContent = total;
            op = nextOp;
            newPair = true;
        }
    }
    currentValue = [];
    removeOpKeyListeners();
    return op;
}

/* Add data clearing functionality */

backspace.addEventListener('click', () => {
    currentValue.pop();
    currentDisplay.textContent = currentValue.join(''); 
});

clearEntry.addEventListener('click', () => {
    currentValue = [];
    currentDisplay.textContent = currentValue.join(''); 
});

clear.addEventListener('click', () => {
    currentValue = [];
    currentDisplay.textContent = currentValue.join(''); 
    total = 0;
    num1 = 0;
    num2 = 0;
    equationDisplay.textContent = '';
    currentDisplay.textContent = '';
    operator = '';
    first = true;
    newPair = true;
    numPressed = false;
});