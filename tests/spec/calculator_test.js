describe("calculator", function() {
  beforeEach(function() {
  });

	it("should fire an event with role == 6 when the 6 button is pressed",function () {
		var handler = jasmine.createSpy()
		calculator.on("buttonPress",handler);
		$(".button[role=\"6\"]").triggerHandler("click");
		expect(handler).toHaveBeenCalled();
		expect(handler.callCount).toBe(1);
		expect(handler.mostRecentCall.args[1].role).toBe(6);
	});
});
