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

describe("calculateRPNExpression",function () {
	it("should return 7 when passed 2 3 * 1 +",function () {
		var expression = [2,3,'*',1,'+'];
		var result = calculateRPNExpression(expression);
		expect(result.toString()).toBe("7");
	});
	it("should return 8 when passed 2 3 ^",function () {
		var expression = [2,3,"^"];
		expect(calculateRPNExpression(expression).toString()).toBe("8");
	});
	it("should correctly calculate 3 4 2 * 1 5 - 2 3 ^ ^ / +",function () {
		var expression = [3,4,2,"*",1,5,"-",2,3,"^","^","/","+"];
		expect(calculateRPNExpression(expression).toString()).toBe("3.0001220703125");
	});
});

describe("rpnFromInfix",function () {
	it("should return 1 1 + when passed 1 + 1",function () {
		var infix = [1,"+",1];
		expect(rpnFromInfix(infix)).toEqual([1,1,"+"]);
	});
	it("should return 2 2 * 3 3 * + when passed 2 * 2 + 3 * 3",function () {
			var infix = [2,"*",2,"+",3,"*",3];
			expect(rpnFromInfix(infix)).toEqual([2,2,"*",3,3,"*","+"]);
	});
	it("should return 2 2 -3 + * 3 * when passed 2 * (2 + -3) * 3",function () {
			var infix = [2,"*","(",2,"+",-3,")","*",3];
			expect(rpnFromInfix(infix)).toEqual([2,2,-3,"+","*",3,"*"]);
	});
	it("should return 3 4 2 * 1 5 - 2 3 ^ ^ / +  when passed 3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3",function () {
		var infix = [3,'+',4,'*',2,'/','(',1,'-',5,')','^',2,'^',3];
		var expected = [3,4,2,'*',1,5,'-',2,3,'^','^','/','+'];
		expect(rpnFromInfix(infix)).toEqual(expected);
	});
});
