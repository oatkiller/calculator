var Calculator = (function () {
	var Calculator = function () {
		this.buffer = [];
		this.stack = [];
	};

	var rightAssociative = "right";
	var leftAssociative = "left";

	Calculator.prototype = {

		constructor : Calculator,

		lastResult : Big(0),

		DECIMAL : ".",

		EQUALS : "=",

		CLEAR : "C",

		PLUS_MINUS : "+/-",

		rightAssociative : rightAssociative,

		leftAssociative : leftAssociative,

		bufferValue : function () {
			if (this.buffer.length > 0) {
				return this.buffer.join("");
			}
		},

		bufferOperator : function () {
			if (this.tokenIsOperator(this.buffer.operator)) {
				return this.buffer.operator;
			}
			return null;
		},

		displayValue : function () {
			if (this.bufferNotEmpty()) {
				return this.bufferValue();
			} else {
				return this.lastResult.toString();
			}
		},

		bufferHasDecimal : function () {
			return this.buffer.indexOf(this.DECIMAL) !== -1;
		},

		press : function (token) {
			if (this.isNumeric(token)) {
				this.buffer.push(token);
			} else if (token === this.DECIMAL) {
 				if (!this.bufferHasDecimal()) {
					this.buffer.push(token);
				}
			} else if (this.tokenIsOperator(token)) {
				if (this.bufferNotEmpty()) {
					this.pushBufferToStack();
				} else {
					this.lastOperand = this.lastResult;
					this.stack.push(this.lastResult);
				}
				this.buffer.operator = token;
			} else if (token === this.EQUALS) {
				if (this.bufferNotEmpty()) {
					this.pushBufferToStack();
				} else {
					if (this.buffer.operator === null && this.stack.length === 0) {
						// no values or operators have been entered
						// repeat the last operation on the last value
						this.stack.push(this.lastResult);
						this.stack.push(this.lastOperator);
						this.stack.push(this.lastOperand);
					} else {
						this.pushBufferOperatorToStack();
						this.lastOperand = this.lastResult;
						this.stack.push(this.lastResult);
					}
				}
				this.evaluateStack();
			} else if (token === this.CLEAR) {
				this.lastResult = Big(0);
				this.buffer.operator = null;
				this.buffer.length = 0;
				this.buffer.stack = 0;
			} else if (token === this.PLUS_MINUS) {
				if (this.bufferNotEmpty()) {
					this.setBufferValue(
						Big(this.bufferValue()).
							times(
								Big(-1)
							).toString()
					);
				} else {
					this.lastResult = this.lastResult.times(Big(-1));
				}
			} else {
				// ??? oh no
				throw new Error("Operation error");
			}
		},

		setBufferValue : function (value) {
			this.buffer.length = 0;
			this.buffer.push.apply(this.buffer,value.split(""));
		},

		evaluateStack : function () {
			this.lastResult = this.calculateRPNExpression(this.rpnFromInfix(this.stack));
			this.stack.length = 0;
		},

		bufferNotEmpty : function () {
			return this.buffer.length > 0;
		},

		pushBufferOperatorToStack : function () {
			if (this.bufferOperator() !== null) {
				this.lastOperator = this.bufferOperator();
				this.stack.push(this.bufferOperator());
				this.buffer.operator = null;
			}
		},

		pushBufferToStack : function () {
			if (this.bufferNotEmpty()) {
				this.lastResult = Big(parseFloat(this.bufferValue()));
				this.lastOperand = this.lastResult;
				this.stack.push(this.lastResult);
			}
			this.pushBufferOperatorToStack();
			this.buffer.length = 0;
		},

		isNumeric : function (n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		},

		// takes a heterogeneous array of numbers and operators (strings) which form
		// an RPN expression and returns a Big with the value
		calculateRPNExpression : function (operators) {
			var stack = [];
			operators.forEach(function (operator) {
				if (this.isNumeric(operator)) {
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
			},this);
			return stack[stack.length - 1];
		},

		operators : {
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
		},

		tokenIsOperator : function (token) {
			return this.operators.hasOwnProperty(token);
		},

		precedence : function (operator) {
			return this.operators[operator].precedence;
		},

		associativity : function (operator) {
			return this.operators[operator].associativity;
		},

		// takes a heterogeneous array of numbers and operators (strings) which form
		// an infix expression and calculates an rpn expression.
		// uses Shunting-yard
		rpnFromInfix : function (infix) {
			var stack = [];
			var token;
			var output = [];
			var firstOperator;
			var	secondOperator;
			 
			for (var index = 0; index < infix.length; index++) {
				token = infix[index];
				if (this.isNumeric(token)) {
					output.push(token);
				} else if (this.tokenIsOperator(token)) {
					firstOperator = token;
					secondOperator = stack[stack.length - 1];

					while (
						this.tokenIsOperator(secondOperator)
						&&
						(
							(
								this.associativity(firstOperator) === this.leftAssociative
								&&
								this.precedence(firstOperator) <= this.precedence(secondOperator)
							)
							|| 
							(
								this.associativity(firstOperator) === this.rightAssociative
								&&
								this.precedence(firstOperator) < this.precedence(secondOperator)
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
		}

	};

	return Calculator;
})();
