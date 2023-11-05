(function($){

    'use strict';

    var cv = document.getElementById('fileCv'),//from canvas
        ctx = cv.getContext('2d'),//get 2d object
        W, // canvas的width
        H, // canvas的height
        dataURL,
        defaultImageData,
        defaultData; // 上傳檔案時用的資料

    $(document).ready(function(){
        init();
    });

    /**********************************************
     *  初始設定
     **********************************************/
    //operation
    function init(){

        // 上傳圖像
        $('#upload').on('change', upload);

        // 切換radio按鈕執行的效果
        $('input[name="effect"]:radio').on('change', function(e){
            switchRadio(e.currentTarget.value);
        });

        // 若滑桿變化，就進行明暗的操作
        $("#briteness").on('slidechange', function(event, ui) {
            briteness(ui);
        });

        // 將描繪於canvas的image資料儲存為檔案
        $('#save').on('click', saveImg);
    }

    /**********************************************
     *  取得預設的資料
     **********************************************/
    function setDefaultCxData (){
        defaultImageData = ctx.getImageData(0, 0, W, H);
        defaultData      = defaultImageData.data;
    }


    /**********************************************
     *  將透過表單上傳之檔案描繪於 canvas
     **********************************************/
     function drawFile(){
        var imageFile = new Image();

        if(dataURL){
            imageFile.src = dataURL;

            W = cv.width = imageFile.width;
            H = cv.height = imageFile.height;

            imageFile.onload = function(){
                ctx.clearRect(0, 0, W, H);
                ctx.drawImage(imageFile, 0, 0);
                setDefaultCxData();
            };
        }
    }

    /**********************************************
     *  switch effect
     **********************************************/
    function switchRadio(value){

        var imageData = ctx.getImageData(0, 0, W, H),
            data = imageData.data;

            console.log(imageData);

        switch(value){
            case 'reset':
                drawFile();
                break;
            case 'monochrome':
                monochrome(data);
                break;
            case 'sepia':
                sepia(data);
                break;
            case 'reverse':
                reverse(data);
                break;
            default:
                break;
        }

        ctx.putImageData(imageData, 0, 0);
    }


    /**********************************************
     *  file upload
     **********************************************/
    function upload(){

        if (window.File) {
            var reader = new FileReader(),
                file   = this.files[0];

            // 沒有檔案的情況下在此跳出函數
            if (!this.files.length) {
                return;
            }
            // 檔案非圖像資料的情況下在此跳出
            if(!file.type.match(/image\/\w+/)){
                alert('請選擇圖像檔案。');
                return;
            }

            // 把file轉換成Data URL
            reader.readAsDataURL(file);

            reader.onload = function(e){
                dataURL = e.target.result;
                drawFile();
            };
        }
        else {
            alert('此瀏覽器不支援File API');
        }
    }

    /**********************************************
     *  gray effect
     **********************************************/
    function monochrome(data){
        var r,
            g,
            b,
            grayScale;

        for(var i = 0, n = data.length; i < n; i+=4){

            //取得紅．綠．藍的資料（這次不變更透明度）。
            r = data[i];
            g = data[i+1];
            b = data[i+2];

            //灰階化
            grayScale = parseInt(( r*30 + g*59 + b*11 ) / 100);

            // red
            data[i] = grayScale;
            // green
            data[i + 1] = grayScale;
            // blue
            data[i + 2] = grayScale;
        }
    }

    /**********************************************
     *  gray effect
     **********************************************/
    function color(data){
        var r,
            g,
            b;

        for(var i = 0, n = data.length; i < n; i+=4){

            //取得紅．綠．藍的資料（這次不變更透明度）。
            r = data[i];
            g = data[i+1];
            b = data[i+2];

            // red
            data[i] += 20;
            // green
            data[i + 1] -= 10;
            // blue
            data[i + 2] += 30;
        }
    }

    /**********************************************
     *  sepia effect
     **********************************************/
    function sepia(data){
        var r,
            g,
            b,
            grayScale;

        for(var i = 0, n = data.length; i < n; i+=4){

            //取得紅．綠．藍的資料（這次不變更透明度）。
            r = data[i];
            g = data[i+1];
            b = data[i+2];

            // 先灰階化
            grayScale = parseInt(( r*30 + g*59 + b*11 ) / 100);

            // red
            data[i] = (grayScale/255)*290;
            // green
            data[i+1] = (grayScale/255)*200;
            // blue
            data[i+2] = (grayScale/255)*145;
        }

    }

    /**********************************************
     *  reverse effect
     **********************************************/
    function reverse(data){

        for(var i = 0, n = data.length; i < n; i+=4){
            // Red
            data[i] = 255-data[i];
            // Green
            data[i + 1] = 255-data[i+1];
            // Nlue
            data[i + 2] = 255-data[i+2];
        }
    }

    /**********************************************
     *  briteness effect
     **********************************************/
    function briteness(ui){
        var britenessVal = ui.value,
            newImageData = ctx.createImageData(W, H),
            newData = newImageData.data;

        for(var i = 0, n = defaultData.length; i < n; i+=4){

            if( defaultData[i] !== 0 ){
            // Red
            newData[i]   = defaultData[i]   + ( 255 * britenessVal);
            // Green
            newData[i+1] = defaultData[i+1] + ( 255 * britenessVal);
            // Blue
            newData[i+2] = defaultData[i+2] + ( 255 * britenessVal);
            newData[i+3] = 255;
            }
        }
        ctx.putImageData( newImageData, 0, 0);
    }

    /**********************************************
     *  儲存圖像
     **********************************************/
    function saveImg(){
        var a = document.createElement('a');

        a.href = cv.toDataURL();
        a.download = 'result.png'; //決定檔案名稱
        a.click();
    }


})(jQuery);