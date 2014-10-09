var CalculatorView = (function () {

	var CalculatorView = function (calculator,element) {
		this.element = $(element);
		this.calculator = calculator;
		this.bindEvents();
		this.sync();
	};

	CalculatorView.prototype.sync = function () {

		this.element.
			find("[data-role=\"displayValue\"]").
				text(this.calculator.displayValue()).
				attr("title",this.calculator.displayValue());

		var bufferOperator = this.calculator.bufferOperator();
		if (bufferOperator === null) {
			bufferOperator = "";
		}
		this.element.
			find("[data-role=\"bufferOperator\"]").
			text(bufferOperator);
	};

	CalculatorView.prototype.bindEvents = function () {
		this.element.on("click",".button",function () {
			var button = $(this);
			var className = "pressed";
			var dataKey = "buttonPressTimeout";
			var duration = 200;

			var timeout = button.
				data(dataKey);
			clearTimeout(timeout);

			timeout = setTimeout(function () {
				button.removeClass(className);
			},duration);

			button.
				addClass(className).
				data(dataKey,timeout);
		});
	};

	return CalculatorView;

})();
