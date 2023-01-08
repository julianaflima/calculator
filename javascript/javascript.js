const display = document.querySelector('#display')
const operationsButtons = document.querySelector('.operations');
const numberButtons = document.querySelector('.numbers');

let arrayToOperateOn = [];
let wipeDisplay = false;
let lockNumbers = false;
let callEqual = 0;
let lastClicked = '';



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


function unlockNumbers() {
 numberButtons.addEventListener('mousedown', numberButton);
		lockNumbers = false;	
}


function deleteLastItem() {
	// Remove last item from the array
	arrayToOperateOn.pop();

	// Remove from display
	display.textContent = arrayToOperateOn.join('');
}


function findOperator(arrayToOperateOn) {
	// Get an array with all operators
	let arrayRed = arrayToOperateOn.reduce(function(ind, el, i) {
		if (el === '+' || el === '-' || el === '*' || el === '/')
		    ind.push(i);
		return ind;
		}, []);

	// Determine main operator
	// If more than 1, then it's the second
	if (arrayRed.length > 1) {
		return arrayRed[1];	
	} else {
		return arrayRed[0];
	}
}


function equal(arrayToOperateOn) {
	// Index of main operator in the arrayToOperateOn
	let operationIndex = findOperator(arrayToOperateOn);	

	let operation = arrayToOperateOn[operationIndex];

	// Find number1
	let number1 = +arrayToOperateOn.slice(0, operationIndex).join('');

	// Find number2
	let number2 = +arrayToOperateOn.slice(operationIndex + 1).join('');

	// call operate function 
	let result = operate(number1, number2, operation);

	// display result
	display.textContent = result;

	// update array to have only the result
	// delete all items
	arrayToOperateOn.length = 0;
	// add result to arrayToOperateOn
	String(result).split('').forEach(element => arrayToOperateOn.push(element));


	wipeDisplay = true;
	lockNumbers = true;
	// Next time an operation button is clicked, it will give the result
	callEqual = 0;
	console.log(callEqual);

	numberButtons.removeEventListener('mousedown', numberButton);

	lastClick('=');

	return display.textContent = result;
}


function numberButton(e) {		

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
		unlockNumbers();
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
		if (callEqual === 0 || lastClicked === '=') {
			display.textContent = arrayToOperateOn.join('');
			return;
		}
		equal(arrayToOperateOn);
		return;
	}

	if (e.target.textContent === 'BackSpace') {
		deleteLastItem()

		if (lastClicked === 'operation') {
			callEqual--;
		}
		return;
	}

	if (lastClicked === 'operation') {
		deleteLastItem();
		callEqual--;
	}

	if (callEqual === 1) {
		equal(arrayToOperateOn);
		unlockNumbers();
	}

	arrayToOperateOn.push(e.target.textContent);
	display.textContent = arrayToOperateOn.join('');

	lastClick('operation');
	callEqual++;
	console.log(callEqual)

	return arrayToOperateOn;
}


numberButtons.addEventListener('mousedown', numberButton);

operationsButtons.addEventListener('mousedown', operationButton);








