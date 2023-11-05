
$(function() {
///////叫出、設定儲存資料////////
historyLoad();

///////按鈕僅顯示start與重設////////
$('#lap, #stop').css('display','none');
$('#start, #reset').css('display','inline-block');
//alert(location.origin);

/*按鈕操作*/
/*-----------------------------------------------------------*/

//點選start
//////////////////////////////////////////////
$('#start').click(function() {
//單圈時間測量&記錄
timerOn = setInterval( timer, 10 );//每10毫秒執行timer()
preTimeGet();
$('#lap, #stop').css('display','inline-block');
$('#start, #reset').css('display','none');
});

//點選lap
//////////////////////////////////////////////
$('#lap').click(function() {
//單圈時間測量&記錄
preTimeGet();
$('#log').prepend("<li>" + $('#nowlap').text() + "</lir>");
localStorage.setItem('historylog',$('#log').html());
});

//點選stop
//////////////////////////////////////////////
$('#stop').click(function() {
stopTime();
});

//reset
//////////////////////////////////////////////
$('#reset').click(function() {
stopTime();
clearHistory();
$('#nowlap').text('00:00.0');
});

});

/*-----------------------------------------------------------*/

//單圈時間歷史記錄相關
//////////////////////////////////////////////////

//叫出計數器更新時間 沒有儲存資料時就初始化
function historyLoad() {
if(localStorage.getItem('historylog')){
$('#log').html(localStorage.getItem('historylog'));
} else {
$('#log').html("");
}
}

//清除歷史記錄時間
function clearHistory() {
localStorage.removeItem('historylog');
$('#log').html("");
}

/*-----------------------------------------------------------*/

//計測開始時間
//////////////////////////////////////////////////
function preTimeGet() {
preTime = new Date();//現在時刻取得
preTimeGT = preTime.getTime();
}


/*-----------------------------------------------------------*/

//即時顯示單圈時間（透過按下計時器開始按鈕時的動作來使用）
//////////////////////////////////////////////////
function timer(){
nowTime = new Date();//取得現在時刻

//取得現在時刻-按下單圈時間按鈕時的時間
T = nowTime.getTime() - preTimeGT;

//時間的格式調整
M = Math.floor( T / ( 60 * 1000 ) );
T = T - ( M * 60 * 1000 );
S = Math.floor( T / 1000 ); 
Ms = T % 1000;
if( M < 10 ){ M = "0" + M; }
if( S < 10 ){ S = "0" + S; }
checkLap = M + ":" + S + "." + Ms ;

$('#nowlap').text(checkLap);//顯示經過時間
//測試 $('#nowlap').text("checkLap " + checkLap + "：Stop " + Stop + "：lapPushGT " + lapPushGT);
}

/*-----------------------------------------------------------*/

//停止
//////////////////////////////////////////////////
function stopTime(){
clearTimeout (timerOn);
preTimeGT = 0;
$('#lap, #stop').css('display','none');
$('#start, #reset').css('display','inline-block');
}



