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
    } else if (operator == '=') {
    } else {
        return "What operator is this?";
    }
}

let numKeys = document.querySelectorAll('.number');
let opKeys = document.querySelectorAll('.operator');
let modifiers = document.querySelectorAll('.modifier');
let backspace = document.querySelector('#backspace');
let clear = document.querySelector('#clear');

let keypad = document.getElementById('keypad');
let equationDisplay = document.querySelector(".display-equation");
let resultDisplay = document.querySelector(".display-result");

let equation = [];
let currentValue = [];
let operator = '';
let num1 = 0;
let num2 = 0;
let total = 0;
let percent = false;
let firstNum = true;
let neg = false;
let equaled = false;
let maxDigits = 14;

/* Add digits (and decimal) to currentValue if number keys are pressed */

function addNumListeners() {
    for (let i = 0; i < numKeys.length; i++) {
        numKeys[i].addEventListener('click', pushCurrentValue);
    }
}

function removeNumListeners() {
    for (let i = 0; i < numKeys.length; i++) {
        numKeys[i].removeEventListener('click', pushCurrentValue);
    }
}

function iterateCurrent(string) {
    digit = Number(string);
    currentValue.push(digit); 
    if (currentValue.length == maxDigits) {
        removeNumListeners();
    }
    resultDisplay.textContent = currentValue.join('');
}

addNumListeners();

function pushCurrentValue(e) {
    switch (e.target.id) {
        case "1":
            iterateCurrent("1");
            break;
        case "2":
            iterateCurrent("2");
            break;
        case "3":
            iterateCurrent("3");
            break;
        case "4":
            iterateCurrent("4");
            break;
        case "5":
            iterateCurrent("5");
            break;
        case "6":
            iterateCurrent("6");
            break;
        case "7":
            iterateCurrent("7");
            break;
        case "8":
            iterateCurrent("8");
            break;
        case "9":
            iterateCurrent("9");
            break;
        case "0":
            iterateCurrent("0");
            break;
        default:
            currentValue = "?";
            resultDisplay.textContent = currentValue.join('');
    }
    addOpKeyListeners();
};

/* Add modifiers that affect currentValue if pressed */

function addModListeners() {
    for (let i = 0; i < modifiers.length; i++) {
        modifiers[i].addEventListener('click', modify);
    }
}

addModListeners();

function modify(e) {
    switch (e.target.id) {
    case ".":
        if (currentValue != []) {
            currentValue.push("."); 
            resultDisplay.textContent = currentValue.join('');
            modifiers[2].removeEventListener('click', modify);
        }
        break;
    case "+/-":
        if (neg == false) {
            currentValue.unshift("-");
            resultDisplay.textContent = currentValue.join('');
            neg = true;
        } else {
            currentValue.shift();
            resultDisplay.textContent = currentValue.join('');
            neg = false;
        }
        break;
    case "%": 
        if (percent == false) {
            resultDisplay.textContent = currentValue.join('') + '%';
            currentValue = currentValue.join('')/100;
            currentValue = String(currentValue).split('');
            percent = true;
        } else if (percent == true) {
            currentValue = Math.round(currentValue.join('')*1000000)/10000;
            currentValue = String(currentValue).split('');
            resultDisplay.textContent = currentValue.join('');
            percent = false;
        }
        break;
    }
}

/* Add operators to the equation if opKeys are pressed */

function addOpKeyListeners() {
    for (let i = 0; i < opKeys.length; i++) {
        opKeys[i].addEventListener('click', defineOp);
    }
}

addOpKeyListeners();

function removeOpKeyListeners() {
    for (let i = 0; i < opKeys.length; i++) {
        opKeys[i].removeEventListener('click', defineOp);
    }
}

function iterateEquation(num1, op) {
    operator = op;
    equation = [];
    if (percent == true) {
        // Keeps the displayed digits within limits
        if (currentValue.length >= maxDigits) { 
            equation.push((num1*100).toExponential(2) + '%');
        } else  {
            equation.push(num1*100 + '%');
        }
    } else {
        equation.push(Math.round(num1*10000)/10000);
    }
    equation.push(operator);
    equationDisplay.textContent = equation.join(' ');
    resultDisplay.textContent = '';
    currentValue = [];
}

function executeOp(op) {    
    if (firstNum == true) { 
        // Establishes the first total and start the equation
        modifiers[2].addEventListener('click', modify);
        num1 = Number(currentValue.join(''));
        total = num1;
        iterateEquation(num1, op);
        firstNum = false;
    } else if (equaled == true) {
        // If the previous operation was an equals sign
        modifiers[2].addEventListener('click', modify);
        num1 = total;
        iterateEquation(num1, op);
        equaled = false;
    } else { 
        // Inputs second term and iterates the total if another operator is pressed
        modifiers[2].addEventListener('click', modify);
        num1 = total;
        num2 = Math.round(Number(currentValue.join(''))*10000)/10000;
        total = operate(operator, num1, num2);
        num1 = total;
        iterateEquation(num1, op);
        if (total == Infinity) {
            resultDisplay.textContent = 'To Infinity, and Beyond!';
        }
    }
    addNumListeners();
}

function limitDigits(currentValue) {
    // Keeps the displayed digits within limits
    if (currentValue.length >= maxDigits) { 
        resultDisplay.textContent = total.toExponential(2);
    } else  {
        resultDisplay.textContent = Math.round(total*10000)/10000;
    }
}
function defineOp(e) {
    // Treats an empty current value as not being ready to proceed
    if (currentValue != []) { 
        switch (e.target.id) {
            case "+":
                executeOp("+");
                break;
            case "-":
                executeOp("-");
                break;
            case "*":
                executeOp("*");
                break;
            case "/":
                executeOp("/");
                break;
            case "=":
                if (operator == '' && firstNum == true) { 
                    // If "=" is the first operator pressed, giving an identity equation
                    total = Math.round(currentValue.join('')*10000)/10000;
                    if (percent == true) {
                        equation.push(total*100 + '%');
                    } else {
                        equation.push(Math.round(total*10000)/10000);
                    }
                    equation.push('=');
                    equationDisplay.textContent = equation.join(' ');
                    limitDigits(currentValue);
                    currentValue = [];
                    equaled = true;
                    firstNum = false;
                    opKeys[4].removeEventListener('click', defineOp);
                    removeNumListeners();
                } else { 
                    // If any other operator is pressed first, then "="
                    modifiers[2].addEventListener('click', modify);
                    num2 = Number(currentValue.join(''));
                    if (percent == true) {
                        equation.push(num2*100 + '%');
                    } else {
                        equation.push(num2);
                    }
                    equation.push("=");
                    equationDisplay.textContent = equation.join(' ');
                    total = operate(operator, num1, num2);
                    currentValue = String(total).split("");
                    limitDigits(currentValue);
                    if (total == Infinity) {
                        resultDisplay.textContent = 'To Infinity, and Beyond!';
                    }
                    equaled = true;
                    opKeys[4].removeEventListener('click', defineOp);
                    removeNumListeners();
                }
                break;
            default:
                resultDisplay.textContent = "?";
        }
    }
    neg = false; // Resets +/- function after each operation
    percent = false; // Resets %
}

/* Add data clearing functionality */

backspace.addEventListener('click', () => { 
    if (percent == true) {
        // Backspacing a percent value pops the actual currentValue 
        currentValue.pop()
        resultDisplay.textContent = currentValue.join('')*100 + '%'; 
    } else {
        currentValue.pop()
        resultDisplay.textContent = currentValue.join(''); 
    };
});

clear.addEventListener('click', () => {
    modifiers[2].addEventListener('click', modify);
    currentValue = [];
    resultDisplay.textContent = currentValue.join(''); 
    num1 = 0;
    operator = '';
    num2 = 0;
    total = 0;
    equation = [];
    equationDisplay.textContent = equation.join(' ');
    percent = false;
    firstNum = true;
    neg = false;
    equaled = false;
    removeOpKeyListeners();
    addNumListeners();
});