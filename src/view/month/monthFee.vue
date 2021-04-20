<template>
    <div class="page-month-fee">
        <div class="card month-fee-card">
            <div>{{cardTitle}}</div>
            <div>EP停车车场会员</div>
            <div><span>￥</span>{{amount.total ? amount.total : ' _ '}}</div>
        </div>
        <!-- <div class="card month-fee-ad"></div> -->
        <div class="month-fee-form">
            <form-item label="车牌号" :content="currCar.name"></form-item>
            <form-item label="停车场" :content="currStation.name" arrow @handleClick="selectStation"></form-item>
            <form-item label="车位" v-if="showSpace" :content="currSpace.name" arrow @handleClick="selectSpace"></form-item>
            <form-item label="收费规则" :content="currRule.name" arrow @handleClick="selectRule"></form-item>
            <form-item :label="timeText" :content="currMonth.name" arrow @handleClick="selectMonth"></form-item>
            <!-- <form-item label="备注">
                <div slot="content" class="month-fee-form__remark">彩生活一卡通</div>
            </form-item> -->
            <form-item label="优惠金额" v-if="!!amount.coupon">
                <div slot="content" class="month-fee-form__coupon">￥{{ amount.coupon ? amount.coupon : ' _ ' }}元</div>
            </form-item>
            <form-item label="到期时间" :content="endTime"></form-item>
            <form-item label="续费到期时间" :content="deadline"></form-item>
            <form-item label="应收金额">
                <div slot="content" class="month-fee-form__coupon">￥{{ amount.total_amount || '_'}}元</div>
            </form-item>
            <form-item v-if="!!amount.remark" label="备注" :border="hasDeduction" :content="amount.remark"></form-item>
            <form-item label="可用彩惠抵扣金" v-if="hasDeduction" :border="!hasDeduction">
                <div slot="content" class="month-fee-form__coupon">￥{{ caihuiDeduction.coupon_amount || ' _ ' }}元
                    <input type="checkbox" class="month-fee-checkbox" v-model="caihuiDeduction.isUsed">
                </div>
            </form-item>
        </div>
        <div class="month-fee-btn">
            <x-xbutton :disabled="noPay" @click.native="pay">{{payText}}</x-xbutton>
        </div>
        <my-picker :isShow="stationPicker" v-if="showStation" :data="stationArr" @change="changeStation" @handleClose="closeStation"></my-picker>
        <my-picker :isShow="spacePicker" v-if="showSpace" :data="spaceArr" @change="changeSpace" @handleClose="closeSpace"></my-picker>
        <my-picker :isShow="rulePicker" v-if="showRule" :data="ruleArr" @change="changeRule" @handleClose="closeRule"></my-picker>
        <my-picker :isShow="monthPicker" v-if="showMonth" :data="monthArr" @change="changeMonth" @handleClose="closeMonth"></my-picker>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import FormItem from "../../components/FormItem/index";
import MyPicker from "../../components/MyPicker/index";
import { mapState } from "vuex";
export default {
    name: "month-fee",
    props: {},
    components: {
        FormItem,
        MyPicker
    },
    data() {
        return {
            showStation: false,
            stationPicker: false,
            showRule: false,
            rulePicker: false,
            showMonth: false,
            monthPicker: false,
            showSpace: false,
            spacePicker:false,
            noPay: true,
            amount:{total:0,coupon:0,total_amount:0,remark:''},
            default_month:3, // 默认交3个月
            endTime: "",
            deadline: "",
            dataLists:[],
            currCar: {}, //当前车牌
            currStation: {}, //当前选择停车场
            currSpace:{}, //当前车位
            currRule: {}, //当前选择规则
            currMonth: {}, //当前选择月份
            carArr:[],
            stationArr:[],
            spaceArr:[],
            ruleArr:[],
            monthArr:[],
            caihuiDeduction: {
                isUsed: false
            },
            payText: '支付',
            hasDeduction:false,
            timeText:'续费月数',
            cardTitle:'停车月卡'
        };
    },
    computed: {
        ...mapState(["loginInfo","clientType"])
    },
    mounted() {
        console.info(this.clientType);
        if(!!this.$route.query) {
            this.getContractCardLists();
        }
    },
    methods: {
        getContractCardLists() {   // 车牌 车位 规则  3个条件确定一个月卡  通过规则找到价格
            this.dataLists = [];
            let params = {};
            if( !!this.$route.query.contract_id ) params = { contract_id:this.$route.query.contract_id };
            if( !!this.$route.query.ctt_car_id ) params = { ctt_car_id:this.$route.query.ctt_car_id };
            if( !!this.$route.query.plate ) params = { plate:this.$route.query.plate };
            if( !!this.$route.query.car_id ) params = { car_id:this.$route.query.car_id };
            this.$loading.show();
            utils.gateway(utils.api.getContractCarLists, params).then(res => {
                this.$loading.hide();
                if( res.code === 0 && !!res.content && Array.isArray(res.content) && res.content.length > 0 ) {
                    for(var k in res.content){
                        let tmp = res.content[k];
                        let car_id = String(tmp.car_id);  // 后端传的是超大整数 要转化成字符串
                        let station_id = parseInt(tmp.station_id);
                        let space_id = parseInt(tmp.space_id);

                        if( typeof( this.dataLists[ car_id ] ) == 'undefined' ) this.dataLists[ car_id ] = { car_id:car_id, plate:tmp.plate, stations:[] };
                        if( typeof( this.dataLists[ car_id ]['stations'][ station_id ] ) == 'undefined' ){
                            this.dataLists[ car_id ]['stations'][ station_id ] = { station_id:station_id, station_name:tmp.station_name, spaces:[] };
                        }

                        let rule = {
                            rule_id: parseInt(tmp.rule_id),
                            rule_name: tmp.rule_name,
                            rule_price: parseInt(tmp.price),
                            contract_id: tmp.contract_id,
                            contract_number: tmp.number,
                            ctt_car_id: tmp.ctt_car_id,
                            pay_month_max: parseInt(tmp.pay_month_max),
                            pay_month_min: parseInt(tmp.pay_month_min),
                            pay_deadline: tmp.deadline,
                            end_time: tmp.end_time,
                            payunit:tmp.payunit
                        };

                        if( typeof( this.dataLists[ car_id ]['stations'][ station_id ]['spaces'][ space_id ] ) == 'undefined' ){
                            this.dataLists[ car_id ]['stations'][ station_id ]['spaces'][ space_id ] = {space_id:space_id,space_name:tmp.space_name,rules:[ rule ]};
                        } else {
                            this.dataLists[ car_id ]['stations'][ station_id ]['spaces'][ space_id ][ 'rules' ].push(rule);
                        }
                    }
                    console.log(this.dataLists);
                    let temp = [];
                    for(var n in this.dataLists) temp.push(this.dataLists[n]);
                    this.carArr = temp.map((item,index) => {
                        return { index:index, value:item.car_id, name:item.plate };
                    });
                    this.getPropertyFee();
                    this.changeCar(this.carArr[0]);
                } else {
                    this.$vux.toast.show({ text:res.message, time:3000 });
                }
            });
        },
        /**
         * 彩之云做全额抵扣，彩惠小程序部分抵扣、全额抵扣都支持
         */
        getContractFee(){
            let params = { month_total:this.currMonth.value, contract_id:this.currRule.contract_id, ctt_car_id:this.currRule.ctt_car_id};
            this.amount = {total:0, coupon:0};
            this.noPay = true;
            this.$loading.show();
            utils.gateway(utils.api.getContractFee, params).then(res => {
                this.$loading.hide();
                if( res.code === 0 && !!res.content ) {
                    let tmp = res.content;
                    let coupon_info = tmp.coupon_info || {};
                    this.endTime = tmp.time_begin.replace(/-/g,"/");
                    this.deadline = tmp.time_end.replace(/-/g,"/");
                    this.amount.total = tmp.amount;  //实付金额
                    this.amount.total_amount = tmp.total_amount;  //应付金额
                    this.amount.coupon = coupon_info .coupon_money; //优惠金额
                    this.noPay = this.amount.total > 0 ? false : true; 

                    if(coupon_info.coupon_lists  && coupon_info.coupon_lists.length > 0){
                        let monthCardObj = coupon_info.coupon_lists.find(item => {
                            /* 优惠类型   
                            1 => '一卡通优惠',
                            2 => '优惠券优惠',
                            3 => '月卡折扣优惠',
                            4 => '银联无感', 
                            5 => '积分抵扣',
                            6 => '彩惠人生抵扣金', */
                            return parseInt(item.coupon_type) === 3;
                        })
                        console.log("备注：",(monthCardObj && !!monthCardObj.coupon_name));
                        if(monthCardObj && !!monthCardObj.coupon_name) { //处理月卡折扣备注
                            this.amount.remark = monthCardObj.coupon_name;
                        }

                        let deductionObj = coupon_info.coupon_lists.find(item => {
                            return item.coupon_type === 6;
                        })
                        
                        if ((this.clientType === 'CAIHUI' || this.clientType === 'CZY')  && deductionObj){ // 处理彩惠抵扣金
                            this.caihuiDeduction.coupon_amount = deductionObj.coupon_amount;
                            this.caihuiDeduction.coupon_uuid = deductionObj.coupon_uuid;
                            this.caihuiDeduction.defaultTotal = this.amount.total + 0; //存储实付金额副本 
                            this.$watch('caihuiDeduction.isUsed', this.handleUseDeduction);
                            this.caihuiDeduction.isUsed = true;
                        }

                        //实付金额=总金额-优惠金额
                        let haveToPay = parseFloat(this.amount.total_amount) - parseFloat(this.amount.coupon);
                        let deductionMoney = parseFloat(this.caihuiDeduction.coupon_amount);
                        /**
                         * （这里所提到的实付金额为haveToPay,应交金额为显示在卡片上的金额）
                         * 当用户存在抵扣金并且抵扣金金额大于0和应交金额大于0，彩之云及彩惠小程序显示抵扣金，由于抵扣金金额是后端按需返回，则前端无需处理抵扣金大小，抵扣金与实付金额相等时，应交0元,否则当客户端为彩惠小程序时应交实付金额-抵扣金金额
                         */
                        if(this.clientType === 'CZY' || this.clientType === 'CAIHUI'){
                            if(!!this.caihuiDeduction.coupon_amount && parseFloat(this.caihuiDeduction.coupon_amount) > 0 && haveToPay > 0){
                                this.hasDeduction = true;
                                if(deductionMoney >= parseFloat(haveToPay)){
                                    this.caihuiDeduction.coupon_amount = parseFloat(haveToPay).toFixed(2);
                                    this.payText = '确认抵扣';
                                    this.amount.total = '0';
                                }else if(deductionMoney < haveToPay && this.clientType === 'CAIHUI'){
                                    this.amount.total = (haveToPay - deductionMoney).toFixed(2);
                                    this.payText = '支付';
                                }else{
                                    this.caihuiDeduction.isUsed = false;
                                    this.hasDeduction = false;
                                    this.payText = '支付';
                                }
                            }
                        }else{
                            this.caihuiDeduction.isUsed = false;
                            this.hasDeduction = false;
                            this.payText = '支付';
                        }
                    }
                } else {
                    this.$vux.toast.show({ text:res.message, time:3000 });
                }
            });
        },
        handleUseDeduction (newVal, oldVal) {
            //实付金额=总金额-优惠金额
            let haveToPay = parseFloat(this.amount.total_amount) - parseFloat(this.amount.coupon);
            let deductionMoney = parseFloat(this.caihuiDeduction.coupon_amount);
            if(!newVal){
                this.payText = '支付';
                return this.amount.total = this.caihuiDeduction.defaultTotal;
            }else{
                if(deductionMoney >= parseFloat(haveToPay)){
                    this.caihuiDeduction.coupon_amount = parseFloat(haveToPay).toFixed(2);
                    this.payText = '确认抵扣';
                    this.amount.total = '0';
                }else if(deductionMoney < haveToPay && this.clientType === 'CAIHUI'){
                    this.amount.total = (haveToPay - deductionMoney).toFixed(2);
                    this.payText = '支付';
                }else{
                    this.payText = '支付';
                }
            }
            
        },
        changeCar(data){
            this.currCar = data;

            let tmp = [];
            for(var n in this.dataLists[ this.currCar['value'] ]['stations']) tmp.push(this.dataLists[ this.currCar['value'] ]['stations'][n]);
            this.stationArr = tmp.map((item, index) => {
                return { index:index, value:item.station_id, name:item.station_name };
            });

            this.changeStation(this.stationArr[0]);
            this.showStation = true;
        },
        selectStation() {
            this.stationPicker = true;
        },
        changeStation(data) {
            this.currStation = data;
            this.closeStation();
            
            let spaces = []; //车位
            for( var m in this.dataLists[ this.currCar['value'] ]['stations'][ data.value ]['spaces'] ){
                spaces.push( this.dataLists[ this.currCar['value'] ]['stations'][ data.value ]['spaces'][m] );
            }
            console.log('spaces:',spaces);
            if( spaces.length == 1 && spaces[0].space_name == "虚拟车位"){
                this.showSpace = false; //如果只有 虚拟车位  不用显示车位选择
                this.initRule(spaces[0]['rules']);
                this.changeRule(this.ruleArr[0]);
                this.showRule = true;
            } else {
                this.spaceArr = spaces.map((item,index) => {
                    var space_name = item.space_name + " - " + item.rules[0]['rule_name'];
                    return { index:index, value:item.space_id, name:space_name, rules:item.rules };
                })
                this.changeSpace(this.spaceArr[0]);
                this.showSpace = true;
            }
        },
        closeStation() {
            this.stationPicker = false;
        },
        selectSpace(){
            this.spacePicker = true;
        },
        changeSpace(data){
            this.currSpace = data;
            this.closeSpace();
            this.initRule(this.currSpace['rules']);
            this.changeRule(this.ruleArr[0]);
            this.setMonth(this.default_month);
            this.showRule = true;
        },
        closeSpace(){
            this.spacePicker = false;
        },
        selectRule() {
            this.rulePicker = true;
        },
        changeRule(data) {
            this.currRule = data;
            if(data.rule_price === 0){
                this.noPay = true;
            }else{
                this.noPay = false;
            }
            this.closeRule();
            if(this.currRule.payunit === 'Y'){
               this.initMonth(1, 1,'year');
               this.setMonth(1);
               this.timeText = '续费年数';
               this.cardTitle = '停车年卡';
            }else{
                this.initMonth(this.currRule.pay_month_min, 36,'month');  //展示36个月 不做限制
                var count = this.currRule.pay_month_min > this.default_month ? this.currRule.pay_month_min : this.default_month;
                this.setMonth( count );
            }
            
            this.showMonth = true;
        },
        initRule(data){
            this.ruleArr = data.map((item,index) => {
                let flag = item.payunit === 'Y'?'年':'月';
                return {
                    index:index,
                    value:item.rule_id,
                    name: (item.rule_name ? item.rule_name + ' ⋅ ' : '') + (item.rule_price/100) + '元/' + flag,
                    price:item.rule_price,
                    ctt_car_id:item.ctt_car_id,
                    contract_id:item.contract_id,
                    contract_number:item.contract_number,
                    pay_month_max:item.pay_month_max,
                    pay_month_min:item.pay_month_min,
                    pay_deadline:item.pay_deadline,
                    end_time:item.end_time,
                    payunit:item.payunit
                };
            })
        },
        closeRule() {
            this.rulePicker = false;
        },
        selectMonth() {
            this.monthPicker = true;
        },
        /**
         * type 为分类 month 月卡  year  年卡  season  季卡
         */
        initMonth(min,max,type){  //月份初始化
            console.log('initMonth',min,max);
            if(type === 'month'){
                this.monthArr = [];
                min = min <= 0 ? 0 : min - 1;
                for(var i = min; i < max; i++ ){
                    this.monthArr.push({ index:i,name: (i+1) + '个月',value:i+1 });
                }
            }else if(type === 'year'){
                this.monthArr.push({ index:0,name: '1年',value:1 });
            }
            
        },
        setMonth(num){
            let flag = this.currRule.payunit === 'Y'?'年':'个月';
            this.changeMonth({ index:num - 1, name:num + flag, value:num });
        },
        changeMonth(data) {
            this.currMonth = data;
            this.closeMonth();
            this.getContractFee();  //调用计费接口
        },
        closeMonth() {
            this.monthPicker = false;
        },
        pay(){
            if( this.noPay == true ) return false;
            if ( this.clientType === 'CAIHUI' || (this.clientType === 'CZY' && this.caihuiDeduction.isUsed)) {
                this.deductionPay();
            }else if ( this.loginInfo.app_id == 'czy'){
                this.czyPay();
            }else{
                this.wxPay();
            }
        },
        wxPay(){
            if( this.noPay == true ) return false;
            this.getPaySource().then(res => {
                if(!!res){
                    let t1 = this.endTime.replace(/\//g,"").substring(4);
                    let t2 = this.deadline.replace(/\//g,"").substring(4);
                    let params = {
                        month_total: this.currMonth.value,
                        contract_id: this.currRule.contract_id,
                        amount: parseInt(parseFloat(this.amount.total) * 100),
                        total_amount:parseInt(parseFloat(this.amount.total_amount) * 100),
                        client_id: this.loginInfo.client_id,
                        source: res,
                        body: "月卡缴费-" + this.currStation.name + "-" + this.currCar['name'] + "-" + t1 + "-" + t2,
                        openid: this.loginInfo.open_id,
                        return_url: window.location.protocol + "//" + window.location.host + '/temp/temp-result?feeType=month'
                    };
                    this.$loading.show();
                    utils.gateway(utils.api.payContract, params).then(res => {
                        this.$loading.hide();
                        if( res.code === 0 && !!res.content ) {
                            console.log(res.content);
                            window.location.href = res.content.redirect;
                        } else {
                            this.$vux.toast.show({ text:res.message, time:3000 });
                        }
                    });
                }else{
                    this.$vux.toast.show({ text:'该车场不支持缴费', time:3000 });
                }
            })
            
        },
        czyPay(){
            if( this.noPay == true ) return false;

            let t1 = this.endTime.replace(/\//g,"").substring(4);
            let t2 = this.deadline.replace(/\//g,"").substring(4);
            let params = {
                month_total: this.currMonth.value,
                contract_id: this.currRule.contract_id,
                amount: parseInt(parseFloat(this.amount.total) * 100),
                total_amount:parseInt(parseFloat(this.amount.total_amount) * 100),
                client_id: this.loginInfo.client_id,
                source: 'CZY',
                body: "月卡缴费-" + this.currStation.name + "-" + this.currCar['name'] + "-" + t1 + "-" + t2,
                openid: this.loginInfo.open_id,
                return_url: window.location.protocol + "//" + window.location.host + '/temp/temp-result?feeType=month'
            };
            this.$loading.show();
            utils.gateway(utils.api.getCzyMonthOrder, params).then(res => {
                this.$loading.hide();
                if( res.code === 0 && !!res.content ) {
                    console.log(res.content);
                    window.location.href = res.content.redirect;
                } else {
                    this.$vux.toast.show({ text:res.message, time:3000 });
                }
            });
        },
        deductionPay() {
            if( this.noPay == true ) return false;

            let t1 = this.endTime.replace(/\//g,"").substring(4);
            let t2 = this.deadline.replace(/\//g,"").substring(4);
            let attach = {};

            if (this.caihuiDeduction.isUsed) {
                attach.coupon_selected  = [this.caihuiDeduction.coupon_uuid];
            }
            
            let params = {
                month_total: this.currMonth.value,
                contract_id: this.currRule.contract_id,
                amount: parseInt(parseFloat(this.amount.total) * 100),
                total_amount:parseInt(parseFloat(this.amount.total_amount) * 100),
                client_id: this.loginInfo.client_id,
                source: this.clientType === 'CAIHUI' ?  'CAIHUI_MINIAPPS' : 'DEDUCTION',
                body: "月卡缴费-" + this.currStation.name + "-" + this.currCar['name'] + "-" + t1 + "-" + t2,
                openid: this.loginInfo.open_id,
                return_url: window.location.protocol + "//" + window.location.host + '/temp/temp-result?feeType=month',
                attach
            };
            this.$loading.show();
             utils.gateway(utils.api.getDeductionMonthOrder, params).then(res => {
                this.$loading.hide();
                if( res.code === 0 && !!res.content ) {
                    console.log(res.content);
                    if(!!res.content.redirect){
                        utils.caihuiMiniDeducation(res.content.third_tnum);
                    }else if(this.clientType !== 'CAIHUI' && !res.content.redirect){
                        this.$router.push({
                            path:'/temp/temp-result',
                            query:{
                                feeType:'month',
                                status:'success'
                            }
                        })
                    }else{
                        this.$vux.toast.show({ text:'抵扣成功！', time:3000 });
                        setTimeout(() => {
                            this.$router.push({
                                path:'/temp/temp-pay',
                                query:{
                                    type:'proxy'
                                }
                            })
                        })
                        
                    }
                } else {
                    this.$vux.toast.show({ text:res.message, time:3000 });
                }
            });

        },
        getPaySource(){
            let appid = this.loginInfo.app_id;
            let params = {
                station_id: this.currStation.value
            };
            // this.countDown();
            return utils.gateway(utils.api.getFeeInfoByStation, params).then(res => {
                if (
                    res.code === 0 &&
                    !!res.content &&
                    Array.isArray(res.content)
                ) {
                    if (res.content.length > 0) {
                        let result = res.content;
                        let tempArr = result.filter(item => {
                            return (
                                item.channel_appid === appid &&
                                item.paymethod_type === "MONTH"
                            );
                        });
                        if(tempArr.length > 0){
                            return tempArr[0].source;
                        }else{
                            return false
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            });
        },
        showMessageBox(content){
            this.$vux.confirm.show({
                title:'',
                content:`您在${content.community_name}的物业费尚未缴清，当前欠费${content.arrears}元，上彩惠缴物业费，一亿抵扣金大派送！`,
                confirmText:'挣上一个亿',
                cancelText:'算了吧',
                onCancel : () => {
                    console.log(this) //当前 vm
                },
                onConfirm : () => {
                    window.location.href = window.config.propertyURL;
                }
            })
        },
        getPropertyFee(){
            let czy_id = sessionStorage.getItem('czy_id');
            utils.gateway(utils.api.getCaihuiPropertyFee,{czy_id}).then(res => {
                if(res.code === 0 && !!res.content && !!res.content.arrears && parseFloat(res.content.arrears) > 0){
                        this.showMessageBox(res.content);
                }
            })
        }
    }
};
</script>
<style scoped>
.month-fee-checkbox{
    box-sizing: padding-box;
    position: relative;
    vertical-align: middle;
    appearance: none;
    width: 17px;
    height: 17px;
    padding: 2px;
    border: rgb(75, 204, 131) solid 3px;
    border-radius: 10px;
    outline: 0;
    background: #fff;
}
.month-fee-checkbox:checked{
    background: rgb(51, 51, 51);
    background-clip: content-box;
}
</style>