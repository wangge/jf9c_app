var page = paged;
var curpage = 1;
var hasMore = true;
var reset = true;
var orderKey = '';

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
	if (getQueryString('data-state') != '') {
	    $('#filtrate_ul').find('li').has('a[data-state="' + getQueryString('data-state')  + '"]').addClass('selected').siblings().removeClass("selected");
	}

    $('#search_btn').click(function(){
        reset = true;
    	initPage();
    });

    $('#fixed_nav').waypoint(function() {
        $('#fixed_nav').toggleClass('fixed');
    }, {
        offset: '50'
    });

	function initPage(){
	    if (reset) {
	        curpage = 1;
	        hasMore = true;
	    }
        $('.loading').remove();
        if (!hasMore) {
            return false;
        }
        hasMore = false;
	    var state_type = $('#filtrate_ul').find('.selected').find('a').attr('data-state');
	    var orderKey = $('#order_key').val();
		$.ajax({
			type:'post',
			url:MapiUrl+"/index.php?w=member_order&t=order_list&page="+page+"&curpage="+curpage,
			data:{key:key, state_type:state_type, order_key : orderKey},
			dataType:'json',
			success:function(result){
				checkLogin(result.login);//检测是否登录了
				curpage++;
                hasMore = result.hasmore;
                if (result.datas.order_group_list.length <= 0) {
                    $('#footer').addClass('posa');
                } else {
                    $('#footer').removeClass('posa');
                }
				var data = result;
				data.MUrl = MUrl;//页面地址
				data.MapiUrl = MapiUrl;
				data.key = $api.getStorage('key');
				template.helper('$getLocalTime', function (nS) {
                    var d = new Date(parseInt(nS) * 1000);
                    var s = '';
                    s += d.getFullYear() + '年';
                    s += (d.getMonth() + 1) + '月';
                    s += d.getDate() + '日 ';
                    s += d.getHours() + ':';
                    s += d.getMinutes();
                    return s;
				});
                template.helper('p2f', function(s) {
                    return (parseFloat(s) || 0).toFixed(2);
                });
                template.helper('parseInt', function(s) {
                    return parseInt(s);
                });
                var pay = getQueryString("pay");
                if(pay == 'wxpay_jsapi' || pay == 'wxpay_h5' || pay == 'mini_wxpay') {//微信支付时判断是否是拼团订单
                    if (result.datas.order_group_list.length > 0){
                        var order = result.datas.order_group_list[0].order_list[0];
                        if (order.order_type==4){
                            var pingou_info = order.pingou_info;
                            var pingou_id = pingou_info.log_id;
                            location.href = '../pingou_info.html?pingou_id=' + pingou_id +'&buyer_id=' + pingou_info.buyer_id;
                        }
                    }
                }
				var html = template.render('order-list-tmpl', data);
				if (reset) {
				    reset = false;
				    $("#order-list").html(html);
				} else {
                    $("#order-list").append(html);
                }
			}
		});

	}


    // 取消
    $('#order-list').on('click','.cancel-order', cancelOrder);
    // 删除
    $('#order-list').on('click','.delete-order',deleteOrder);
    // 收货
    $('#order-list').on('click','.sure-order',sureOrder);
    // 评价
    $('#order-list').on('click','.evaluation-order',evaluationOrder);
    // 追评
    $('#order-list').on('click','.evaluation-again-order', evaluationAgainOrder);

    $('#order-list').on('click','.viewdelivery-order',viewOrderDelivery);

    $('#order-list').on('click','.check-payment',function() {
        var pay_sn = $(this).attr('data-paySn');
        toPay(pay_sn,'member_buy','pay');
        return false;
    });

    //取消订单
    function cancelOrder(){
        var order_id = $(this).attr("order_id");

        $.sDialog({
            content: '确定取消订单？',
            okFn: function() { cancelOrderId(order_id); }
        });
    }

    function cancelOrderId(order_id) {
        $.ajax({
            type:"post",
            url:MapiUrl+"/index.php?w=member_order&t=order_cancel",
            data:{order_id:order_id,key:key},
            dataType:"json",
            success:function(result){
                if(result.datas && result.datas == 1){
                    reset = true;
                    initPage();
                } else {
                    $.sDialog({
                        skin:"red",
                        content:result.datas.error,
                        okBtn:false,
                        cancelBtn:false
                    });
                }
            }
        });
    }

    //删除订单
    function deleteOrder(){
        var order_id = $(this).attr("order_id");

        $.sDialog({
            content: '是否移除订单？<h6>电脑端订单回收站可找回订单！</h6>',
            okFn: function() { deleteOrderId(order_id); }
        });
    }

    function deleteOrderId(order_id) {
        $.ajax({
            type:"post",
            url:MapiUrl+"/index.php?w=member_order&t=order_delete",
            data:{order_id:order_id,key:key},
            dataType:"json",
            success:function(result){
                if(result.datas && result.datas == 1){
                    reset = true;
                    initPage();
                } else {
                    $.sDialog({
                        skin:"red",
                        content:result.datas.error,
                        okBtn:false,
                        cancelBtn:false
                    });
                }
            }
        });
    }

    //确认订单
    function sureOrder(){
        var order_id = $(this).attr("order_id");

        $.sDialog({
            content: '确定收到了货物吗？',
            okFn: function() { sureOrderId(order_id); }
        });
    }

    function sureOrderId(order_id) {
        $.ajax({
            type:"post",
            url:MapiUrl+"/index.php?w=member_order&t=order_receive",
            data:{order_id:order_id,key:key},
            dataType:"json",
            success:function(result){
                if(result.datas && result.datas == 1){
                    reset = true;
                    initPage();
                } else {
                    $.sDialog({
                        skin:"red",
                        content:result.datas.error,
                        okBtn:false,
                        cancelBtn:false
                    });
                }
            }
        });
    }

    // 评价
    function evaluationOrder() {
        var orderId = $(this).attr('order_id');
        location.href = 'member_evaluation.html?order_id=' + orderId;

    }

    // 追加评价
    function evaluationAgainOrder() {
        var orderId = $(this).attr('order_id');
        location.href = 'member_evaluation_again.html?order_id=' + orderId;
    }

    function viewOrderDelivery() {
        var orderId = $(this).attr('order_id');
        location.href = 'order_delivery.html?order_id=' + orderId;
    }

    $('#filtrate_ul').find('a').click(function(){
        $('#filtrate_ul').find('li').removeClass('selected');
        $(this).parent().addClass('selected').siblings().removeClass("selected");
        reset = true;
        window.scrollTo(0,0);
        initPage();
    });

    //初始化页面
    initPage();
    $(window).scroll(function(){
        if(($(window).scrollTop() + $(window).height() > $(document).height()-1)){
            initPage();
        }
    });
});
