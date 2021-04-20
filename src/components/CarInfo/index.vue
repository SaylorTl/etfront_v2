
<template>
    <div class='carinfo line'>
        <div class="menber-tag" :class='{blue:carinfo.has_contract}'>{{carinfo.has_contract?'月卡':'临停'}}</div>
        <div @click="tempPay(carinfo)" class='plate'>{{carinfo.plate||'车牌缺失'}}</div>
        <div class='tag-box'>
            <div class='t1'>
                {{carinfo.color}}
            </div>
            <div class='t2'>
                {{carinfo.serial}}
            </div>
        </div>
        <div class='car-box'>
            <img @click='tocarDetails(carinfo)' onerror="this.src='http://cache.aparcar.cn/car/unknown.jpg'" :src="carinfo.logo||'http://cache.aparcar.cn/car/unknown.jpg'" />
        </div>
    </div>
</template>
<script>

export default {
    name: 'CarInfo',
    data() {
        return {
        }
    },
    props: {
        carinfo: {
            type: Object,
            default() {
                return { contracts: [] }
            }
        },
        menbertag: {
            type: Boolean,
            value: true
        }
    },
    computed: {

    },
    watch: {
    },
    mounted() {

    },
    destroyed() {

    },
    methods: {
        tempPay(carInfo) {
            this.$router.push({
                name: carInfo.plate ? (carInfo.is_parking?"temp-fee":"ui-stations") : "temp-pay",
                query: { plate:carInfo.plate,type:"station",urlName:"temp-fee"}
            });
        },
        tocarDetails(item) {
            this.$router.push({ path: '/car/car-info', query: { plate: item.plate } })
        }
    }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
