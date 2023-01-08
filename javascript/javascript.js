const display = document.querySelector('#display')
const operationsButtons = document.querySelector('.operations');
const numberButtons = document.querySelector('.numbers');

let arrayToOperateOn = [];


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


function clear() {
	// reset array
	arrayToOperateOn = [];
	// clear display
	display.textContent = ' ';
}


function equal(arrayToOperateOn) {
	// get numbers and operations from array
	// Find index of operation
	const isOperation = (element) => element === '+' || element ===  '-' || element === '*' || element === '/';

	let operationIndex = arrayToOperateOn.findIndex(isOperation);
	// let operation = arrayToOperateOn[operationIndex];
	let operation = arrayToOperateOn[arrayToOperateOn.findIndex(isOperation)];

	// Find number1
	let number1 = +arrayToOperateOn.slice(0, operationIndex).join('');

	// Find number2
	let number2 = +arrayToOperateOn.slice(operationIndex + 1).join('');

	// call operate function 
	console.log(operate(number1, number2, operation));

	// display result

}


function show(e) {	
	// Doesn't return anything if clicked outside buttons but in the calculator
	if (e.target.className !== '') {
		return;
	}

	if (e.target.textContent === 'clear') {
		clear();
		return 
	}

	if (e.target.textContent === '=') {
		console.log("it's equal!");
		console.log(arrayToOperateOn);
		equal(arrayToOperateOn);
		return;
	}

	// At the moment, it displays everything
	display.textContent += e.target.textContent;

	arrayToOperateOn.push(e.target.textContent);
	// console.log(arrayToOperateOn);

	return arrayToOperateOn;
}






numberButtons.addEventListener('mousedown', show);

operationsButtons.addEventListener('mousedown', show);
















