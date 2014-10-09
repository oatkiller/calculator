(function ($) {

	$.fn.calculator = function () {
		var element = $(this);

		element.on("click.calculator",".button",function () {
			var role = $(this).data("role");
			if (role !== undefined) {
				element.triggerHandler("buttonPress",[{role : role}]);
			}
		});

		var pressButton = function (button) {
			var className = "pressed";
			var dataKey = "buttonPressTimeout";
			var duration = 200;

			var timeout = $(button).
				data(dataKey);
			clearTimeout(timeout);

			timeout = setTimeout(function () {
				$(button).removeClass(className);
			},duration);

			$(button).
				addClass(className).
				data(dataKey,timeout);
		};

	};

})(jQuery);
