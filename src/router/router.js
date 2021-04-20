import Vue from 'vue'
import VueRouter from 'vue-router'
import menus from './menus'
import auth from '../utils/auth'
import store from '../vuex/index'
import utils from '../utils/utils'
import wx from 'weixin-js-sdk';

Vue.use(VueRouter)
const router = new VueRouter({ mode: 'history', routes: menus })
router.beforeEach((to, from, next) => {
    let whiteList = ['loading', 'login', 'temp-pay', 'clear', 'no-plate', 'p_q', 'p_q_s', 'p_q_d', 'p_q_n', 'temp-fee', 'temp-result', 'ui-stations', 'eshifu'];
    store.commit('setCurrentRoute', to);

    let ua = window.navigator.userAgent.toLowerCase();
    let _client = {};
    let type = 'BROWSER';
    if (ua.match(/Alipay/i) == "Alipay") { //支付宝
        alert('该车场暂不支持支付宝，请使用微信扫码支付')
    }
    /**
     * 根据state 判断是否彩惠小程序跳转
     */
    console.log("toquery:", JSON.stringify(to.query));
    if (!!to.query.source) {
        sessionStorage.setItem("source", to.query.source);
    }
    if (ua.match(/Alipay/i) == "alipay") { //支付宝登陆
        alert('该车场暂不支持支付宝，请使用微信扫码支付')
    }
    if (ua.match(/MicroMessenger/i) == 'micromessenger' && sessionStorage.getItem("source") !== 'mini_program') { //微信登陆
        type = 'WECHAT';
        _client = auth.wechat;
        sessionStorage.setItem("source", "");
    }
    //  else if (ua.match(/MicroMessenger/i) == 'micromessenger' && sessionStorage.getItem("source") === 'mini_program') {
    //     type = 'CAIHUI';
    //     _client = auth.caihui;
    // } 
    else if (ua.match(/colourlife/i) == "colourlife") { //彩之云app
        type = 'CZY';
        _client = auth.czyapp;
        sessionStorage.setItem("source", "");
    }

    let tempcode = _client.getUrlCode();
    console.log("tempcode:", tempcode);
    let code = '';
    if (!!tempcode && Array.isArray(tempcode)) {
        code = tempcode.pop();
    } else if (to.query.source === 'mini_program') {
        code = to.query.channel_token;
    } else {
        code = tempcode;
    }

    store.commit('setClientType', type);
    store.commit('setLoading', true);
    _client.getAccessToken(code).then(function(data) {
        console.log("token:", code, JSON.stringify(data));
        if (!!data) {
            if (data.code == 0) {
                let token = data.content.access_token;
                window.localStorage.setItem('access_token', token);
                return token;
            } else if (data.code == 10002) {
                return window.localStorage.getItem('access_token') ? window.localStorage.getItem('access_token') : false;
            } else {
                _client.clearCode();
                return -1;
            }
        } else if (to.query.source === 'mini_program') {
            Vue.$vux.alert.show({
                title: '授权提示',
                content: '获取授权信息失败，请重新进入！',
                onShow() {
                    // history.go(-1);
                },
                onHide() {
                    if (wx) {
                        wx.closeWindow();
                    }
                }

            })
            return false;
        } else {
            return window.localStorage.getItem('access_token') ? window.localStorage.getItem('access_token') : false;
        }
    }).then(function(str) {
        if (str === -1) {
            return false;
        }
        let token = !!str ? str : false;
        return _client.checkToken(token).then(function(result) {
            // oLoading.hide();
            if (result === false) {
                if (sessionStorage.getItem("source") === 'mini_program') {
                    store.commit('setLoading', false);
                    Vue.$vux.alert.show({
                        title: '授权提示',
                        content: '获取授权信息失败，请重新进入！',
                        onShow() {
                            // history.go(-1);
                        },
                        onHide() {
                            if (wx) {
                                wx.closeWindow();
                            }
                        }

                    })
                    return false;
                } else {
                    window.localStorage.setItem('access_token', '');
                    _client.createCode();
                    return;
                }

            } else {
                store.commit('setLoginStatus', true);
                store.commit('setLoginInfo', result.content.app_info); //登录信息
                if (to.meta.title) {
                    utils.setTitle(to.meta.title);
                }
                const { app_id } = result.content.app_info;
                if (app_id === 'czy') {
                    store.commit('setAppType', 'czy')
                    let appInfo = result.content.app_info;
                    store.commit('setLocationInfo', { latitude: appInfo.czy_latitude, longitude: appInfo.czy_longitude });
                    _client.getCzyUser((result) => {
                        console.log("彩之云相关信息：", result);
                        let czy_id = sessionStorage.getItem('czy_id');
                        if (czy_id !== result.uid) {
                            sessionStorage.setItem("czy_id", result.uid);
                        }
                    })
                } else {
                    auth.wxInit().then(res => {
                        if (res.code === 0 && !!res.content && !!wx) {
                            const { timestamp, nonceStr, signature } = res.content;
                            wx.config({
                                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                                appId: auth.getAppid(), // 必填，公众号的唯一标识 
                                timestamp, // 必填，生成签名的时间戳 
                                nonceStr, // 必填，生成签名的随机串 
                                signature, // 必填，签名，见附录1
                                jsApiList: [
                                    'getLocation', //获取地理位置接口
                                    'checkJsApi'
                                ]
                            });
                        }
                    })
                    wx.checkJsApi({
                        jsApiList: ['getLocation'],
                        success: function(res) {
                            if (res.checkResult.getLocation == false) {
                                Vue.$vux.toast.text('您的微信版本过低，不支持微信JSSDK接口，请升级到最新版微信', 'middle');
                                return;
                            }
                        }
                    });
                    wx.getLocation({
                        success: function(res) {
                            // latitude 纬度，浮点数，范围为90 ~ -90
                            // longitude 经度，浮点数，范围为180 ~ -180。
                            const { latitude, longitude } = res;
                            console.log("定位信息：", res);
                            store.commit('setLocationInfo', { latitude, longitude });
                        }
                    })
                }
                console.log("to:", to);
                auth.getUserInfo().then(res => {

                    if (!!res.user_id) {
                        store.commit('setUserInfo', res);
                        next();
                    } else {
                        if (whiteList.includes(to.name)) {
                            next()
                        } else {
                            next({
                                path: '/user/login',
                                query: {
                                    redirectRoute: window.location.href
                                }
                            })
                        }

                    }
                }).catch(err => {
                    if (whiteList.includes(to.name)) {
                        next()
                    } else {
                        next({
                            path: '/user/login',
                            query: {
                                redirectRoute: window.location.href
                            }
                        })
                    }
                });
            }
        });
    });
})

router.afterEach((to, from) => {
    store.commit('setLoading', false);
})

export default router;