$(function (){
//by shopwt invite
var key = $api.getStorage('key');
var wx_share = 0;
var ua = navigator.userAgent.toLowerCase();
if (ua.indexOf('micromessenger') > -1) {
    wx_share = 1;
    loadJs("https://res.wx.qq.com/open/js/jweixin-1.2.0.js");
}
    var smid = getQueryString("smid");
    $api.setStorage('redirect_uri','/html/invite.html?smid='+smid);
    //渲染页面
	
		$.ajax({
			type:'post',
			url:MapiUrl+"/index.php?w=invite",
			data:{smid:smid},
			dataType:'json',
			//jsonp:'callback',
			success:function(result){
				var data = result.datas.member_info;
				$('#invit_name').html(data.member_name);
				$('#points_invite').html(data.points_invite+'积分');
				$api.setStorage("uid",data.member_qrc);
			 
			  if (wx_share == 1) {
				  var logo_wx = MUrl+'/images/logo_mb.png';
					var url_wx = location.href.split('#')[0];
				  	var _str = url_wx+'@@@'+data.member_name+'邀请您领积分~'+data.html_title+'@@@'+logo_wx+'@@@'+'新人专享，积分兑换礼品~'+data.seo_description;
					$.ajax({
						url: MapiUrl + "/index.php?w=wx_share&str="+encodeURIComponent(_str),
						data:{key:key},
						dataType: 'script',
						success: function (result) {
						}
					});
				}
				return false;
			}
		});

	$('#rush_get').click(function(){//领取红包
    
		

	});

});