(function($){

    'use strict';

    var cv = document.getElementById('textCv'),
        ctx = cv.getContext('2d'),
        paddingWindow = 20*2,
        inputAreaHeight = 100,
        W = cv.width = window.innerWidth - paddingWindow,
        H = cv.height = window.innerHeight - paddingWindow - inputAreaHeight,
        imgCv = document.createElement('canvas'),
        imgCtx = imgCv.getContext('2d'),
        imgText = new Image(),
        fontSize = 60,
        randomPos,// random決定進行動畫時描繪圖像的位置
        start = true;

    $(document).ready(function(){
        init();
    });

    /**********************************************
     *  初始設定
     **********************************************/
    function init(){

        // 監視輸入的文字
        watchForm();

        // 以下拉式選單選擇顏色時
        $('#selectColor').on('change', drawText);

        // 產生動畫用的canvas
        setImageCanvas();

        imgText.onload = function(){
            if(start) {
                animation();
                // 在這之後不執行animation()
                start = false;
            }
        };
    }

    /**********************************************
     *  監視輸入至表單的文字
     **********************************************/
    function watchForm(){
        var timerID;

        $('#inputText').on("focus", function(){
            timerID = setInterval(drawText, 60);
        });
        $('#inputText').on("blur", function(){
            clearInterval(timerID);
        });
    }

    /**********************************************
     *  將text描繪於canvas
     **********************************************/

    /* 將輸入之文字描繪於canvas */
    function drawText(){
        var inputText = $('#inputText').val();
        var colorText = $('#selectColor').val();

        ctx.clearRect(0, 0, W, H);

        /* 文字的縱向基準值 */
        ctx.textBaseline = 'middle';

        /* 文字的開始位置 */
        ctx.textAlign = 'center';

        /* 定義模糊的顏色 */
        ctx.shadowColor = colorText;

        /* 定義模糊的範圍 */
        ctx.shadowBlur = 10;

        /* 定義字型樣式 */
        ctx.font = 'bold 80px "Audiowide"';

        /* 決定顏色 */
        ctx.fillStyle = '#ffffff';

        /* 描繪文字 */
        ctx.fillText(inputText, W / 2, H / 2, W);

        changeImg();
    }

    /**********************************************
     *  轉換為image
     **********************************************/

    // 將描繪於canvas的文字轉換為img
    function changeImg(){
        var imgPngUrl = cv.toDataURL();

        imgText.src = imgPngUrl;
    }

    // 設定結果用的canvas
    function setImageCanvas(){
        imgCv.setAttribute('width', W);
        imgCv.setAttribute('height', H);

        $('#textCv').after(imgCv);
    }

    /**********************************************
     *  animation
     **********************************************/

    /*
     *  animation的初始設定
     */
    function initAnimation(){
        // 將canvas清除
        imgCtx.clearRect(0, 0, W, H);
        effectViberation();
    }

    /*
     *  將image資料每隔 1px 隨機錯開描繪
     */
    function effectViberation(){
        var range = $('#rangeViberation').val();

        // 每隔1px錯開描繪
        for (var i = 0; i < H; i+=2) {
            randomPos = Math.floor(Math.random()*range);
            imgCtx.drawImage(imgText, 0, i, W, 1, randomPos, i, W, 1);
        }
    }

    /*
     *  進行動畫用的迴圈
     */
    function animation(){
        function animationLoop(){
            initAnimation();
            requestAnimationFrame(animationLoop);
        }
        animationLoop();
    }

    /*
     *  requestAnimationFrame的設定
     */
    window.requestAnimationFrame = (function(){
        return window.requestAnimationFrame || // chrome或最新的
               window.mozRequestAnimationFrame || // 舊版firefox用
               window.webkitRequestAnimationFrame ||  // safari6以下、iOS6 safari用
               function( callback ) {
                   window.setTimeout(callback, 1000 / 60);
               };
    })();

})(jQuery);