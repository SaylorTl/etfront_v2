var config = {
    host: 'http://api-middleware',
    authhost: 'http://ms-auth2',
    propertyURL: 'http://caihui.test.colourlife.com/r/property',
    ticket: {
        Bucket: 'hjp-test-1257614477',
        Region: 'ap-guangzhou',
        path: {
            scan: 'scan/'
        }
    },
    contract: {
        Bucket: 'test-1257614477',
        Region: 'ap-guangzhou',
        path: {
            xsz: 'xsz/',
            sfz: 'sfz/',
            jsz: 'jsz/'
        }
    },
    notify_url: 'https://feedback.eptingche.cn/v2/notify/coupon/wechat'
}

window.config = config;