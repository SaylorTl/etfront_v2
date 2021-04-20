import api from '../const/api';
import validator from './validator';
import eptimes from './eptimes';
import $axios from '../../axios.config';
import COS from 'cos-js-sdk-v5';
import Vue from 'vue';
import compress from './compress';
import wx from 'weixin-js-sdk';
const uitls = {
    gateway(method, biz_content) {
        return new Promise((resove, reject) => {
            $axios({
                method: 'post',
                url: `${window.config.host}/gateway`,
                data: {
                    biz_content,
                    method
                }
            }).then(response => {
                if (response.data.code !== 0) {
                    console.log("request:", method, response.data.message)
                        // Vue.$vux.toast.text(response.data.message, 'middle')
                }
                resove(response.data);
            }).catch(err => {
                Vue.$vux.toast.text('网络或应用异常，请刷新重试！', 'middle')
            });
        })

    },
    setTitle(title) {
        document.title = title;
        var mobile = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(mobile)) {
            var iframe = document.createElement('iframe');
            iframe.style.visibility = 'hidden';
            var iframeCallback = function() {
                setTimeout(function() {
                    iframe.removeEventListener('load', iframeCallback);
                    document.body.removeChild(iframe);
                }, 0);
            };
            iframe.addEventListener('load', iframeCallback);
            document.body.appendChild(iframe);
        }
    },
    isVehicleNumber(vehicleNumber) {
        var reg7 = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领E]{1}[A-Za-z]{1}[A-Za-z0-9]{4}[A-Za-z0-9挂学警港澳领]{1}$/;
        var reg8 = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Za-z]{1}[A-Za-z0-9]{5}[A-Za-z0-9]{1}$/;
        if (vehicleNumber.length === 7) {
            // console.log('7位',vehicleNumber,reg7.test(vehicleNumber))
            return reg7.test(vehicleNumber);
        } else if (vehicleNumber.length === 8) {
            //  console.log('8位',vehicleNumber,reg8.test(vehicleNumber))
            return reg8.test(vehicleNumber);
        } else {
            //  console.log('其他',vehicleNumber)
            return false;
        }
    },
    transforData(startTime, endTime) {
        let result = "";
        let s = eptimes.outTime(
            startTime.replace(/-/g, "/"),
            "yyyy/MM/dd hh:mm:ss"
        );
        s = new Date(s).getTime();
        let e = eptimes.outTime(
            endTime.replace(/-/g, "/"),
            "yyyy/MM/dd hh:mm:ss"
        );
        e = new Date(e).getTime();
        let dValue = e - s;
        if (parseInt(dValue / 1000) === 0) {
            result = "0分";
        } else if (
            parseInt(dValue / 1000) > 0 &&
            parseFloat(dValue / 1000) < 60
        ) {
            result = "0分";
        } else if (
            parseFloat(dValue / 1000) >= 60 &&
            parseFloat(dValue / 1000 / 60) < 60
        ) {
            result = parseInt(dValue / 1000 / 60) + "分";
        } else if (
            parseFloat(dValue / 1000 / 60) >= 60 &&
            parseFloat(dValue / 1000 / 60 / 60) < 24
        ) {
            result =
                parseInt(dValue / 1000 / 60 / 60) +
                "小时 " +
                parseInt((dValue / 1000 / 60) % 60) +
                "分";
        } else if (parseFloat(dValue / 1000 / 60 / 60) >= 24) {
            result =
                parseInt(dValue / 1000 / 60 / 60 / 24) +
                "天 " +
                parseInt((dValue / 1000 / 60 / 60) % 24) +
                "小时 " +
                parseInt((dValue / 1000 / 60) % 60) +
                "分";
        }
        return result;
    },
    // getPosition(timeout = 10000, maximumAge = 60000, enableHighAcuracy = false) {
    //     return new Promise((resolve, reject) => {
    //         if (!navigator && !navigator.geolocation) {
    //             return reject(new Error('geolocation api not supported'))
    //         } else {
    //             navigator.geolocation.getCurrentPosition((position) => {
    //                 resolve({
    //                     lat: position.coords.latitude, //纬度
    //                     log: position.coords.longitude //经度
    //                 })
    //             }, (error) => {
    //                 switch (error.code) {
    //                     case error.PERMISSION_DENIED:
    //                         reject("定位失败,用户拒绝请求地理定位");
    //                         break;
    //                     case error.POSITION_UNAVAILABLE:
    //                         reject("定位失败,位置信息是不可用");
    //                         break;
    //                     case error.TIMEOUT:
    //                         reject("定位失败,请求获取用户位置超时");
    //                         break;
    //                     case error.UNKNOWN_ERROR:
    //                         reject("定位失败,定位系统失效");
    //                         break;
    //                 }
    //             });
    //         }

    //     })
    // },
    guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    cosFileInit(buketKey) {
        let _this = this;
        const getTempKey = function(options, callback) {
            let params = {
                bucket: `${window.config[buketKey].Bucket}`,
                region: `${window.config[buketKey].Region}`
            }
            _this.gateway(api.getcosclientkeys, params).then((res) => {
                let credentials = res.content.credentials;
                let expiredTime = res.content.expiredTime;
                callback({
                    TmpSecretId: credentials.tmpSecretId,
                    TmpSecretKey: credentials.tmpSecretKey,
                    XCosSecurityToken: credentials.sessionToken,
                    ExpiredTime: expiredTime
                })
            })
        }
        const cos = new COS({
            getAuthorization: getTempKey
        })
        this.cos = cos;
    },
    cosFileUpload({ files, buketKey, pathKey = '/' }, callback) {
        let file = files[0];
        let vue = new Vue();
        let _this = this;
        let filename = files[0].name;
        filename = `${_this.guid()}${filename.substring(filename.lastIndexOf('.'))}`;
        let pinfo;
        if (file.type.indexOf('image') != -1) {
            compress.resizeImage(file).then((result) => {
                return typeof result === 'string' ? compress.convertToBlob(result, file.type) : result;
            }).then((blob) => {
                this.cos.putObject({
                    Bucket: `${window.config[buketKey].Bucket}`,
                    Region: `${window.config[buketKey].Region}`,
                    Key: `${window.config[buketKey].path[pathKey]}${filename}`,
                    Body: blob,
                    onProgress: function(info) {
                        console.log("上传进度：", info);
                        vue.$loading.show({ content: '文件上传中...' });
                        pinfo = info;
                    }
                }, (err, data) => {
                    vue.$loading.hide();
                    console.log("图片上传信息：", data);
                    if (data.statusCode === 200) {
                        _this.getCosImageURL({ filename: `${window.config[buketKey].path[pathKey]}${filename}`, buketKey, pathKey }, pinfo, callback);
                    } else {
                        console.log('上传图片cos', err)
                        callback(false);
                    }
                });
            });
        } else {
            this.cos.putObject({
                Bucket: `${window.config[buketKey].Bucket}`,
                Region: `${window.config[buketKey].Region}`,
                Key: `${window.config[buketKey].path[pathKey]}${filename}`,
                Body: files[0],
                onProgress: function(info) {
                    console.log("上传进度：", info);
                    vue.$loading.show({ content: '文件上传中...' });
                    pinfo = info;
                }
            }, (err, data) => {
                vue.$loading.hide();
                console.log("图片上传信息：", data);
                if (data.statusCode === 200) {
                    _this.getCosImageURL({ filename: `${window.config[buketKey].path[pathKey]}${filename}`, buketKey, pathKey }, pinfo, callback);
                } else {
                    console.log('上传图片cos', err)
                    callback(false);
                }
            });
        }
    },
    getCosImageURL({ filename, buketKey, pathKey = '/' }, info, callback) {
        let args = arguments;
        if (args.length === 2) {
            filename = args[0];
            callback = args[1];
            info = '';
        }
        this.cos.getObjectUrl({
            Bucket: `${window.config[buketKey].Bucket}`,
            Region: `${window.config[buketKey].Region}`,
            Key: `${filename}`,
            Expires: 7200,
            Sign: true,
        }, function(err, data) {
            let url = data.Url;
            let result = { filename, info, err, url };
            callback(result)
        });
    },
    //加法
    accAdd(arg1, arg2) {
        var r1, r2, m;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        return (arg1 * m + arg2 * m) / m;
    },
    //减法
    accDel(arg1, arg2) {
        var r1, r2, m;
        arg1 = parseFloat(arg1);
        arg2 = parseFloat(arg2);
        try { r1 = arg1.toString().split(".")[1].length; } catch (e) { r1 = 0; }
        try { r2 = arg2.toString().split(".")[1].length; } catch (e) { r2 = 0; }
        m = Math.pow(10, Math.max(r1, r2));
        return (arg1 * m - arg2 * m) / m;
    },
    //乘法函数
    accMul(arg1, arg2) {
        var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try { m += s1.split(".")[1].length; } catch (e) { console.log('') }
        try { m += s2.split(".")[1].length; } catch (e) { console.log('') }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },
    //除法函数
    accDiv(arg1, arg2) {
        var t1 = 0,
            t2 = 0,
            r1, r2;
        try { t1 = arg1.toString().split(".")[1].length; } catch (e) { console.log('') }
        try { t2 = arg2.toString().split(".")[1].length; } catch (e) { console.log('') }
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    },
    clientcheck() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') { //微信登陆
            return 'WECHAT';
        } else if (ua.match(/Alipay/i) == "alipay") { //支付宝登陆
            return 'ZFB';
        } else if (ua.match(/colourlife/i) == "colourlife") { //彩之云app
            return 'CZY';
        } else {
            return 'BROWSER';
        }
    },
    amountBlur(v) {
        v = String(v);
        v = v.split('.');
        if (v[1] && v[1].length > 2) {
            v[1] = v[1].substring(0, 2);
            v = v[0] + '.' + v[1];
            v = Number(v);
        } else {
            v = v[0] + '.' + v[1];
        }
        v = parseFloat(v);
        return isNaN(v) ? '' : v;
    },
    caihuiMiniDeducation(tnum) {
        wx.miniProgram.getEnv(function(res) {
            if (res.miniprogram) {
                wx.miniProgram.navigateTo({ url: `/pages/channel/pay?colour_sn=${tnum}&order_type=e_parking` })
            }
        })
    }
}

uitls.api = api;
uitls.validator = validator;
uitls.eptimes = eptimes;
export default uitls;