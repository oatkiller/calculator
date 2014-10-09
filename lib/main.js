$(function () {
	FastClick.attach(document.body);

	var element = $(".calculator");
	var calculator = new Calculator;

	var controller = new CalculatorController(calculator,element);

	var view = new CalculatorView(calculator,element);

	$(controller).on("press",function (event,data) {
		calculator.press(data.role);
		view.sync();
	});

	// Make things easy to inspect in development
	element.data("calculator",calculator);
	element.data("view",view);
	element.data("controller",controller);

});
