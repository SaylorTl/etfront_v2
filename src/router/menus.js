import noplate from './no-plate';
import location from './location';
export default [{
        path: '/',
        meta: {
            title: '页面加载'
        },
        name: 'loading',
        component: () =>
            import ( /* webpackChunkName: "loading" */ '../view/loading.vue')
    },
    {
        path: '/clear',
        meta: {
            title: '清除缓存'
        },
        name: 'clear',
        component: () =>
            import ( /* webpackChunkName: "loading" */ '../view/clearCache.vue')
    },
    {
        path: '/user/login',
        meta: {
            title: '用户注册'
        },
        name: 'login',
        component: () =>
            import ( /* webpackChunkName: "user" */ /* webpackMode: "lazy" */ '../view/user/login.vue')
    },
    {
        path: '/coupon/receive',
        meta: {
            title: '扫码领券-领券'
        },
        name: 'coupon-receive',
        component: () =>
            import ( /* webpackChunkName: "pay" */ /* webpackMode: "lazy" */ '../view/coupon/receive.vue')
    },
    {
        path: '/coupon/buyresult',
        meta: {
            title: '优惠券购买支付结果'
        },
        name: 'coupon-buyresult',
        component: () =>
            import ( /* webpackChunkName: "pay" */ /* webpackMode: "lazy" */ '../view/coupon/buyResult.vue')
    },
    {
        path: '/coupon/index',
        meta: {
            title: '商家优惠券'
        },
        name: 'coupon-index',
        component: () =>
            import ( /* webpackChunkName: "coupon" */ /* webpackMode: "lazy" */ '../view/coupon/index.vue')
    },
    {
        path: '/coupon/authorize',
        meta: {
            title: '优惠券授权'
        },
        name: 'coupon-authorize',
        component: () =>
            import ( /* webpackChunkName: "coupon" */ /* webpackMode: "lazy" */ '../view/coupon/authorize.vue')
    },
    {
        path: '/coupon/limit',
        meta: {
            title: '优惠券限制'
        },
        name: 'coupon-limit',
        component: () =>
            import ( /* webpackChunkName: "coupon" */ /* webpackMode: "lazy" */ '../view/coupon/limit.vue')
    },
    {
        path: '/coupon/auto',
        meta: {
            title: '自动领券'
        },
        name: 'coupon-auto',
        component: () =>
            import ( /* webpackChunkName: "coupon" */ /* webpackMode: "lazy" */ '../view/coupon/auto.vue')
    },
    {
        path: '/coupon/ticket-config',
        meta: {
            title: '商家小票配置'
        },
        name: 'ticket-config',
        component: () =>
            import ( /* webpackChunkName: "coupon" */ /* webpackMode: "lazy" */ '../view/coupon/ticketConfig.vue')
    },
    {
        path: '/coupon/ticket-scan',
        meta: {
            title: '扫小票'
        },
        name: 'ticket-scan',
        component: () =>
            import ( /* webpackChunkName: "coupon" */ /* webpackMode: "lazy" */ '../view/coupon/ticketScan.vue')
    },
    {
        path: '/coupon/scan-result',
        meta: {
            title: '扫描结果'
        },
        name: 'scan-result',
        component: () =>
            import ( /* webpackChunkName: "coupon" */ /* webpackMode: "lazy" */ '../view/coupon/scanResult.vue')
    },
    {
        path: '/personal/home',
        meta: {
            title: '个人中心'
        },
        name: 'home',
        component: () =>
            import ( /* webpackChunkName: "personal" */ /* webpackMode: "lazy" */ '../view/personal/home.vue')
    },
    {
        path: '/temp/temp-pay',
        name: 'temp-pay',
        component: () =>
            import ( /* webpackChunkName: "temp" */ /* webpackMode: "lazy" */ '../view/temp/tempPay.vue')
    },
    {
        path: '/temp/temp-fee',
        name: 'temp-fee',
        component: () =>
            import ( /* webpackChunkName: "temp" */ /* webpackMode: "lazy" */ '../view/temp/tempFee.vue')
    },
    {
        path: '/temp/temp-result',
        meta: {
            title: '支付结果'
        },
        name: 'temp-result',
        component: () =>
            import ( /* webpackChunkName: "pay" */ /* webpackMode: "lazy" */ '../view/temp/tempResult.vue')
    },
    {
        path: '/monthly-card-apply',
        meta: {
            title: '申请月卡'
        },
        name: 'monthly-card-apply',
        component: () =>
            import (
                /* webpackChunkName: "month" */
                /* webpackMode: "lazy" */
                '../view/monthlyCardApply/index.vue'
            )
    },
    {
        path: '/month/month-fee',
        meta: {
            title: '月卡缴费'
        },
        name: 'month-fee',
        component: () =>
            import ( /* webpackChunkName: "month" */ /* webpackMode: "lazy" */ '../view/month/monthFee.vue')
    },
    {
        path: '/car/car-plate-bind',
        name: 'car-plate-bind',
        component: () =>
            import ( /* webpackChunkName: "car" */ /* webpackMode: "lazy" */ '../view/car/carPlateBind.vue')
    },
    {
        path: '/car/car-card-upload',
        name: 'car-card-upload',
        component: () =>
            import ( /* webpackChunkName: "car" */ /* webpackMode: "lazy" */ '../view/car/carCardUpload.vue')
    },
    {
        path: '/car/car-info',
        meta: {
            title: '车辆信息'
        },
        name: 'car-info',
        component: () =>
            import ( /* webpackChunkName: "car" */ /* webpackMode: "lazy" */ '../view/car/carInfo.vue')
    },
    {
        path: '/moving-car',
        meta: {
            title: '一键挪车'
        },
        name: 'moving-car',
        component: () =>
            import (
                /* webpackChunkName: "car" */
                /* webpackMode: "lazy" */
                '../view/movingCar.vue'
            )
    },
    {
        path: '/msg/msg-park-sys',
        meta: {
            title: '消息'
        },
        name: 'msg-park-sys',
        component: () =>
            import ( /* webpackChunkName: "msg" */ /* webpackMode: "lazy" */ '../view/message/index.vue')
    },
    {
        path: '/lock/lock-park',
        meta: {
            title: '车位锁'
        },
        name: 'lock-park',
        component: () =>
            import ( /* webpackChunkName: "lock" */ /* webpackMode: "lazy" */ '../view/lock/index.vue')
    },
    {
        path: '/card/one-card-pass',
        meta: {
            title: '一卡通'
        },
        name: 'one-card-pass',
        component: () =>
            import ( /* webpackChunkName: "card" */ /* webpackMode: "lazy" */ '../view/card/index.vue')
    },
    {
        path: '/vehicle/vehicle-auth',
        meta: {
            title: '车辆授权'
        },
        name: 'vehicle-auth',
        component: () =>
            import ( /* webpackChunkName: "vehicle" */ /* webpackMode: "lazy" */ '../view/vehicle/index.vue')
    },
    {
        path: '/vehicle/lists',
        meta: {
            title: '授权记录'
        },
        name: 'vehicle-lists',
        component: () =>
            import ( /* webpackChunkName: "vehicle" */ /* webpackMode: "lazy" */ '../view/vehicle/lists/index.vue')
    },
    {
        path: '/parking/parking-payment',
        meta: {
            title: '缴费记录'
        },
        name: 'parking-payment',
        component: () =>
            import (
                /* webpackChunkName: "parking" */
                /* webpackMode: "lazy" */
                '../view/parking/parkingPayment.vue'
            )
    },
    {
        path: '/parking/parking-detail',
        meta: {
            title: '缴费详情'
        },
        name: 'parking-detail',
        component: () =>
            import ( /* webpackChunkName: "parking" */ /* webpackMode: "lazy" */ '../view/parking/parkingDetail.vue')
    },
    {
        path: '/car/emergency-open',
        meta: {
            title: '紧急开闸'
        },
        name: 'emergency-open',
        component: () =>
            import ( /* webpackChunkName: "car" */ /* webpackMode: "lazy" */ '../view/car/emergencyOpen.vue')
    },
    {
        path: '/parking/daily',
        meta: {
            title: '车场日报'
        },
        name: 'daily',
        component: () =>
            import ( /* webpackChunkName: "parking" */ /* webpackMode: "lazy" */ '../view/parking/daily.vue')
    },
    {
        path: '/integral/pay',
        meta: {
            title: '停车服务'
        },
        name: 'integral-pay',
        component: () =>
            import ( /* webpackChunkName: "parking" */ /* webpackMode: "lazy" */ '../view/integral/pay.vue')
    },
    {
        path: '/integral/plate',
        meta: {
            title: '停车服务'
        },
        name: 'integral-plate',
        component: () =>
            import ( /* webpackChunkName: "parking" */ /* webpackMode: "lazy" */ '../view/integral/plate.vue')
    },
    {
        path: '/integral/payresult',
        meta: {
            title: '支付结果'
        },
        name: 'integral-payresult',
        component: () =>
            import ( /* webpackChunkName: "parking" */ /* webpackMode: "lazy" */ '../view/integral/payResult.vue')
    },
    {
        path: '/integral/history',
        meta: {
            title: '历史记录'
        },
        name: 'integral-history',
        component: () =>
            import ( /* webpackChunkName: "parking" */ /* webpackMode: "lazy" */ '../view/integral/history.vue')
    },
    {
        path: '/integral/login',
        meta: {
            title: '登录'
        },
        name: 'integral-login',
        component: () =>
            import ( /* webpackChunkName: "parking" */ /* webpackMode: "lazy" */ '../view/integral/login.vue')
    },
    {
        path: '/parking/daily-detail',
        meta: {
            title: '车场日报详情'
        },
        name: 'daily-detail',
        component: () =>
            import ( /* webpackChunkName: "parking" */ /* webpackMode: "lazy" */ '../view/parking/dailyDetail.vue')
    },
    {
        path: '/eshifu',
        name: 'eshifu',
        component: () =>
            import ( /* webpackChunkName: "eshifu" */ /* webpackMode: "lazy" */ '../view/eshifu/eshifu.vue')
    }
].concat(noplate).concat(location);