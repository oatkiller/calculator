(function ($) {
	$.fn.calculator = function () {
		var element = $(this);

		var roles = {
			"add" : "+",
			"subtract" : "-",
			"divide" : "/",
			"multiply" : "*",
			"equals" : "=",
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

		element.on("click.calculator",".button",function () {
			var role = $(this).data("role");
			if (role !== undefined) {
				role = roles[role];
				console.log("pressing :",role);
				calculator.press(role);
				element.
					find("[data-role=\"displayValue\"]").
						text(calculator.displayValue());

				if (calculator.bufferOperator() !== null) {
					element.
						find("[data-role=\"bufferOperator\"]").
						text(calculator.bufferOperator());
				}

			}
		});
	};

})(jQuery);
