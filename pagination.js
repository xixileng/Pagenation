/**
 * @author: 小冷
 * @date: 2018-02-04
 * @version: v1.0
 * @description: 请务必保留作者、日期及版本号，有意见或建议欢迎联系我：896054682（备注来意）
 */
/**
配置与使用说明：
<div id="pageDom"></div>

var pageDom = document.getElementById("pageDom");
pagination.bindPageEvent(pageDom, {   //通常都是ajax读取到数据后进行事件绑定
    param:{   //*必填，列表查询参数
        pageIndex:1,  //*必填，查询页码
        pageSize:5   //*必填，查询单页数量
    },
    total:100,  //*必填，数据总量
    callback:function(index,size){    //选填，分页回调函数,返回index：当前页页码，size：每页显示条数，建议填写
        console.log("当前页页码："+index,"每页显示条数："+size)
    },  
    countList:[5,10,15,20],  //选填，列表查询参数
    defaultCount:10,  //选填，每页显示数据量，默认5
    openCountSelect:true,    //选填，开启每页显示下拉选择，默认开启
    openSkip:true,  //选填，开启页面跳转功能，默认开启
    openPN:true,    //选填，开启上一页下一页按钮，默认开启
    openFL:true    //选填，开启第一页最后一页按钮，默认开启
    }
);
 */

!(function () {
  var option;
  var pagination = {};
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = pagination;
    }
    exports.pagination = pagination;
  } else {
    window.pagination = pagination;
  }
	pagination.VERSION = '1.0.0';
  pagination.bindPageEvent = function (page, userOption) {
    if (typeof userOption !== "object") {
      console.error("*--请正确填写配置--*")
    }
    option = userOption || {};
    option.param = option.param || {},    //列表查询参数
      option.param.pageIndex = option.param.pageIndex || 0,    //列表查询参数
      option.param.pageSize = option.param.pageSize || 1,    //列表查询参数
      option.total = option.total || 0,     //数据总量
      option.callback = option.callback || defaultEvent,    //分页回调函数
      option.countList = option.countList || [],    //列表查询参数
      option.defaultCount = option.defaultCount || 5,    //每页显示数据量
      option.openCountSelect = option.openCountSelect || true,    //开启下拉选择
      option.openSkip = option.openSkip || true;    //开启跳转
    option.pageCount = Math.ceil(option.total / option.param.pageSize);
    initPageDom(page);   //根据配置初始化DOM
    initPageStyle(page);    //初始化样式，可自行覆盖   
  }

  function initPageDom(page) {
    if (option.openCountSelect) {
      initCountSelect(page);
    }
    initPageUl(page);
    initTotalSpan(page);
    if (option.openSkip) {
      initSkip(page);
    }
  }

  function initCountSelect(page) {
    var countList = option.countList;
    var select = document.createElement("select");
    select.id = "pageSelect";
    select.style.cssText = "height:31px;border-radius:5px;border-color:rgb(221, 221, 221);";
    var op = null;
    for (var i = 0; i < countList.length; i++) {
      op = document.createElement("option");
      op.value = parseInt(countList[i]);
      op.innerText = parseInt(countList[i]) + "条/页";
      select.appendChild(op);
    }
    bindSelectEvent(select);
    page.appendChild(select);
  }

  function bindSelectEvent(select) {
    select.onchange = function () {
      option.param.pageSize = parseInt(this.options[this.selectedIndex].value);
      option.pageCount = Math.ceil(option.total / option.param.pageSize);
      var ul = document.getElementById("pageUl");
      createPageButton(ul);
      ul.querySelector(".num").click();
      initTotal();
      option.callback(option.param.pageIndex, option.param.pageSize);
    }
  }

  function initPageUl(page) {
    var ul = createPageUl();
    createPageButton(ul);
    page.appendChild(ul);
    bindUlEvent(ul);
    ul.querySelector(".num").click();
  }

  function createPageUl() {
    var ul = document.createElement("ul");
    ul.id = "pageUl";
    ul.style.cssText = "display:inline-block;list-style:none;margin:0 5px;padding:0;";
    return ul;
  }

  function createPageButton(ul) {
    ul.innerHTML = "";
    var pageNum, pageCount = option.pageCount;
    for (var i = 0; i < Math.min(option.defaultCount, pageCount); i++) {
      pageNum = document.createElement("li");
      pageNum.className = "numLi";
      pageNum.innerText = i + 1;
      pageNum.id = "numLi" + (i + 1);
      ul.appendChild(pageNum);
    }
    if (option.openPN) {
      var pre = document.createElement("li"),
        next = document.createElement("li");
      pre.innerText = "上一页";
      pre.className = "preLi";
      next.innerText = "下一页";
      next.className = "nextLi";
      ul.insertBefore(pre, ul.firstChild);
      ul.appendChild(next);
    }
    if (option.openFL) {
      var first = document.createElement("li"),
        last = document.createElement("li");
      first.innerText = "首页";
      first.className = "firstLi";
      last.innerText = "尾页";
      last.className = "lastLi";
      ul.insertBefore(first, ul.firstChild);
      ul.appendChild(last);
    }
    var ele;
    for (var j = 0; j < ul.childNodes.length; j++) {
      ele = ul.childNodes[j];
      ele.style.cssText = "display:inline-block;margin:0;padding:0;";
      ele.innerHTML = "<a href='javascript:void(0)' id='" + (ele.id ? ele.id.match(/\d+$/)[0] : "") + "' class='" + ele.className.slice(0, -2) + "' style='color:black;text-decoration:none;"
        + "padding:5px 10px;margin-left:-1px;border:1px solid rgb(221, 221, 221);'>" + ele.innerText + "</a>";
    }
    var firstChild = ul.firstChild.firstChild.style;
    var lastChild = ul.lastChild.firstChild.style;
    firstChild.borderTopLeftRadius = firstChild.borderBottomLeftRadius =
      lastChild.borderTopRightRadius = lastChild.borderBottomRightRadius = "5px";
  }

  function bindUlEvent(ul) {
    ul.onmouseover = function (e) {
      var target = e.target;
      if (!hasClass(target, "disable") && !hasClass(target, "active")) {
        target.style.backgroundColor = "#d4f1ff";
        target.style.color = "#FFF";
      }
    }
    ul.onmouseout = function (e) {
      var target = e.target;
      if (!hasClass(target, "disable") && !hasClass(target, "active")) {
        target.style.backgroundColor = "";
        target.style.color = "#000";
      }
    }
    ul.onclick = function (e) {
      var index = option.param.pageIndex,
        size = option.param.pageSize;
      var target = e.target;
      switch (target.className) {
        case "first":
          toFirst(ul);
          break;
        case "last":
          toLast(ul);
          break;
        case "pre":
          toPre(ul);
          break;
        case "next":
          toNext(ul);
          break;
        case "num":
          clearUlStyle(ul);
          index = toNum(target, index);
          changeNum(ul, index);
          option.callback(index, size);
          break;
        default: return;
      }
    }
  }

  function clearUlStyle(ul) {
    var num = ul.querySelectorAll("a");
    for (var n = 0; n < num.length; n++) {
      num[n].style.backgroundColor = "";
      num[n].style.color = "#000";
      num[n].style.cursor = "pointer";
    }
    var active = ul.querySelectorAll(".active");
    var disable = ul.querySelectorAll(".disable");
    if (active) {
      for (var i in active) {
        removeClass(active[i], "active");
      }
    }
    if (disable) {
      for (var i in disable) {
        removeClass(disable[i], "disable");
      }
    }
  }

  function toFirst(ul) {
    var num = ul.querySelectorAll(".num");
    for (var i = 0; i < num.length; i++) {
      num[i].innerText = i + 1;
    }
    num[0].click();
  }
  function toLast(ul) {
    var num = ul.querySelectorAll(".num");
    var pageCount = option.pageCount;
    for (var i = num.length - 1; i >= 0; i--) {
      num[i].innerText = pageCount--;
    }
    num[num.length - 1].click();
  }
  function toPre(ul) {
    var active = getDom(ul, ".active");
    active ? removeClass(active, "active") : "";
    active ? active.parentNode.previousSibling.firstChild.click() : "";
  }
  function toNext(ul) {
    var active = getDom(ul, ".active");
    active ? removeClass(active, "active") : "";
    active ? active.parentNode.nextSibling.firstChild.click() : "";
  }
  function toNum(target, index) {
    index = parseInt(target.innerText);
    addClass(target, "active");
    var style = target.style;
    style.backgroundColor = "#d4f1ff";
    style.color = "#FFF";
    style.cursor = "default";
    return index;
  }

  function changeNum(ul, index) {
    var num = ul.querySelectorAll(".num"),
      length = num.length,
      count = length % 2 === 0 ? length / 2 + 1 : Math.ceil(length / 2),
      pageCount = option.pageCount,
      active = getDom(ul, ".active"),
      id = parseInt(active.id),
      first = parseInt(num[0].innerText),
      last = parseInt(num[length - 1].innerText);
    if (id > count) {
      if (last < pageCount) {
        clearUlStyle(ul);
        for (var i = 0; i < num.length; i++) {
          num[i].innerText = parseInt(num[i].innerText) + Math.min(id - count, pageCount - last);
        }
        toNum(num[Math.max(count - 1, id - (pageCount - last) - 1)], index);
      }
    } else if (id < count) {
      if (first > 1) {
        clearUlStyle(ul);
        for (var j = 0; j < num.length; j++) {
          num[j].innerText = parseInt(num[j].innerText) - Math.min(count - id, first - 1);
        }
        toNum(num[Math.min(count - 1, id + (first - 1) - 1)], index);
      }
    }
    if (index === 1) {
      disable([getDom(ul, ".first"), getDom(ul, ".pre")])
    } else if (index === option.pageCount) {
      disable([getDom(ul, ".last"), getDom(ul, ".next")])
    }
  }

  function disable(nodes) {
    for (var i in nodes) {
      addClass(nodes[i], "disable");
      var style = nodes[i].style;
      style.color = "gainsboro";
      style.cursor = "default";
    }
  }

  function initTotalSpan(page) {
    var total = document.createElement("span");
    total.id = "total";
    page.appendChild(total);
    initTotal();
  }

  function initTotal() {
    var total = document.getElementById("total");
    total.innerHTML = "&nbsp;共" + option.pageCount + "页&nbsp;&nbsp;";
  }

  function initSkip(page) {
    var skip = document.createElement("input");
    skip.type = "number";
    skip.style.cssText = "height:23px;width:40px;border-width:1px;border-radius:5px;margin:0 3px;";
    var btn = document.createElement("button");
    btn.style.cssText = "padding:3px 8px;cursor:pointer;border-width:1px;border-radius:3px;background-color: rgb(250, 250, 250);";
    btn.innerText = "跳转";
    bindSkipEvent(skip, btn);
    page.appendChild(skip);
    page.appendChild(btn);
  }
  function bindSkipEvent(skip, btn) {
    btn.onclick = function () {
      var index = skip.value;
      if (!/^\d+$/.test(index)) {
        alert("请输入正确数字！");
        return;
      }
      index = parseInt(index);
      if (index > option.pageCount || index < 1) {
        alert("输入页码超出范围！");
        return;
      }
      var ul = document.getElementById("pageUl");
      clearUlStyle(ul);
      var num = ul.querySelectorAll(".num"),
        length = num.length, id;
      if (index + length <= option.pageCount) {
        for (var i = 0; i < length; i++) {
          num[i].innerText = index + i;
          id = 0;
        }
      } else {
        var count = option.pageCount - index;
        for (var j = 0; j < length; j++) {
          num[j].innerText = (index + count - length + 1) + j;
          if ((index + count - length + 1) + j === index) {
            id = j;
          }
        }
      }
      num[id].click();
    }
  }

  function initPageStyle(page) {
    page.style.cssText = "display:inline-block;font-size:14px;margin:0 auto;";
  }

  function getDom(ele, selector) {
    return ele.querySelector(selector);
  }

  function defaultEvent() {
    console.warn("!--推荐绑定自定义事件--!")
  }


  /*
  *这段是原生js实现的addClass, removeClass, hasClass函数功能
  *参考来源：http://www.jb51.net/article/83101.htm
  */
  function addClass(obj, cls) {
    var obj_class = obj.className,//获取 class 内容.
      blank = (obj_class != '') ? ' ' : '';//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
    added = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.
    obj.className = added;//替换原来的 class.
  }

  function removeClass(obj, cls) {
    var obj_class = ' ' + obj.className + ' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' '),//将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
      removed = obj_class.replace(' ' + cls + ' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed;//替换原来的 class.
  }

  function hasClass(obj, cls) {
    var obj_class = obj.className,//获取 class 内容.
      obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.
    x = 0;
    for (x in obj_class_lst) {
      if (obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
        return true;
      }
    }
    return false;
  }
})()
