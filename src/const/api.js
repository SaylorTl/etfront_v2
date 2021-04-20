/** 接口文件 */
export default {
    //临时使用老接口start
    sendSweepcode: 'et_client.coupon.send.sweepcode',
    reclaimExecute: 'et_client.coupon.reclaim.execute',
    limitBuylimit: 'et_client.coupon.limit.buylimit',
    setQRtoken: 'et_client.coupon.send.setQRtoken',
    limitDelete: 'et_client.coupon.limit.delete',
    authorLists: 'et_client.coupon.author.lists',
    authorGive: 'et_client.coupon.author.give',
    limitUpdate: 'et_client.coupon.limit.update',
    limitAdd: 'et_client.coupon.limit.add',
    couponSend: 'et_client.coupon.send.merchant',
    autoUpdate: 'et_client.coupon.auto.update',
    autoLists: 'et_client.coupon.auto.lists',
    autoAdd: 'et_client.coupon.auto.add',
    carExists: 'et_client.car.exists',
    orderLists: 'et_client.coupon.order.lists',
    pondLists: 'et_client.coupon.pond.lists',
    orderAdd: 'et_client.coupon.order.add',
    limitLists: 'et_client.coupon.limit.lists',
    checktemp: 'et_client.coupon.send.checktemp',
    couponLists: 'et_client.coupon.lists',
    buycreateLists: 'et_client.coupon.buycreate.lists',
    couponTypeLists: 'et_client.coupon.type.lists',
    merchantCoutype: 'et_client.coupon.merchant.coutype',
    merchantInfo: 'et_client.coupon.merchant.lists',
    //临时使用老接口end

    integralusedAdd: 'et_client.integral.detail.add',
    integralUsed: 'et_client.integral.used',
    integralCovert: 'et_client.integral.covert',
    integralLists: 'et_client.integral.detail.lists',
    integralLogin: 'et_client.integral.login',
    carListsMergeContracts: 'et_client.car.listsMergeContracts',
    msgLists: 'et_client.msg.lists',
    vehicleAuthlists: 'et_client.car.auth.lists',
    vehicleAuthAdd: 'et_client.car.auth.add',
    couponorderWechat: 'et_client.pay.couponorder.wechat',
    updateLock: 'et_client.car.lock.update',
    payorderLists: 'et_client.order.order.lists',
    getOrderDetail: 'et_client.order.order.show',
    carBind: 'et_client.car.bind',
    getbrandLists: 'et_client.car.brand.lists',
    unbindcar: 'et_client.car.unbind',
    costTempcar: 'et_client.cost.temp',
    getcarLists: 'et_client.car.lists',
    getRoomunits: 'et_client.etstation.room.units',
    getRoombuilding: 'et_client.etstation.room.building',
    checkRecognition: 'image.recognition',
    getcosclientkeys: 'et_client.oss.keys', //
    getPlateLocation: 'et_client.etstation.city.Lpa', //根据经纬度获取车牌前两位
    getAllCities: 'et_client.etstation.city.lists', //获取城市列表
    getStationByCityAndsName: 'et_client.etstation.station.keyword', //根据城市ID及停车场名称筛选停车场
    getNeighborhoodStation: 'et_client.etstation.station.neighborhood', //根据经纬度获取附件停车场,
    getStationById: 'et_client.etstation.station.show', //根据停车场ID获取停车场数据
    getStationByDevice: 'et_client.etstation.device.show', //根据道闸ID获取停车场数据
    userRegist: 'et_client.user.register', //用户手机绑定
    sendCheckcode: 'et_client.user.smsCaptcha', //发送手机验证码
    getParkingInfoByPlate: 'et_client.car.parking.show', //根据车牌判断是否在场
    addHistoryPlate: 'et_client.car.client.record.add', //增加历史记录
    getHistoryPlates: 'et_client.car.client.record.lists', //获取车牌历史记录
    getBuildingByStation: 'et_client.etstation.room.building', //根据停车场ID获取楼栋信息
    getRoomByBuilding: 'et_client.etstation.room.units', //根据楼栋ID获取房间号
    addBuildingAndRoom: 'et_client.etstation.room.add', //添加楼栋信息及房间信息
    tempCharge: 'et_client.cost.temp', //临停缴费计费
    getUserInfo: 'et_client.user.getUser', //获取个人用户信息
    monthCharge: 'et_client.cost.month', //月卡缴费计费
    getFeeInfoByStation: 'et_client.etstation.station.paymethod', //根据停车场判断是否允许缴费
    getTempOrder: 'et_client.pay.temporder.wechat', //临停下单
    getCzyTempOrder: 'et_client.pay.temporder.czy', //彩之云临停下单
    getPlateByDeviceId: 'et_client.etstation.station.getPlate', //根据道闸ID获取车牌号
    getCouponpond: 'et_client.coupon.pond.lists', //优惠券金额池
    getReceiptInfo: 'et_client.coupon.receipt.lists', //获取商家配置信息
    updateReceiptConfig: 'et_client.coupon.receipt.update', //更新扫小票优惠券配置
    addReceiptConfig: 'et_client.coupon.receipt.add', //添加扫小票优惠券配置
    scanTicket: 'et_client.coupon.receipt.imgrecognition', //扫小票识别
    getScanTicket: 'et_client.coupon.send.scanticket', //车主扫小票领券
    getCarInfo: 'et_client.car.show', //车辆
    // applaycontractlists: 'et_client.contract.apply.lists',
    // getRulelist: 'et_client.contract.rule.lists',
    getContractApplayLists: 'et_client.contract.apply.lists',
    getContractRuleLists: 'et_client.contract.rule.lists',
    addContractApply: 'et_client.contract.apply.add',
    // getcontractLists: 'et_client.contract.lists',
    getContractLists: 'et_client.contract.lists',
    getContractCarLists: 'et_client.contract.cars',
    getContractFee: 'et_client.cost.month',
    payContract: 'et_client.pay.monthorder.wechat',
    getDeductionMonthOrder: 'et_client.pay.monthorder.deductionUnified', // 彩惠抵扣金+月卡支付
    getDeductionTempOrder: 'et_client.pay.temporder.deductionUnified', // 彩惠抵扣金+临停支付
    getCzyMonthOrder: 'et_client.pay.monthorder.czy', //彩之云临停下单
    isInStation: 'et_client.unlicense.isPresence', //判断车辆是否在场
    openDevice: 'et_client.unlicense.pass', //开闸
    getUnlicensePlate: 'et_client.unlicense.checkUnlicense', //判断是否是无牌车
    unLicenseCharge: 'et_client.unlicense.cost', //无牌车计费
    costOpenDevice: 'et_client.cost.open', //无牌车开闸

    //日报上缴
    czyDaily: 'et_client.pay.summaryorder.czy', //彩之云APP
    czyWechatDaily: 'et_client.pay.summaryorder.czy_wechat', //彩之云公众号
    wechatDaily: 'et_client.pay.summaryorder.wechat', //微信公众号

    //紧急开闸
    getStationByUser: 'et_client.contract.stationlists', //根据用户信息获取车场
    getEmergencyCode: 'et_client.contract.askOpen', //下发紧急开闸码
    emergencyOpen: 'et_client.contract.open', //紧急开闸
    getCaihuiPropertyFee: 'et_client.user.getAddress', //获取彩之云用户物业费信息

    //E师傅
    eshifu: 'et_client.user.eshifu', //E师傅
}