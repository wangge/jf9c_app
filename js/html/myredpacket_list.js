apiready=function(){
    //监听返回事件
    api.addEventListener({
        name: 'LoginTo'
    }, function(ret, err) {
        location.reload();
    });
}
$(function() {
    var key = $api.getStorage('key');
    if (!key) {
        window.location.href = 'login.html';
        return false;
    }
	var page = paged;
	var curpage = 1;
	var hasMore = true;

    var readytopay = false;

	function initPage(page,curpage){
		var key = $api.getStorage("key");
		if(!key){
			window.location.href = 'login.html';
			return false;
		}
		$.ajax({
			type:'post',
			url:MapiUrl+"/index.php?w=member_coupon&t=index&page="+page+"&curpage="+curpage,
			data:{key:key},
			dataType:'json',
			success:function(result){
				//checklogin(result.login);//检测是否登录了
				var data = result.datas;
				data.hasmore = result.hasmore;//是不是可以用下一页的功能，传到页面里去判断下一页是否可以用
				data.MUrl = MUrl;//页面地址
				data.curpage = curpage;//当前页，判断是否上一页的disabled是否显示
				data.MapiUrl = MapiUrl;
				data.key = $api.getStorage("key");

				var html = template.render('order-list-tmpl', data);
				$("#order-list").html(html);


				//下一页
				$(".next-page").click(nextPage);
				//上一页
				$(".pre-page").click(prePage);

                $(window).scrollTop(0);
			}
		});
	}
	//初始化页面
	initPage(page,curpage);

	//下一页
	function nextPage (){
		var self = $(this);
		var hasMore = self.attr("has_more");
		if(hasMore == "true"){
			curpage = curpage+1;
			initPage(page,curpage);
		}
	}
	//上一页
	function prePage (){
		var self = $(this);
		if(curpage >1){
			self.removeClass("disabled");
			curpage = curpage-1;
			initPage(page,curpage);
		}
	}

   
});
