// 常數
var FPS = 60;		// 1秒間的描繪次數
var ROW = 25;		// 橫向的球的個數
var COL = 15;		// 縱向的球的個數
var MAX_DIS = 300;	// 球對滑鼠反應的最大距離
var SPRING = 0.1;	// 彈性係數
var FRICTION = 0.9;	// 摩擦係數

// 變數
var ctx;			// 2D context
var canvasW;		// canvas的寬度
var canvasH;		// canvas的高度
var ballList = [];	// 放入建立好的球的陣列
var mx = null;		// 滑鼠的X座標
var my = null;		// 滑鼠的Y座標

window.onload = function () {
	init();
};

// 初始設定
var init = function () {
	var canvas = document.getElementById("mycanvas");

	// 確認canvas元素是否存在
	if (!canvas || !canvas.getContext) {
		return false;
	}

	ctx = canvas.getContext("2d");
	canvasW = canvas.width;
	canvasH = canvas.height;

	// 登錄滑鼠事件至canvas
	canvas.addEventListener("mousemove", updateMousePos, false);	// 滑鼠移動時的事件
	canvas.addEventListener("mouseout", resetMousePos, false);		// 滑鼠跑出畫面外時的事件

	create();	// 建立球
	loop();		// 執行主迴圈
};

// 取得滑鼠位置
var updateMousePos = function (e) {
	var rect = e.target.getBoundingClientRect();
	mx = e.clientX - rect.left;
	my = e.clientY - rect.top;
};

// 重設滑鼠位置
var resetMousePos = function (e) {
	mx = null;
	my = null;
};

// 建立球
var create = function () {
	// 縱橫排列
	var space = 30;
	for (var i = 0; i < ROW; i++) {
		for (var j = 0; j < COL; j++) {
			var ofsx = (canvasW - space * (ROW - 1)) / 2;
			var ofsy = (canvasH - space * (COL - 1)) / 2;

			// 建立實體
			var ball = new Ball(
				space * i + ofsx,
				space * j + ofsy
				);

			// 將實體收納至陣列中
			ballList.push(ball);
		}
	}
};

// 主迴圈
var loop = function () {
	update();
	draw();
	setTimeout(loop, 1000 / FPS);
};

// 更新球的位置
var update = function () {
	for (var i = 0; i < ballList.length; i++) {
		ballList[i].update();
	}
};

// 球的描繪
var draw = function () {
	// 描繪背景
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvasW, canvasH);

	// 描繪球
	for (var i = 0; i < ballList.length; i++) {
		ballList[i].drawLine();
		ballList[i].drawCircle();
	}
};


/**
 * Ball類別
 */
// 建構子
var Ball = function (x0, y0) {
	this.x0 = this.x = x0;
	this.y0 = this.y = y0;
};

// 屬性與方法
Ball.prototype = {
	// 屬性
	x0: null,		// 初始X座標
	y0: null,		// 初始Y座標
	x: null,		// 現在位置的X座標
	y: null,		// 現在位置的Y座標
	vx: 0,			// X軸方向的速度
	vy: 0,			// Y軸方向的速度
	color: null,	// 顏色
	radius: null,	// 半徑

	// 更新位置
	update: function () {
		var dx = this.x0;	// 目的地的X座標
		var dy = this.y0;	// 目的地的Y座標
		this.radius = 1;
		if (mx !== null && my !== null) {
			// 計算從滑鼠到初始座標為止的距離
			var dis = Math.sqrt(Math.pow(this.x0 - mx, 2) + Math.pow(this.y0 - my, 2));

			// 根據距離設定球的位置與半徑
			if (dis < MAX_DIS) {
				// 係數
				var k = MAX_DIS - dis;

				// 移動距離
				var d = -k * 0.1;

				// 滑鼠與球的角度
				var rad = Math.atan2(my - this.y0, mx - this.x0);

				// 移動到的位置
				dx = this.x0 + Math.cos(rad) * d;
				dy = this.y0 + Math.sin(rad) * d;

				// 半徑
				this.radius = k * 0.05;
			}
		}

		//以彈簧的動作設定X座標
		var ax = (dx - this.x) * SPRING;
		this.vx += ax;
		this.vx *= FRICTION;
		this.x += this.vx;
			
		//以彈簧的動作設定Y座標
		var ay = (dy - this.y) * SPRING;
		this.vy += ay;
		this.vy *= FRICTION;
		this.y += this.vy;
	},

	// 線的描繪
	drawLine: function () {
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
		ctx.beginPath();
		ctx.moveTo(this.x0, this.y0);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();
	},

	// 圓的描繪
	drawCircle: function () {
		ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fill();
	}
};