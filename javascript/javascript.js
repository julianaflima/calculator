const display = document.querySelector('#display')
const operationsButtons = document.querySelector('.operations');
const numberButtons = document.querySelector('.numbers');

let arrayToOperateOn = [];
let wipeDisplay = false;
let lockNumbers = false;
let lastClicked = '';
let firstNumber = 0;
let secondNumber = 0;



function add(a, b) {
	return a + b;
}


function subtract(a, b) {
	return a - b;
}


function multiply(a, b) {
	return a * b;
}


function divide(a, b) {
	if (b === 0) return 'error'
	return (a / b);
}


function operate(number1, number2, operation) {
		switch (operation) {
			case '+':
				return add(number1, number2);
				break;
			case '-': 
				return subtract(number1, number2);
				break;
			case '*':
				return multiply(number1, number2);
				break;
			case '/': 
				return divide(number1, number2);
				break;
		}
}


function lastClick(lastClick) {
	lastClicked = lastClick;
}


function clear() {
	// reset array
	arrayToOperateOn.length = 0;
	// clear display
	display.textContent = 0;

	lastClick('clear');
}


function equal(arrayToOperateOn) {
	// get numbers and operations from array

	// Main operator is the second operation sign
	let arrayRed = arrayToOperateOn.reduce(function(ind, el, i) {
	if (el === '+' || el === '-' || el === '*' || el === '/')
	    ind.push(i);
	return ind;
	}, []);

	let operationIndex;

	if (arrayRed.length > 1) {
		operationIndex = arrayRed[1];	
	} else {
		operationIndex = arrayRed[0];
	}

	let operation = arrayToOperateOn[operationIndex];

	// Find number1
	let number1 = +arrayToOperateOn.slice(0, operationIndex).join('');
	console.log(number1);

	// Find number2
	let number2 = +arrayToOperateOn.slice(operationIndex + 1).join('');

	// call operate function 
	let result = operate(number1, number2, operation);

	// display result
	display.textContent = result;

	// update array to have only the result
	arrayToOperateOn.length = 0;
	String(result).split('').forEach(element => arrayToOperateOn.push(element));


	wipeDisplay = true;
	lockNumbers = true;
	numberButtons.removeEventListener('mousedown', numberButton);

	lastClick('=');

	return result;
}


function numberButton(e) {		
	if (wipeDisplay) {
		display.textContent = '';
		wipeDisplay = false;
	}

	// Doesn't return anything if clicked outside buttons but in the calculator
	if (e.target.className !== '') {
		return;
	}


	if (display.textContent === '0') {
		display.textContent = '';
	}

	
	arrayToOperateOn.push(e.target.textContent);
	display.textContent = arrayToOperateOn.join('');

	lastClick('number');

	return arrayToOperateOn;
}


function operationButton(e) {
	
	if (lockNumbers) {
		numberButtons.addEventListener('mousedown', numberButton);
		lockNumbers = false;
	}

	if (wipeDisplay) {
		display.textContent = '';
		wipeDisplay = false;
	}

	// When clicked outside buttons but in the calculator, it doesn't do anything
	if (e.target.className !== '') {
		return;
	}

	if (e.target.textContent === 'clear') {
		clear();
		return 
	}

	if (e.target.textContent === '=') {
		equal(arrayToOperateOn);
		return;
	}

	if (e.target.textContent === 'BackSpace') {
		// Remove last item from the array
		arrayToOperateOn.pop();

		// Remove from display
		display.textContent = arrayToOperateOn.join('');
		return;
	}

	if (lastClicked === 'operation') {
		// Remove last item from the array
		arrayToOperateOn.pop();

		// Remove from display
		display.textContent = arrayToOperateOn.join('');
	}

	arrayToOperateOn.push(e.target.textContent);
	display.textContent = arrayToOperateOn.join('');

	lastClick('operation');

	return arrayToOperateOn;
}


numberButtons.addEventListener('mousedown', numberButton);

operationsButtons.addEventListener('mousedown', operationButton);








