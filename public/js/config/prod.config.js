var config = {
    host: 'https://api.aparcar.cn',
    authhost: 'https://oauth.aparcar.cn',
    propertyURL: 'https://caihui.colourlife.com/r/property',
    ticket: {
        Bucket: 'eparking-1256130579',
        Region: 'ap-shanghai',
        path: {
            scan: 'scan/'
        }
    },
    contract: {
        Bucket: 'ids-1256130579',
        Region: 'ap-shanghai',
        path: {
            xsz: 'xsz/',
            sfz: 'sfz/',
            jsz: 'jsz/'
        }
    },
    notify_url: 'https://w.aparcar.cn/v2/notify/coupon/wechat'
}

window.config = config;