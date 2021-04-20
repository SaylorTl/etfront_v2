import utils from '../utils/utils';
import store from '../vuex/index'
import axios from 'axios'
const create_token = function(param) {
        return axios({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'post',
            url: `${window.config.authhost}/silent/auth/access_token`,
            data: {
                client_id: 'G8b875FDhzW0',
                ...param
            },
            transformRequest: [function(data) {
                var ret = '';
                for (var it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
        }).then(res => {
            console.log("token信息：", res.data);
            if (res.status === 200 && !!res.data && res.data.code === 0) {
                return res.data;
            } else {
                return false;
            }
        });
    }
    // args是数组  如 ["code","state"]
const urlArgDel = function(args) {
    var loca = window.location;
    var baseUrl = loca.origin + loca.pathname + "?";
    var query = loca.search.substr(1);
    var obj = {}
    var arr = query.split("&");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].split("=");
        var key = arr[i][0];
        var val = arr[i][1];
        if (args.indexOf(key) == -1) obj[key] = val;
    }
    let flag = Object.keys(obj).length > 0;
    // let skipURL = loca.origin + loca.pathname;
    if (flag) {
        baseUrl += JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&")
    }
    return baseUrl;

}

const wxInit = function() {
    return axios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        url: `${window.config.authhost}/wechat/share/page`,
        data: {
            access_token: window.localStorage.getItem("access_token"),
            url: window.location.href,
            app_id: getAppid(),
            debug: true
        },
        transformRequest: [function(data) {
            var ret = '';
            for (var it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
    }).then(res => {
        if (res.status === 200 && !!res.data && res.data.code === 0) {
            return res.data;
        } else {
            return false;
        }
    });
}
const getAppid = function() {
    var appid = "";
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        if (window.location.host == 'w.eptingche.cn' || window.location.host == 'nface.eptingche.cn' || window.location.host == 'w.appv2.cn') {
            //智轩微信
            appid = 'wx66b5b91c83f20361';
        } else {
            appid = 'wxff787c2138809f0b'; //懿轩微信
        }
    } else if (ua.match(/colourlife/i) == "colourlife") { //彩之云app
        appid = 'ICEETC00-1FE6-45BE-8D01-E8DAB61EB570';
    }
    return appid;
}

const wx_oauth = {
    clearCode() {
        var url = urlArgDel(["code", "state"]);
        window.location.href = url;
    },
    createCode() {
        var appid = getAppid();
        var url = urlArgDel(["code", "state"]);
        console.log("跳转URL:", url);
        var redirect = encodeURIComponent(url);
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + redirect + "&connect_redirect=1&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
        return true;
    },
    getUrlCode() {
        let query = window.location.search.substr(1);
        let obj = {}
        let arr = query.split("&");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            let key = arr[i][0];
            let val = arr[i][1];
            obj[key] = val;
        }
        return obj.code || false;
    },
    getAccessToken(code) {
        if (code === false || code == "") return Promise.resolve(false);
        let param = {
            scope: 'wechat',
            code: code,
            app_id: getAppid()
        }
        return create_token(param);
    },
    checkToken(token) {
        if (token === false || token == "") return Promise.resolve(false);
        var t = new Date();
        let url = `${window.config.authhost}/userinfo?access_token=${token}&ts=${t.getTime()}`;
        return axios.get(url).then(res => {
            if (res.status === 200 && !!res.data && res.data.code === 0) {
                return res.data;
            } else {
                return false;
            }
        })
    }
}

const getUserInfo = function() {
    let parmas = { kind: "wxapp" };
    return new Promise((resolve, reject) => {
        utils.gateway(utils.api.getUserInfo, parmas).then(result => {
            if (result.code === 0 && !!result.content) {
                let content = result.content;
                let userInfo = {
                    open_id: content.open_id,
                    user_id: content.user_id,
                    nick_name: content.nick_name,
                    head_img: content.head_img,
                    mobile: !!content.mobile ?
                        content.mobile : "",
                    user_type: content.user_type,
                    address: Array.isArray(content.roomlist) ?
                        content.roomlist[0].build_name +
                        content.roomlist[0].unit_name : "",
                    role_type: content.role_type
                };
                resolve(userInfo);
            } else {
                reject(result);
            }
        });
    })

}

const noAndroid = function(callback) {
    if (window.WebViewJavascriptBridge) {
        return callback(window.WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    let WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() {
        document.documentElement.removeChild(WVJBIframe)
    }, 0)
}

const czyapp_oauth = {
    getCzyUser(func) {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {

            if (typeof(window.jsObject) == 'undefined') return;
            try {
                var response = window.jsObject.getUserInfoHandler();
                var info = response ? JSON.parse(response) : '';
                console.log("彩之云信息：", info);
                func(info);
            } catch (error) {
                alert("彩之云用户信息获取失败" + error.message);
                console.log(error.message);
            }
        } else {
            try {
                noAndroid(function(bridge) {
                    bridge.callHandler('getUserInfoHandler', '', function callback(response) {
                        // var mobile = typeof(response.mobile) != 'undefined' ? response['mobile'] : '';
                        func(response);
                    });
                });
            } catch (e) {
                console.log("彩之云用户信息获取失败" + e);
            }
        }
    },
    clearCode() {
        var url = urlArgDel(["appid", "access_token", "openId", "state"]);
        window.location.href = url;
    },
    createCode() {
        var appid = getAppid();
        var url = urlArgDel(["code", "state"]);
        var redirect = encodeURIComponent(url);
        window.location.href = "https://oauth2czy.colourlife.com/oauth2/authorize?application_id=" + appid + "&redirect_uri=" + redirect + "&response_type=access_token&scope=snsapi_base&state=11111";
    },
    getUrlCode() {
        let query = window.location.search.substr(1);
        let obj = {}
        let arr = query.split("&");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            let key = arr[i][0];
            let val = arr[i][1];
            obj[key] = val;
        }
        return obj.access_token || false;
    },
    getAccessToken(code) {
        if (code === false || code == "") return Promise.resolve(false);
        let param = {
            scope: 'czy',
            app_id: 'czy',
            code: code
        }
        return create_token(param);
    },
    checkToken(token) {
        if (token === false || token == "") return Promise.resolve(false);
        var t = new Date();
        let url = `${window.config.authhost}/userinfo?access_token=${token}&ts=${t.getTime()}`;
        return axios.get(url).then(res => {
            if (res.status === 200 && !!res.data && res.data.code === 0) {
                return res.data;
            } else {
                return false;
            }
        })

    }
}

const caihui_oauth = {
    getUrlCode() {
        let query = window.location.search.substr(1);
        let obj = {}
        let arr = query.split("&");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            let key = arr[i][0];
            let val = arr[i][1];
            obj[key] = val;
        }
        return obj.channel_token || false;
    },
    getAccessToken(code) {
        if (code === false || code == "") return Promise.resolve(false);
        let param = {
            scope: 'caihui',
            code: code,
            app_id: 'caihui'
        }
        return create_token(param);
    },
    checkToken(token) {
        if (token === false || token == "") return Promise.resolve(false);
        var t = new Date();
        let url = `${window.config.authhost}/userinfo?access_token=${token}&ts=${t.getTime()}`;
        return axios.get(url).then(res => {
            if (res.status === 200 && !!res.data && res.data.code === 0) {
                return res.data;
            } else {
                return false;
            }
        })
    }
}

var oauth = { czyapp: czyapp_oauth, wechat: wx_oauth, caihui: caihui_oauth, getAppid, getUserInfo, wxInit };
export default oauth;