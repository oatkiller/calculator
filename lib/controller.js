(function ($) {
	$.fn.calculator = function () {
		var element = $(this);

		var roles = {
			"add" : "+",
			"subtract" : "-",
			"divide" : "/",
			"multiply" : "*",
			"equals" : "=",
			"sign-flip" : "+/-",
			"clear" : "C",
			"decimal" : ".",
			"0" : 0,
			"1" : 1,
			"2" : 2,
			"3" : 3,
			"4" : 4,
			"5" : 5,
			"6" : 6,
			"7" : 7,
			"8" : 8,
			"9" : 9
		};

		var calculator = new Calculator;

		element.data("calculator",calculator);

		var sync = function () {
			element.
				find("[data-role=\"displayValue\"]").
					text(calculator.displayValue());

			bufferOperator = calculator.bufferOperator();
			if (bufferOperator === null) {
				bufferOperator = "";
			}
			element.
				find("[data-role=\"bufferOperator\"]").
				text(bufferOperator);
		};

		element.on("click.calculator",".button",function () {
			var role = $(this).data("role");
			if (role !== undefined) {
				role = roles[role];
				calculator.press(role);
				sync();
			}
		});

		sync();
	};

})(jQuery);
