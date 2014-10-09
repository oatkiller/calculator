var isNumeric = function (n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

// takes a heterogeneous array of numbers and operators (strings) which form
// an RPN expression and returns a Big with the value
var calculateRPNExpression = function (operators) {
	var result;
	var stack = [];
	operators.forEach(function (operator) {
		if (isNumeric(operator)) {
			stack.push(operator);
		} else {
			var y = stack.pop();
			var x = stack.pop();
			var bigY = Big(y);
			var bigX = Big(x);
		 
			if (operator === "^") {
				if (y instanceof Big) {
					y = parseFloat(y.toString());
				}
				stack.push(bigX.pow(y));
			} else if (operator === "+") {
				stack.push(bigX.plus(bigY));
			} else if (operator === "-") {
				stack.push(bigX.minus(bigY));
			} else if (operator === "*") {
				stack.push(bigX.times(bigY));
			} else if (operator === "/") {
				stack.push(bigX.div(bigY));
			} else {
				throw new Error("Undefined operator");
			}
		}
	});
	return stack[stack.length - 1];
};

// takes a heterogeneous array of numbers and operators (strings) which form
// an infix expression and calculates an rpn expression.
// uses Shunting-yard
var rpnFromInfix = function (infix) {

	var stack = [];
	var rightAssociative = "right";
	var leftAssociative = "left";

	var operators = {
		"^" : {
			precedence : 4,
			associativity : rightAssociative
		},
		"*" : {
			precedence : 3,
			associativity : leftAssociative
		},
		"/" : {
			precedence : 3,
			associativity : leftAssociative
		},
		"+" : {
			precedence : 2,
			associativity : leftAssociative
		},
		"-" : {
			precedence : 2,
			associativity : leftAssociative
		}
	};

	var precedence = function (operator) {
		return operators[operator].precedence;
	};
	var associativity = function (operator) {
		return operators[operator].associativity;
	};

	var token;
	var output = [];
	var firstOperator
	var	secondOperator;

	var tokenIsOperator = function (token) {
		return operators.hasOwnProperty(token);
	};
	 
	for (var index = 0; index < infix.length; index++) {
		token = infix[index];

		if (isNumeric(token)) {
			output.push(token);
		} else if (tokenIsOperator(token)) {

			firstOperator = token;
			secondOperator = stack[stack.length - 1];

			while (
				tokenIsOperator(secondOperator)
				&&
				(
					(
						associativity(firstOperator) === leftAssociative
						&&
						precedence(firstOperator) <= precedence(secondOperator)
					)
					|| 
					(
						associativity(firstOperator) === rightAssociative
						&&
						precedence(firstOperator) < precedence(secondOperator)
					) 
				)
			) {
				output.push(secondOperator);

				// pop secondOperator off the stack
				stack.pop();

				// process next operator
				secondOperator = stack[stack.length - 1];
			}

			stack.push(firstOperator);

		} else if (token === "(") {

			stack.push(token);

		} else if (token === ")") {

			// until we reach '('
			while (stack[stack.length - 1] !== "(") {
				output.push(stack.pop());
			}

			// discard '('
			stack.pop();
		}
	}

	while (stack.length > 0) {
		output.push(stack.pop());
	}

	return output;
};
