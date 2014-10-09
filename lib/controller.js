CalculatorController = (function () {

	var CalculatorController = function (calculator,element) {
		this.element = $(element);
		this.calculator = calculator;
		this.bindEvents();
	};

	CalculatorController.prototype.roles = {
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

	CalculatorController.prototype.bindEvents = function () {
		this.element.on("click.calculator",".button",$.proxy(function (event) {
			var role;
			var roleKey = $(event.target).data("role");

			if (roleKey !== undefined) {
				role = this.roles[roleKey];
				$(this).triggerHandler("press",[{role:role}]);
			}
		},this));

	};

	return CalculatorController;

})();
