function SE (opts) {
    // 讀入完成時執行的函數
    this.onload = opts.onload || function () {};

    // 表示是否讀入完成的屬性
    this.isLoaded = false;

    this.initAudio(opts.basename);
}

SE.prototype.initAudio = function (basename) {
    // 確定副檔名
    var ext = this.getSupportedExt();

    if (!ext) {
        // 沒有找到可以播放的副檔名時就終止
        // 在必須有音效的內容中，在此需發出錯誤提示
        // throw new Error('There is no audio types that is supported by this browser.');

        // 這次在不支援 Audio 元素的瀏覽器中就不播放聲音
        // 採取這種簡單的解決方案

        console.error('This browser does\'nt support audio element.');
        return;
    }

    // 確定檔案名稱，建立 Audio 元素
    var filePath = basename + '.' + ext;
    var audio = new Audio(filePath);

    // 讀入時若產生錯誤就終止
    audio.addEventListener('error', function (err) {
        throw new Error('Fail to load audio file("' + filePath + '").');
    });

    // 變成可以播放的狀態就呼叫本身的 onload 方法
    var self = this;
    function loadListener () {
        if (self.isLoaded) {
            return;
        }

        self.isLoaded = true;
        self.onload();
    }
    audio.addEventListener('canplay', loadListener);
    audio.addEventListener('loadeddata', loadListener);

    // 將做好的 Audio 元素作為屬性保存
    this.audio = audio;
};

SE.prototype.getSupportedExt = function () {
    // 可以使用 Audio 元素的檔案的副檔名與檔案類型
    var audioTypes = [{
        type: 'audio/mpeg',
        ext: 'mp3'
    }, {
        type: 'audio/ogg',
        ext: 'ogg'
    }, {
        type: 'audio/wav',
        ext: 'wav'
    }];

    var supported = [];
    var audio = document.createElement('audio');

    // audio 沒有 canPlayType 方法的情況，
    // 就是本來就無法利用 audio 元素
    if (!audio.canPlayType) {
        return null;
    }

    // 判定各個檔案類型是否可以播放
    // 若可播放就將副檔名新增至 supported
    for (var i = 0; i < audioTypes.length; i++) {
        if (audio.canPlayType(audioTypes[i].type)) {
            supported.push(audioTypes[i].ext);
        }
    }

    // 傳回 supported 最開始的一個
    return supported[0] || null;
};


SE.prototype.ring = function () {
    var audio = this.audio;

    // 沒有以 initAudio 建立的 audio 時，終止。
    if (!audio) {
        return;
    }

    // 這個 audio 已經在播放時 = currentTime 比 0 大時，
    // 使播放位置回到開頭
    if (audio.currentTime) {
        audio.currentTime = 0;
    }

    // audio 播放。
    audio.play();
};

$(function () {
    // 是否為智慧型手機之判定
    var isSP = /iPhone|iPad|iPod|Android/.test(navigator.userAgent);


    // 分別取得選單按鈕・其父元素
    var $btnNav = $('.btn-nav');
    var $listNav = $('#list-nav');


    // ========================================================
    //  切換網頁的函數
    //  (由於不是本次主題，因此省略細部解說)
    // ========================================================
    function activatePage (el) {
        var $el = $(el);

        if ($el.hasClass('active')) {
            return;
        }

        var href = $el.attr('href') || '';
        var matchData = href.match(/#([a-z\-]+)$/);
        if (!matchData) {
            return;
        }

        var id = matchData[1];
        var $content = $('#' + id);
        
        $('.btn-nav.active').removeClass('active');
        $el.addClass('active');

        $('.block-content.active').removeClass('active');
        $content.addClass('active');
    }


    // ========================================================
    //  音效的準備
    // ========================================================

    // 滑過音: sounds/hover.mp3、或是sounds/hover.ogg
    var hoverSE = new SE({
        basename: 'sounds/hover',
        onload: initListeners
    });

    // 決定音: sounds/enter.mp3、或是sounds/enter.ogg
    var enterSE = new SE({
        basename: 'sounds/enter',
        onload: initListeners
    });

    // ========================================================
    //  在按鈕設定事件
    // ========================================================

    function initListeners () {
        // 聲音的載入還沒結束的情況下終止
        // 然後在智慧型手機的情況下，由於在呼叫一次 play 之前不會載入
        // 因此即使在尚未 load 的狀態下也姑且往下前進
        if (!isSP && (!hoverSE.isLoaded || !enterSE.isLoaded)) {
            return;
        }


        // ========================================================
        //  以點選事件播放聲音・切換網頁
        // ========================================================

        // 點選按鈕時
        $btnNav.on('click', function (e) {
            e.preventDefault();

            // 已經是 active 的按鈕就什麼也不做
            if ($(this).hasClass('active')) {
                return;
            }

            activatePage(this);

            // 播放決定時的 SE
            enterSE.ring();
        });

        // 滑過按鈕時
        $btnNav.on('mouseover', function () {
            // 即使滑過已經是 active 的按鈕，也什麼都不做
            if ($(this).hasClass('active')) {
                return;
            }

            // 播放滑過時的音效
            hoverSE.ring();
        });


        // ========================================================
        //  觸控事件的支援
        // ========================================================

        // 在 touchstart 與 touchmove 連結聲音播放時
        // →每次拖按按鈕時就播放聲音
        /*
         $btnNav.on('touchstart, touchmove', function () {
         hoverSE.ring();
         });
         */

        // 事件本身貼至父元素
        // 之後取得是在觸碰哪個按鈕，網頁切換後播放聲音
        $listNav.on('touchmove', function (e) {
            e.preventDefault();

            // 從觸碰位置取得在該處之按鈕
            var touch = e.originalEvent.touches[0];
            var el = document.elementFromPoint(touch.pageX, touch.pageY);

            if (!$(el).hasClass('btn-nav')) {
                // 如果取得不是按鈕的元素就終止
                return;
            }

            if ($(el).hasClass('active')) {
                return;
            }

            activatePage(el);

            // 播放滑過時的音效
            hoverSE.ring();
        });
    }

    initListeners();
});
