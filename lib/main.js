$(function () {
	FastClick.attach(document.body);
	$(".calculator").calculator();

	$(".calculator").on("click",".button",function () {
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
	
});
