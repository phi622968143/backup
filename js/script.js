(function($){
    // 在這個封閉的作用域內部，$ 代表 jQuery 函式庫

    $(document).ready(function(){
        // 當整個文件（DOM）載入完成後執行以下程式碼

        $("#changeContent").click(function(){
            // 選取 id 為 "changeContent" 的按鈕，綁定點擊事件處理函式

            $("#targetParagraph").text("點擊後修改了內容！");
            // 選取 id 為 "targetParagraph" 的段落元素，修改其內容
        });
    });

})(jQuery);
