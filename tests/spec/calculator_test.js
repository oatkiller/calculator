describe("calculator view", function () {
	var element;

  beforeEach(function() {
		element = $(calculatorHTML);
		$(document.body).append(element);
  });

	afterEach(function () {
		element.remove();
	});

	it("should fire an event with role == 6 when the 6 button is pressed",function () {
		element.calculator();
		var handler = jasmine.createSpy();
		element.on("buttonPress",handler);
		element.find(".button[data-role=\"6\"]").trigger("click");
		expect(handler).toHaveBeenCalled();
		expect(handler.calls.count()).toBe(1);
		expect(handler.calls.argsFor(0)[1].role).toBe(6);
	});
});

describe("Calculator",function () {
	var calculator;
	beforeEach(function() {
		calculator = new Calculator;
	});
	describe("calculateRPNExpression",function () {
		it("should return 7 when passed 2 3 * 1 +",function () {
			var expression = [2,3,'*',1,'+'];
			var result = calculator.calculateRPNExpression(expression);
			expect(result.toString()).toBe("7");
		});
		it("should return 8 when passed 2 3 ^",function () {
			var expression = [2,3,"^"];
			expect(calculator.calculateRPNExpression(expression).toString()).toBe("8");
		});
		it("should correctly calculate 3 4 2 * 1 5 - 2 3 ^ ^ / +",function () {
			var expression = [3,4,2,"*",1,5,"-",2,3,"^","^","/","+"];
			expect(calculator.calculateRPNExpression(expression).toString()).toBe("3.0001220703125");
		});
	});

	describe("rpnFromInfix",function () {
		it("should return 1 when passed 1",function () {
			var infix = [1];
			expect(calculator.rpnFromInfix(infix)).toEqual([1]);
		});
		it("should return 1 1 + when passed 1 + 1",function () {
			var infix = [1,"+",1];
			expect(calculator.rpnFromInfix(infix)).toEqual([1,1,"+"]);
		});
		it("should return 2 2 * 3 3 * + when passed 2 * 2 + 3 * 3",function () {
				var infix = [2,"*",2,"+",3,"*",3];
				expect(calculator.rpnFromInfix(infix)).toEqual([2,2,"*",3,3,"*","+"]);
		});
		it("should return 2 2 -3 + * 3 * when passed 2 * (2 + -3) * 3",function () {
				var infix = [2,"*","(",2,"+",-3,")","*",3];
				expect(calculator.rpnFromInfix(infix)).toEqual([2,2,-3,"+","*",3,"*"]);
		});
		it("should return 3 4 2 * 1 5 - 2 3 ^ ^ / +  when passed 3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3",function () {
			var infix = [3,'+',4,'*',2,'/','(',1,'-',5,')','^',2,'^',3];
			var expected = [3,4,2,'*',1,5,'-',2,3,'^','^','/','+'];
			expect(calculator.rpnFromInfix(infix)).toEqual(expected);
		});
	});

	describe("bufferValue",function () {
		it("should return 0",function () {
			expect(calculator.bufferValue()).toBe("0");
		});
		it("should return 1 after pressing 1",function () {
			calculator.press(1);
			expect(calculator.bufferValue()).toBe("1");
		});
		it("should return 11 after pressing 1 and then pressing 1",function () {
			calculator.press(1);
			calculator.press(1);
			expect(calculator.bufferValue()).toBe("11");
		});
		it("should return 11. after pressing 1, 1, .",function () {
			calculator.press(1);
			calculator.press(1);
			calculator.press(".");
			expect(calculator.bufferValue()).toBe("11.");
		});
	});

	describe("bufferOperator",function () {
		it("should return null",function () {
			expect(calculator.bufferOperator()).toBe(null);
		});
		it("should return + after pressing +",function () {
			calculator.press("+");
			expect(calculator.bufferOperator()).toBe("+");
		});
	});

	describe("displayValue",function () {
		it("should return 0",function () {
			expect(calculator.displayValue()).toBe("0");
		});
		it("should return 1 after pressing 1",function () {
			calculator.press(1);
			expect(calculator.displayValue()).toBe("1");
		});
		it("should return 2 after pressing 1,+,2",function () {
			calculator.press(1);
			calculator.press("+");
			calculator.press(2);
			expect(calculator.displayValue()).toBe("2");
		});
		it("should return 3 after pressing 1,+,2,=",function () {
			calculator.press(1);
			calculator.press("+");
			calculator.press(2);
			calculator.press("=");
			expect(calculator.displayValue()).toBe("3");
		});
	});
});
