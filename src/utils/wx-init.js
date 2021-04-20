import wx from 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js';
wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: 'wx66b5b91c83f20361', // 必填，公众号的唯一标识 
    timestamp: '${ timestamp}', // 必填，生成签名的时间戳 
    nonceStr: '${ nonceStr}', // 必填，生成签名的随机串 
    signature: '${ signature}', // 必填，签名，见附录1 
    jsApiList: [
        'getLocation' //获取地理位置接口
    ]
});

// H5 获取当前位置经纬度
var location_lon = '',
    location_lat = ''; // 经度,纬度
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        location_lon = position.coords.longitude;
        location_lat = position.coords.latitude;
        alert('h5经度：' + location_lon);
        alert('h5纬度：' + location_lat);
    });
} else {
    alert("您的设备不支持定位功能");
}