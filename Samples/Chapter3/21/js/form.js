function OrderInput (opts) {
    this.$list = opts.$list;

    this.initSortable();
    this.initInput();
    this.initAddBtn();

    this.updateInput();
}

// 對 jQuery UI 的 Sortable 進行初始化・事件設定
OrderInput.prototype.initSortable = function () {
    var self = this;
    var $list = this.$list;

    $list.sortable({
        update: function () {
            self.updateInput();
        }
    });
};

// input 元素的取得
OrderInput.prototype.initInput = function () {
    var $list = this.$list;

    var orderName = $list.attr('data-order-name');
    if (!orderName) {
        console.error('找不到用於 OrderInput 的 input 元素。');
        return;
    }

    var $input = $('input[name="' + orderName + '"]');
    this.$input = $input;
};

// 準備「新增」按鈕
OrderInput.prototype.initAddBtn = function () {
    var $addBtn = $('<input type="button" value="新增"/>');

    var self = this;
    $addBtn.on('click', function () {
        var name = window.prompt('成員姓名');
        if (!name) {
            return;
        }
        self.add(name);
    });

    this.$list.before($addBtn);
    this.$addBtn = $addBtn;
};

// 新增元素至 Sortable
OrderInput.prototype.add = function (name) {
    var $list = this.$list;
    $list.prepend($(['<li>', name, '</li>'].join('')));

    this.updateInput();
};

// 使 Sortable 的順序反應在 input 元素値
OrderInput.prototype.updateInput = function () {
    var $list = this.$list;
    var $input = this.$input;

    if (!$input) {
        return;
    }

    var items = [];
    $list.children().each(function () {
        var $item = $(this);
        items.push($item.attr('data-order-value') || $item.text());
    });
    $input.val(items.join(','));

    $input.change();
};

function FileInput (opts) {
    // input 元素（即使是 jQuery 物件的狀態也加以保持）
    var input = opts.input;
    var $input = $(input);


    // ===================================================================
    // 選取檔案的預覽功能
    // ===================================================================

    // 準備作為預覽顯示用的 img 元素
    var $img = $('<img />').attr({
        'class': 'form__preview',
        src: 'img/noimage.gif',
        alt: '預覽'
    });
    $input.after($img);

    // 這個功能不是在可以使用 FileReader(File API) 的瀏覽器中就不會動作
    // 因此在無法存取 FileReader 的情況下，在此結束處理
    if (!FileReader) {
        console.error('本瀏覽器似乎不支援 FileAPI。');
        return;
    }

    // 抽出 input 中設定的圖片，以 img 元素顯示
    function updatePreview () {
        // 若沒有選取的圖片就結束
        if (!input.files.length) { 
            return;
        }

        // FileReader 的建立
        var reader = new FileReader();

        // 在這之後的 readAsDataURL 完成的時間點，
        // 設定 $img 選擇的圖片
        reader.onload = function (e) {
            $img.attr('src', e.target.result);
        };

        // 將圖片檔案轉換成 dataURL
        reader.readAsDataURL(input.files[0]);
    }

    // 每次 input 的值被選擇時，呼叫 updatePreview
    $input.on('change', updatePreview);

    // 透過回上一頁等來到網頁時，也有一開始就選擇好檔案的情況，
    // 因此在次執行 updatePreview
    updatePreview();


    // ===================================================================
    // 設定為也能透過拖放指定檔案
    // ===================================================================

    $img
        .on('dragenter', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $img.attr('class', 'form__preview--drag');
        })
        .on('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
        })
        .on('dragleave', function () {
            $img.attr('class', 'form__preview');
        })
        .on('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var dataTransfer = e.originalEvent.dataTransfer;
            if (!dataTransfer || !dataTransfer.files.length) {
                return;
            }

            input.files = dataTransfer.files;

            $img.attr('class', 'form__preview');
        });
}

function LabeledRangeInput (opts) {
    this.$el = opts.$el;
    this.labels = opts.labels;

    this.initLabel();
    this.updateLabel();

    this.initListeners();
}

LabeledRangeInput.prototype.initLabel = function () {
    var $el = this.$el;
    var $label = $('<label class="form__input__label"/>');
    $el.after($label);
    this.$label = $label;
};

LabeledRangeInput.prototype.updateLabel = function () {
    var $el = this.$el;
    var label = this.labels[$el.val()] || '';
    this.$label.text(label);
};

LabeledRangeInput.prototype.initListeners = function () {
    var self = this;
    var $el = this.$el;

    $el.on('change', function () {
        self.updateLabel();
    });
};

function FormSection (opts) {
    this.$el = opts.$el || $('<div />');
    this.prev = opts.prev || null;

    this.passed = false;
    this.$input = this.$el.find('.form__input input');
    this.$header = this.$el.find('.form__header');

    if (this.prev) {
        this.prev.next = this;
    }

    this.initCheck();
    this.updateCheck();

    this.initListeners();
    this.hide();
}

// 事件監聽器的初始化
FormSection.prototype.initListeners = function () {
    var self = this;
    var $input = this.$input;

    $input.on('change', function () {
        self.updateCheck();

        if (!self.passed && self.filled()) {
            self.passed = true;
            self.showNext();
        }
    });
};

// 顯示是否輸入完成的元素
FormSection.prototype.initCheck = function () {
    var $check = $('<div />');
    if (this.$header) {
        this.$header.append($check);
    }
    this.$check = $check;
};

// 更新顯示是否輸入完成的元素
FormSection.prototype.updateCheck = function () {
    var $check = this.$check;
    var isFilled = this.filled();

    $check.attr('class', isFilled ? 'form__check--filled' : 'form__check');
};

// 確認本身持有的 input 元素是否輸入完畢
FormSection.prototype.filled = function () {
    var $input = this.$input;
    var value = $input.val();
    var type = $input.attr('type');

    // 僅限 number 的 input，將值做為數值評估
    // (=> 0的情況下為 false)
    if (type == 'number') {
        value = Number(value);
    }

    // 藉由加上 2 次否定，傳回真假值
    return !!value; 
};

// 顯示自己的下一個區段
FormSection.prototype.showNext = function () {
    // 若沒有設定下一個區段就不做任何事
    if (!this.next) {
        return;
    }

    var next = this.next;
    next.show(function () {
        if (next.filled()) {
            next.showNext();
        }
    });
};

// 顯示此區段
FormSection.prototype.show = function (callback) {
    var $el = this.$el;

    // 有 callback 的情況下，附帶動畫顯示
    if (callback) {
        $el.slideDown(callback);
    } else {
        $el.show();
    }
};

// 隱藏此區段
FormSection.prototype.hide = function (callback) {
    var $el = this.$el;

    // 有 callback 的情況下，附帶動畫隱藏
    if (callback) {
        $el.slideUp(callback);
    } else {
        $el.hide();
    }
};

function FormManager ($el, selector) {
    this.$el = $el;

    this.initSections($el.find(selector));
    this.initListeners();
}

// FormSection 的初始化
FormManager.prototype.initSections = function ($sections) {
    var sections = [];
    $sections.each(function (index) {
        sections.push(new FormSection({
            $el: $(this),
            prev: sections[index - 1] || null
        }));
    });

    // 最開始的區段預設為顯示
    var firstSection = sections[0];
    firstSection.show();

    // 表單送出後，以瀏覽器的「回上一頁」再次顯示等情況下，
    // 如果最開始的區段已輸入完成，也顯示下一個區段
    if (firstSection.filled()) {
        firstSection.showNext();
    }

    this.sections = sections;
};

FormManager.prototype.initListeners = function () {
    var self = this;
    var $el = this.$el;

    // 所有輸入尚未完成時送出的情況下，取消送出
    $el.on('submit', function (e) {
        if (!self.filled()) {
            alert('還有尚未輸入完畢的項目。');
            e.preventDefault();
        }
    });
};

// 在自己裡面的 FormSection 全部輸入完成的話就傳回 true
FormManager.prototype.filled = function () {
    var sections = this.sections;

    var isValid = true;
    $.each(sections, function (index, section) {
        isValid = section.filled() && isValid;
    });

    return isValid; 
};

$(function () {
    // 管理表單全體流程的 manager
    new FormManager($('#form'), '.form__section');


    // 帶標籤的 range 表單
    new LabeledRangeInput({
        $el: $('.form__section input[name="size"]'),
        labels: ['SS', 'S', 'M', 'L', 'XL']
    });


    // 附帶預覽・可拖放的上傳表單
    var $imageInput = $('.form__section input[name="image"]');
    new FileInput({
        input: $imageInput.get(0)
    });


    // 設定元素順序的表單
    new OrderInput({
        $list: $('.form__input__order')
    });
});
