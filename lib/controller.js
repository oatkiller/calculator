(function ($) {
	$.fn.calculator = function () {
		var element = $(this);

		element.on("click.calculator",".button",function () {
			var role = $(this).data("role");
			if (role !== undefined) {
				element.triggerHandler("buttonPress",[{role : role}]);
			}
		});
	};
})(jQuery);
