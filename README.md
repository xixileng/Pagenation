# Pagenation
### 纯js无依赖前端分页插件
#### 配置与使用说明：
```javascript
<div id="pageDom"></div>

var pageDom = document.getElementById("pageDom");
pageDom.bindPageEvent({   //通常都是ajax读取到数据后进行事件绑定
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
```
