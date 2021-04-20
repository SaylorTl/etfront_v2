
<template>
<!-- 
  @template
   <expression status='default'></expression>
  @example

  @desc
  接收@param {expressionStatus} [String] 配置参数
  例：
  expressionStatus:'default'
  success,fail,warning,default 
 -->
    <div class='expression'>
        <img v-if="status=='success'" src='https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/20190319/eyes-smile.png' class='eyes success' />
        <img v-if="status=='success'" src='https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/20190319/robot-green.png' class='main' />

        <img v-if="status=='fail'" src='https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/20190319/eyes-depressed.png' class='eyes fail' />
        <img v-if="status=='fail'" src='https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/20190319/robot-red.png' class='main' />

        <img v-if="status=='warning'" src='https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/20190319/eyes-despise.png' class='eyes warning' />
        <img v-if="status=='warning'" src='https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/20190319/robot-yellow.png' class='main'>

        <img v-if="status=='default'" src='https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/20190319/eyes-daze.png' class='eyes default' />
        <img v-if="status=='default'" src='https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/20190319/robot-gray.png' class='main' />
    </div>
</template>
<script>

export default {
    name: 'Expression',
    props: {
        status: {
            type: String,
            value: 'default'
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
    }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
