describe("calculator view", function () {
	var element;
	var calculator;
	var buildView = function () {
		return new CalculatorView(calculator,element);
	};

  beforeEach(function() {
		calculator = new Calculator;
		element = $(calculatorHTML);
		$(document.body).append(element);
  });

	afterEach(function () {
		element.remove();
	});

	it("should show the calculator's displayValue immediately",function () {
		var expected = "fake display value";
		spyOn(Calculator.prototype,"displayValue").and.returnValue(expected);
		buildView().sync();
		expect(element.find("[data-role=\"displayValue\"]").text()).toBe(expected);
	});

	it("should set the displayValue element's title to the calculator's displayValue immediately",function () {
		var expected = "fake display value";
		spyOn(Calculator.prototype,"displayValue").and.returnValue(expected);
		buildView().sync();
		expect(element.find("[data-role=\"displayValue\"]").attr("title")).toBe(expected);
	});

	it("should show the calculator's buffer operator immediately",function () {
		var expected = "fake buffer operator";
		spyOn(Calculator.prototype,"bufferOperator").and.returnValue(expected);
		buildView().sync();
		expect(element.find("[data-role=\"bufferOperator\"]").text()).toBe(expected);
	});

	it("should show now buffer operator if the calculator no longer has one",function () {
			var retval = "?";
			spyOn(Calculator.prototype,"bufferOperator").and.callFake(function () {
				return retval;
			});
			var view = buildView();
			view.sync();
			expect(element.find("[data-role=\"bufferOperator\"]").text()).toBe(retval);

			// set bufferOperator to null
			retval = null;

			view.sync();

			expect(element.find("[data-role=\"bufferOperator\"]").text()).toBe("");

	});
});

describe("calculator controller", function () {
	var element;
	var calculator;
	var buildController = function () {
		return new CalculatorController(calculator,element);
	};

  beforeEach(function() {
		calculator = new Calculator;
		element = $(calculatorHTML);
		$(document.body).append(element);
  });

	afterEach(function () {
		element.remove();
	});

	var buttonTest = function (value,buttonRole,buttonName) {
		it("should trigger press event with data.role === '" + value + "' when the " + buttonName + " button is pressed",function () {
			var controller = buildController();
			var handler = jasmine.createSpy("handler");
			$(controller).on("press",handler);
			element.find("[data-role=\"" + buttonRole + "\"]").trigger("click");

			expect(handler.calls.mostRecent().args[1].role).toBe(value);
		});
	};

	buttonTest('C','clear','C');
	buttonTest('/','divide','divide');
	buttonTest('-','subtract','subtract');
	buttonTest('*','multiply','multiply');
	buttonTest('+','add','add');
	buttonTest('+/-','sign-flip','plus-minus');
	buttonTest('.','decimal','decimal');
	for (var i = 0; i < 10; i++) {
		buttonTest(i,i.toString(),i.toString());
	}

	var keyTest = function (value,keyCode,keyName) {
		it("should trigger press event with data.role === '" + value + "' when the " + keyName + " key is pressed",function () {
			var controller = buildController();
			var handler = jasmine.createSpy("handler");
			$(controller).on("press",handler);
			var event = $.Event("keypress",{ which : keyCode });
			$(document).trigger(event);

			expect(handler.calls.mostRecent().args[1].role).toBe(value);
		});
	};

	keyTest("+",43,"+");
	keyTest("-",45,"-");
	keyTest("/",47,"/");
	keyTest("*",42,"*");
	keyTest("=",61,"=");
	keyTest("=",13,"Return");
	keyTest("+/-",110,"n");
	keyTest("C",99,"c");
	keyTest(".",46,".");
	for (var i = 0; i < 10; i++) {
		// The keyCode for 0 is 48, the keycode for 9 is 57
		keyTest(i,i + 48,i.toString());
	}
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
		it("should be empty after pressing 1, 1, C",function () {
			calculator.press(1);
			calculator.press(1);
			calculator.press("C");
			expect(calculator.bufferNotEmpty()).toBe(false);
		});
		it("should be -9 after pressing 9,+/-",function () {
			calculator.press(9);
			calculator.press("+/-");
			expect(calculator.bufferValue()).toBe("-9");
		});
		it("should be 9 after pressing 9,+/-,+/-",function () {
			calculator.press(9);
			calculator.press("+/-");
			calculator.press("+/-");
			expect(calculator.bufferValue()).toBe("9");
		});
		it("should be 1.01 after pressing 1,.,0,1,.",function () {
			calculator.press(1);
			calculator.press(".");
			calculator.press(0);
			calculator.press(1);
			calculator.press(".");
			expect(calculator.bufferValue()).toBe("1.01");
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
		it("should return null after pressing +,=",function () {
			calculator.press("+");
			calculator.press("=");
			expect(calculator.bufferOperator()).toBe(null);
		});
		it("should return null after pressing +,C",function () {
			calculator.press("+");
			calculator.press("C");
			expect(calculator.bufferOperator()).toBe(null);
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
		it("should be 1 after pressing 1,+",function () {
			calculator.press(1);
			calculator.press("+");
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
		it("should return 4 after pressing 1,+,2,=,+,1,=",function () {
			calculator.press(1);
			calculator.press("+");
			calculator.press(2);
			calculator.press("=");
			calculator.press("+");
			calculator.press("1");
			calculator.press("=");
			expect(calculator.displayValue()).toBe("4");
		});
		it("should be 0 after pressing 1,+,2,=,C",function () {
			calculator.press(1);
			calculator.press("+");
			calculator.press(2);
			calculator.press("=");
			calculator.press("C");
			expect(calculator.displayValue()).toBe("0");
		});
		it("should be -9 after pressing 9,+,+/-",function () {
			calculator.press(9);
			calculator.press("+");
			calculator.press("+/-");
			expect(calculator.displayValue()).toBe("-9");
		});
		it("should be 2 after pressing 8,/,2,=,=",function () {
			calculator.press(8);
			calculator.press("/");
			calculator.press(2);
			calculator.press("=");
			calculator.press("=");
			expect(calculator.displayValue()).toBe("2");
		});
		it("should be 1 after pressing 8,/,2,=,=,=",function () {
			calculator.press(8);
			calculator.press("/");
			calculator.press(2);
			calculator.press("=");
			calculator.press("=");
			calculator.press("=");
			expect(calculator.displayValue()).toBe("1");
		});
		it("should be 0.125 after pressing 8,/,2,=,=,=,=,=,=",function () {
			calculator.press(8);
			calculator.press("/");
			calculator.press(2);
			calculator.press("=");
			calculator.press("=");
			calculator.press("=");
			calculator.press("=");
			calculator.press("=");
			calculator.press("=");
			expect(calculator.displayValue()).toBe("0.125");
		});
	});
});
