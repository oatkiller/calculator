describe("calculator", function() {
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
