function Index(param) {
    this.dom = {
        btnStart: $('.start'),
        imgArea: $('.imgArea')
    };
    this.obj = {
        imgOrigArr: [],//图片拆分后，存储正确排序的数组
        imgRanArr: [],//图片顺序打乱后，存储当前排序的数组
        imgWidth: parseInt(this.dom.imgArea.css('width')),
        imgHeight: parseInt(this.dom.imgArea.css('height')),
    };
    this.cell = {
        cellWidth: this.obj.imgWidth / degree,
        cellHeight: this.obj.imgHeight / degree,
    }
    this.img = param.img;
    this.hasStart = false;
    this.moveTime = 400;
    this.init();
}
Index.prototype.init = function () {
    this.imgSplit();
    this.gameState();
};
Index.prototype.imgSplit = function () {
    var self = this;
    self.obj.imgOrigArr = [];
    self.dom.imgArea.html('');
    var cell = '';
    var pic_num=0;
    for (var i = 0; i < degree; i++) {
        for (var j = 0; j <degree; j++) {
            self.obj.imgOrigArr.push(i * degree + j);
            cell = document.createElement('div');
            $(cell).attr('class', 'imgCell');
            
            $(cell).css({
                'width': self.cell.cellWidth + 'px',
                'height': self.cell.cellHeight + 'px',
                'left': j * self.cell.cellWidth + 'px',
                'top': i * self.cell.cellHeight + 'px',
                'background': "url('" + self.img + "')",
                'backgroundPosition': (-j) * self.cell.cellWidth + 'px ' + (-i) * self.cell.cellHeight + 'px',
            });
            self.dom.imgArea.append(cell);
        }
    }
 
    self.dom.imgCell = $('.imgCell');
};
Index.prototype.gameState = function () {
    var self = this;
    self.dom.btnStart.bind('click', function () {
        if (!self.hasStart) {
            $(this).text('复原');
            self.hasStart = true;
            self.randomArr();
            self.cellOrder(self.obj.imgRanArr);
            self.dom.imgCell.css({
                'cursor': 'pointer'
            }).bind('mouseover', function () {
                $(this).addClass('hover');
            }).bind('mouseout', function () {
                $(this).removeClass('hover');
            }).bind('mousedown', function (e) {
                $(this).css('cursor', 'move');
                var cellIndex1 = $(this).index();
                var cellX = e.pageX - self.dom.imgCell.eq(cellIndex1).offset().left;
                var cellY = e.pageY - self.dom.imgCell.eq(cellIndex1).offset().top;
                $(document).bind('mousemove', function (e2) {
                    self.dom.imgCell.eq(cellIndex1).css({
                        'z-index': '40',
                        'left': (e2.pageX - cellX - self.dom.imgArea.offset().left) + 'px',
                        'top': (e2.pageY - cellY - self.dom.imgArea.offset().top) + 'px',
                    });
                }).bind('mouseup', function (e3) {
                    var cellIndex2 = self.changeIndex((e3.pageX - self.dom.imgArea.offset().left), (e3.pageY - self.dom.imgArea.offset().top), cellIndex1);
                    if (cellIndex1 == cellIndex2) {
                        self.cellReturn(cellIndex1);
                    }
                    /*else if(Math.abs(cellIndex2-cellIndex1)>1)
                    {
                    	 self.cellReturn(cellIndex1);
                    }*/
                    else {
                        self.cellChange(cellIndex1, cellIndex2);
                    }
                    $(document).unbind('mousemove').unbind('mouseup');
                });
            }).bind('mouseup', function () {
                $(this).css('cursor', 'pointer')
            });
        } else {
            $(this).text('开始');
            self.hasStart = false;
            self.cellOrder(self.obj.imgOrigArr);
            self.dom.imgCell.css('cursor','default').unbind('mouseover').unbind('mousedown').unbind('mouseup');
        }
    })
}

Index.prototype.randomArr = function () {
    this.obj.imgRanArr = [];
    var len = this.obj.imgOrigArr.length;
    var order;
    for (var i = 0; i < len; i++) {
        order = Math.floor(Math.random() * len);
        if (this.obj.imgRanArr.length > 0) {
            while (jQuery.inArray(order, this.obj.imgRanArr) > -1) {
                order = Math.floor(Math.random() * len);
            }
        }
        this.obj.imgRanArr.push(order);
    }
    return;
};

Index.prototype.cellOrder = function (arr) {
    var self = this;
    for (var i = 0; i < arr.length; i++) {
        self.dom.imgCell.eq(i).animate({
            'left': arr[i] % degree * self.cell.cellWidth + 'px',
            'top': Math.floor(arr[i] / degree) * self.cell.cellHeight + 'px',
        }, self.moveTime);
    }
};

Index.prototype.changeIndex = function (x, y, orig) {
    var self = this;
    if (x < 0 || x > self.obj.imgWidth || y < 0 || y > self.obj.imgHeight) {
        return orig;
    }
    var row = Math.floor(y / self.cell.cellHeight),
        col = Math.floor(x / self.cell.cellWidth),
        location = row * degree + col;
    var i = 0, len = self.obj.imgRanArr.length;
    while ((i < len) && (self.obj.imgRanArr[i] !== location)) {
        i++;
    }
    return i;
}
Index.prototype.cellReturn = function (index) {
    var row = Math.floor(this.obj.imgRanArr[index] / degree),
        col = this.obj.imgRanArr[index] % degree;
    this.dom.imgCell.eq(index).animate({
        'top': row * this.cell.cellHeight + 'px',
        'left': col * this.cell.cellWidth + 'px',
    }, this.moveTime, function () {
        $(this).css('z-index', '10');
    });
}

Index.prototype.cellChange = function (from, to) {
    var self = this;
    var rowFrom = Math.floor(this.obj.imgRanArr[from] / degree),
        colFrom = this.obj.imgRanArr[from] % degree,
        rowTo = Math.floor(this.obj.imgRanArr[to] / degree),
        colTo = this.obj.imgRanArr[to] % degree,
        temp = this.obj.imgRanArr[from];
    this.dom.imgCell.eq(from).animate({
        'top': rowTo * this.cell.cellHeight + 'px',
        'left': colTo * this.cell.cellWidth + 'px',
    }, this.moveTime, function () {
        $(this).css('z-index', '10');
    });
    this.dom.imgCell.eq(to).animate({
        'top': rowFrom * this.cell.cellHeight + 'px',
        'left': colFrom * this.cell.cellWidth + 'px',
    }, this.moveTime, function () {
        $(this).css('z-index', '10');
        self.obj.imgRanArr[from] = self.obj.imgRanArr[to];
        self.obj.imgRanArr[to] = temp;
        if (self.checkPass(self.obj.imgOrigArr, self.obj.imgRanArr)) {
            self.sucess();
        }
    })
}
Index.prototype.checkPass = function (rightArr, puzzleArr) {
    if (rightArr.toString() == puzzleArr.toString()) {
        return true;
    } else {
        return false;
    }
};
Index.prototype.sucess = function () {
    for (var i = 0; i < this.obj.imgOrigArr.length; i++) {
        if (this.dom.imgCell.eq(i).has('hover')) {
            this.dom.imgCell.eq(i).removeClass('hover')
        }
    }
    this.dom.imgCell.css('cursor','default').unbind('mouseover').unbind('mousedown').unbind('mouseup');
    this.dom.btnStart.text('开始');
    this.hasStart = false;
    alert('你真棒！');
};
new Index({ 'img': 'blank.jpg' });
function add(){
	if(degree>=10)
	
	{alert("该游戏已经满足不了你了！")}
	else{
	degree++;
	new Index({ 'img': 'blank.jpg' });
	}
	
};
function sub(){
	if(degree<=3)
	
	{alert("对不起，已经是最低难度！")}
	else{
	degree--;
	new Index({ 'img': 'blank.jpg' });
	}
	
};
