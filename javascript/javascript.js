

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
		
		return result;
}