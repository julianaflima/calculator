const display = document.querySelector('#display')
const operationsButtons = document.querySelector('.operations');
const numberButtons = document.querySelector('.numbers');
const extraButtons = document.querySelector('.extra-buttons');

let arrayToOperateOn = [];
let arrayToDisplay = [];
let callEqual = 0;
let noOperator = false;
let result = '';
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


function findOperator(arrayToOperateOn) {
	// Get an array with all operators
	let arrayRed = arrayToOperateOn.reduce(function(ind, el, i) {
		if (el === '+' || el === '-' || el === '*' || el === '/')
		    ind.push(i);
		return ind;
		}, []);

	// Determine main operator
	switch (true) {
		case (arrayRed.length === 0):
			noOperator = true;
			return;
		case (arrayRed.length > 1):
			noOperator = false;
			return arrayRed[1];	
		default:
			noOperator = false;
			return arrayRed[0];
			break;
	}
}


function equal(arrayToOperateOn) {

	// Index of main operator in the arrayToOperateOn
	let operationIndex = findOperator(arrayToOperateOn);	

	if (noOperator) {
		return;
	}

	let operation = arrayToOperateOn[operationIndex];

	// Find number1
	let number1 = +arrayToOperateOn.slice(0, operationIndex).join('');

	// Find number2
	let number2 = +arrayToOperateOn.slice(operationIndex + 1).join('');

	// call operate function 
	result = String(operate(number1, number2, operation));

	// Adjust the result to prevent overflow	
	if (result.length > 13) {
		let provResult = result.slice(0, 13);
		result = provResult;
		// return result;
	}

// MIGHT NOT NEED THIS
	callEqual = 0;
	return result;
}


// Update an array from another array
// If the source is a string, pass as string.split('')
function updateArray (arraySource, arrayToUpdate) {
	arrayToUpdate.length = 0;
	arraySource.forEach(element => arrayToUpdate.push(element));
	return arrayToUpdate;
}

// Find if character is an operation
function isOperation(char) {
	if (char === '+' || char === '-' ||
		char === '*' || char === '/') {
		return true;
	} else {
		return false;
	}
}


// Clear working array and display
function clear() {
	arrayToOperateOn.length = 0;

	arrayToDisplay.length = 0
	display.textContent = '0';

	callEqual = 0;
}


function numberButton (e) {
	// Do nothing if the target is not a number
	if (e.target.className === 'numbers') return;

	// Clear display if last clicked was an operation button and back to normal background color
	if (lastClicked === 'operation') {
		arrayToDisplay.length = 0;
	}

	if (lastClicked === '=') {
		clear();
		lastClicked = 'clear';
		callEqual = 0;
	}

	// Prevent overflow
	if (arrayToDisplay.length === 13) {
		return;
	}

	// Add number to arrayToDisplay
	arrayToDisplay.push(e.target.textContent);
	display.textContent = arrayToDisplay.join('');

	// Add number to arrayToOperateOn
	arrayToOperateOn.push(e.target.textContent);

	lastClicked = 'number';
}


function operationButton (e) {
	// Do nothing if the target is between buttons
	console.log(arrayToOperateOn);

	if (e.target.id === 'operations') return;

	if (e.target.textContent === '=') {

		// If there's no operator, = does nothing
		findOperator(arrayToOperateOn);
		if (noOperator) {
			return;
		}

		// Call equal function if there's an operator 
		equal(arrayToOperateOn);

		// Update array to hold only the result
		updateArray(result.split(''), arrayToOperateOn);
		console.log(arrayToOperateOn);


		// Update display
		updateArray(arrayToOperateOn, arrayToDisplay);
		display.textContent = arrayToDisplay.join('');

		lastClicked = '=';
		callEqual = 0;
		return;
	}

	// Delete last item from arrayToOperateOn if last element was an operation
	if (lastClicked === 'operation') {
		arrayToOperateOn.pop();
		callEqual--;
	}

	// Do the math when there's one operation
	if (callEqual === 1) {
		// Do the math; the result is a string
		console.log(equal(arrayToOperateOn));

		// Update array to hold only the result
		updateArray(result.split(''), arrayToOperateOn);

		// Update display
		updateArray(arrayToOperateOn, arrayToDisplay);
		display.textContent = arrayToDisplay.join('');

		// Add operation to arrayToOperateOn
		arrayToOperateOn.push(e.target.textContent);

		lastClicked = 'operation';
		callEqual++;
		return;
	}
	

	// For all buttons but '=', add the operation to the arrayToOperateOn
	arrayToOperateOn.push(e.target.textContent);
	// Change color of button operation
	// e.target.id = 'operation-clicked';


	lastClicked = 'operation';
	callEqual++;
}


function extraButton (e) {
	if (lastClicked === 'clear') return;

	switch (e.target.id) {
		case 'clear':
			clear();
			lastClicked = 'clear';
			callEqual = 0;
			break;

		case 'backspace':
			// Backspace doesn't work after calling operation
			if (lastClicked === '=') return;

			// If deleting operation, decrease callEqual
			let lastElement = arrayToOperateOn[arrayToOperateOn.length - 1];

			if (isOperation(lastElement)) callEqual--;

			
			// Remove last item
			arrayToOperateOn.pop();

			// If there's no number in arrayToOperateOn
			if (arrayToOperateOn.length === 0) {
				display.textContent = '0';
				arrayToDisplay.length = 0;
				
				lastClicked = 'backspace';
				return;
			}

			// Update display
			updateArray(arrayToOperateOn, arrayToDisplay)
			display.textContent = arrayToDisplay.join('');

			lastClicked = 'backspace';
			break;

		// Does nothing if click is between buttons
		default:
			break;
	}
}


numberButtons.addEventListener('mousedown', numberButton);

operationsButtons.addEventListener('mousedown', operationButton);

extraButtons.addEventListener('mousedown', extraButton);




