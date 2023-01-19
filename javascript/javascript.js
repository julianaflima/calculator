//ADD KEYBOARD SUPPORT

const display = document.querySelector('#display')
const operationsButtons = document.querySelector('.operations');
const numberButtons = document.querySelector('.numbers');
const extraButtons = document.querySelector('.extra-buttons');

let arrayToOperateOn = [0];
let arrayToDisplay = [];
let callEqual = 0;
let lockDecimalPoint = false;
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
	if (b === 0) return 'error';
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
	// If we drop the first element of the array, we get an array such that the first operation is the main operation, even if the first number is negative
	
	let tempArray = [...arrayToOperateOn];

	tempArray.shift();

	let operationIndexTempArray = tempArray.findIndex(element => 
		element === '+' || element === '-' || 
		element === '*' || element === '/');

	// We get a negative index if there's no operation
	if (operationIndexTempArray < 0) {
		return 'no operation';
	}

	// Index in original array is index in temp + 1
	return operationIndexTempArray + 1;
}


function equal(arrayToOperateOn) {
	let operationIndex = findOperator(arrayToOperateOn);	

	if (operationIndex === 'no operation') return;

	let operation = arrayToOperateOn[operationIndex];

	// Find number1
	let number1 = +arrayToOperateOn.slice(0, operationIndex).join('');

	// Find number2
	let number2 = +arrayToOperateOn.slice(operationIndex + 1).join('');

	// call operate function 
	result = String(operate(number1, number2, operation));

	// Adjust the result to prevent overflow	
	if (result.length > 13) {
		result = preventOverflow(result);
	}

// MIGHT NOT NEED THIS
	callEqual = 0;
	return result;
}


// Reduce the number of digits of result to prevent overflow
function preventOverflow(number) {
	// If not an integer, then make it an integer
	if (!Number.isInteger(number)) {
		// Find index of decimal point
		let index = number.toString().indexOf('.');

		// Find # of decimals
		let numberOfDecimals = number.toString().length - index - 1;

		// Adjust number to remove decimals
		number *= Math.pow(10, numberOfDecimals);

		// Round up to deal with rounding errors
		number = Math.round(number);

		// Reduce number to correct # of digits
		number = reduceNumber(number);

		// Decide if need to put decimal point back or not (target - 1)
		if (index < 13 - 1) {
			// Put the decimal back
			// Reduce one digit
			number = number / 10
			number = Math.round(number);

			// Put the decimal back in original place
			number = number.toString().slice(0, index) + '.' + number.toString().slice(index);

			return number;

		} else if (index === 13) {
			// If decimal point is in the last digit, remove it
			number = number / 10
			number = Math.round(number);

			return number;

		}
	} else {
		// Do this if result is an integer
		reduceNumber(number);

		return number;
	}
}


function reduceNumber(number) {
	// Find # of digits in the result
	let numberOfDigits = number.toString().length;

	// Reduce rounding to the correct # of digits -- here it's 13
	for(let i = numberOfDigits; i > 13; i--){
		number = Math.round(number / 10);
	}

	return number;
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
	arrayToOperateOn.push(0);

	arrayToDisplay.length = 0
	display.textContent = '0';

	callEqual = 0;
}


function numberButton (e) {
	// Do nothing if the target is not a number
	if (e.target.className === 'numbers') return;

	// Do nothing if there's already a decimal point
	if (lockDecimalPoint && e.target.textContent === '.') return;

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

	// Prevent more than one decimal point
	if (e.target.textContent === '.') {
		lockDecimalPoint = true;

		// Add 0 when decimal point is clicked first
		if (
		// it's first number, so arrayToOperateOn is empty
		arrayToOperateOn.length === 0 ||
		// It's the second number, so last element of arrayToOperateOn is an operation
		lastClicked === 'operation') {

			arrayToDisplay.push(0);
		}
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
	if (e.target.id === 'operations') return;

	if (e.target.textContent === '=') {
		// If there's no operator, = does nothing
		// findOperator(arrayToOperateOn);
		if (findOperator(arrayToOperateOn) === 'no operation') return;

		// Calls equal function
		equal(arrayToOperateOn);

		// Update array to hold only the result
		updateArray(result.split(''), arrayToOperateOn);

		// Update display
		updateArray(arrayToOperateOn, arrayToDisplay);
		display.textContent = arrayToDisplay.join('');

		lastClicked = '=';
		callEqual = 0;
		lockDecimalPoint = false;
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
		equal(arrayToOperateOn);

		// Update array to hold only the result
		updateArray(result.split(''), arrayToOperateOn);

		// Update display
		updateArray(arrayToOperateOn, arrayToDisplay);
		display.textContent = +arrayToDisplay.join('');

		// Add operation to arrayToOperateOn
		arrayToOperateOn.push(e.target.textContent);

		lastClicked = 'operation';
		callEqual++;
		lockDecimalPoint = false;
		return;
	}
	

	// For all buttons but '=', add the operation to the arrayToOperateOn
	arrayToOperateOn.push(e.target.textContent);
	// Change color of button operation
	// e.target.id = 'operation-clicked';


	lastClicked = 'operation';
	callEqual++;
	lockDecimalPoint = false;
}


function extraButton (e) {
	if (lastClicked === 'clear') return;

	switch (e.target.id) {
		case 'clear':
			clear();
			lastClicked = 'clear';
			callEqual = 0;
			lockDecimalPoint = false;
			break;

		case 'backspace':
			// Backspace doesn't work after calling operation
			if (lastClicked === '=') return;

			// If deleting operation, decrease callEqual and display remains the same
			let lastElement = arrayToOperateOn[arrayToOperateOn.length - 1];
			if (isOperation(lastElement)){ 
				arrayToOperateOn.pop();
				callEqual--;
				lastClicked = 'backspace';
				return;
			}

			// If deleting a decimal point, unlock button
			if (lastElement === '.') lockDecimalPoint = false;

			// If deleting last digit on the array
			if (arrayToOperateOn.length === 1 || 
				arrayToOperateOn.length === 0) {
				arrayToOperateOn.pop();
				arrayToDisplay.length = 0;
				display.textContent = '0';

				lastClicked = 'backspace';
				lockDecimalPoint = false;
				return;
			}

			// Remove last item from arrayToOperateOn
			arrayToOperateOn.pop();


			// If above deletes first digit of second number, display first number (or everything up to the operation)
			if (isOperation(arrayToOperateOn[arrayToOperateOn.length - 1])) {			
				// Reset array to display
				arrayToDisplay.length = 0;

				// update with values up to the operation
				for(let i = 0; i <= arrayToOperateOn.length - 2; i++){
					arrayToDisplay.push(arrayToOperateOn[i]);
				}
				display.textContent = +arrayToDisplay.join('');

				lastClicked = 'operation';
				return;
			}


			// Default behavior of backspace is to just remove last digit from display
			// the last element has already been removed from arrayToOperateOn
			// Just need to update display
			updateArray(display.textContent.split(''), arrayToDisplay);
			arrayToDisplay.pop();
			display.textContent = +arrayToDisplay.join('');

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



// Add support for keyboard
window.addEventListener('keydown', numberKey);

function numberKey(e) {
	console.log(e);
}






