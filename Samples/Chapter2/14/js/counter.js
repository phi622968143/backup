/*在各式各樣的地方重複使用*/
/*-----------------------------------------------------------*/

//儲存計數值
var dataSave = function () {
localStorage.setItem('dataCount',$('#count').text());
}


//叫出計數值 沒有儲存資料時就初始化
var countLoad = function () {
if(localStorage.getItem('dataCount')){
$('#count').text(localStorage.getItem('dataCount'));
} else {
$('#count').text("0");
}
}


/*計數器*/
/*-----------------------------------------------------------*/
$(function() {

///////呼叫、設定儲存資料////////
countLoad();

///////點選按鈕////////

//點選＋
$('#plusCount').bind('touchend' , function() {
update($("#count"));
});

//點選＋　計數時
function update(e) {
var n = parseInt(e.text(), 10);
e.text(n + 1);

//儲存計數後之值
dataSave();
}});


//點選ー
//////////////////////////////////////////////
$(function() {
$('#minusCount').bind('touchend', function() {
downdate($("#count"));
});


//點選減號　計數時
function downdate(e) {
var n = parseInt(e.text(), 10);
e.text(n - 1);

//儲存計數後之值
dataSave();
}
});

//重設
//////////////////////////////////////////////
$(function() {
$('#clear').bind('touchend', function() {
$('#count').text("0");
dataSave();
});
});


//////根據裝置的尺寸不同在 body 加入 class
var checkWinSize = function () {
if(Math.abs(window.innerHeight) < 480){
$("body").addClass("short");
}
}

//開啟計數器時執行
window.onload = checkWinSize;


