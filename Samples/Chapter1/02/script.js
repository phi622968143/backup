window.onload = function () {
	// 取得元素
	var roadMap = Snap.select("#roadMap");
	var map = roadMap.select("#map");

	// 描繪目的地的矩形
	var goal = map.rect(345, 109, 21, 21);
	goal.attr({
		fill: "#192D4A",
		stroke: "#FFF",
		strokeWidth: 2
	});

	// 描繪現在位置的圓
	var pt = map.circle(122, 404, 12);
	pt.attr({
		fill: "#C53645",
		stroke: "#FFF",
		strokeWidth: 8
	});

	// 描繪文字
	map.text(135, 430, "START").attr({
		font: "bold 18px Arial, sans-serif",
		fill: "#192D4A"
	});

	map.text(327, 98, "GOAL!!").attr({
		font: "bold 18px Arial, sans-serif",
		fill: "#192D4A"
	});

	// 在地圖上加上遮色片
	var maskCircle = roadMap.circle(250, 250, 250);

	maskCircle.attr({
		fill: "#FFF"
	});

	map.attr({
		mask: maskCircle
	});

	// 消除路徑的線
	var route = map.select("#route");
	route.attr({
		display: "none"
	});

	// 取得路徑長度
	var len = route.getTotalLength();

	// 建立軌跡的路徑
	var track = map.path();

	track.attr({
		fill: "none",
		stroke: "#192D4A",
		strokeWidth: 3,
		strokeDasharray: "5 3"
	});

	track.insertBefore(pt);

	// 點選地圖時的處理
	roadMap.click(function () {
		Snap.animate(0, len, function (val) {
			// 移動現在位置
			var dot = route.getPointAtLength(val);
			pt.attr({
				cx: dot.x,
				cy: dot.y
			});

			// 描繪軌跡的路徑
			track.attr({
				d: route.getSubpath(0, val)
			});
		}, 10000);
	});
};