(function(){var ua=navigator.userAgent.toLowerCase();var appv=navigator.appVersion;var html=document.documentElement;var isIos=/ip(hone|od|ad)/i.test(ua);var device={iphone:"iphone",ipod:"ipod",ipad:"ipad",samsung:"samsung|sm-",huawei:"huawei",meizu:"mx[0-9]+"};var uaContextReg=/context\:([^\s]+)/i;var tryToGetContext=uaContextReg.exec(ua);var vArr,ver;var dev;if(isIos){html.classList.add("fl-ios");vArr=appv.match(/OS (\d+)[_\.](?:\d+)[_\.]?(?:\d+)?/);ver=parseInt(vArr[1],10);if(ver>=8){html.classList.add("fl-hairlines");}}else{vArr=appv;ver=parseInt(ua.substr(ua.indexOf('android')+8,3));html.classList.add("fl-android");if(ver<6){html.classList.add("fl-android-"+ver);}}
for(dev in device){if(device.hasOwnProperty(dev)){if((new RegExp("\\b"+device[dev]+"\\b")).test(ua)){html.classList.add("fl-"+dev);break;}}}
if(tryToGetContext&&tryToGetContext[1]=='com'){document.querySelector('meta[name=viewport]').setAttribute('content','initial-scale=1.0,user-scalable=no,minimum-scale=1.0,maximum-scale=1.0');}}());(function(win,doc){var script=doc.querySelector("#J_script_attrsniffer");var remwidth;var remSwitch;var remmaxwidth;var evt='onorientationchange'in win?'orientationchange':'resize';var timer=null;var ua=navigator.userAgent.toLowerCase();var isIos=/ip(hone|od|ad)/i.test(ua);var isIpad=/ipad/i.test(ua);if(!script){return;}
remwidth=script.getAttribute("data-remwidth");remSwitch=script.getAttribute("data-remswitch");remmaxwidth=script.getAttribute("data-remmaxwidth");if(remSwitch=="[remswitch]"){return;}
remwidth=(remwidth=="[remwidth]"?750:Number(remwidth));function setFontSize(){var docEl=doc.documentElement;var winWidth=(isIos&&!isIpad)?window.screen.width:docEl.getBoundingClientRect().width;var originFontSize;var definedFontSize=(winWidth/remwidth)*100;if(remmaxwidth&&remmaxwidth!=="[remmaxwidth]"&&definedFontSize>Number(remmaxwidth)){definedFontSize=Number(remmaxwidth);}
docEl.setAttribute('data-screenwidth',winWidth);docEl.style.fontSize=definedFontSize+'px';originFontSize=parseFloat(window.getComputedStyle(docEl,null).getPropertyValue("font-size"));if(!isIos&&definedFontSize!=originFontSize){originFontSize=(originFontSize%1===0)?(originFontSize+0.5):originFontSize;docEl.style.fontSize=(definedFontSize/originFontSize)*definedFontSize+'px';}}
win.addEventListener(evt,function(){clearTimeout(timer);timer=setTimeout(setFontSize,300);},false);win.addEventListener("pageshow",function(e){if(e.persisted){clearTimeout(timer);timer=setTimeout(setFontSize,300);}},false);setFontSize();}(window,document));