
<template>
  <!-- component/countdown/index.js
  @template
  <countdown bindtimeover="timeover" totalTime="{{120}}" initTime="{{60}}"></countdown>
  @desc
  接收@param initTime Number 初始化已执行时长
  接收@param totalTime Number 总时长
  例：
  initTime  默认值为600（10分钟）最大支持60分钟
  timeover   结束时  主动推送timeover事件 -->
    <div class='countdown-box'>
        <div class="point-box">
            <div v-for="(item,index) in steparr" :key="index" :class='item.bgcolor'></div>
        </div>
        <div class='countdown'>
            <div class='step' :style='{width:usewidth}'>
                <div class='bar'>
                    <div class='time-box'>
                        <span v-for="(item,index) in time" :key="index">{{item}}</span>
                    </div>
                    <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/home_tad_logo@2x.png" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'CountDown',
    data() {
        return {
            seconds: 600,
            usewidth: '',
            steparr: [],
            time: [1, 0, ':', 0, 0]
        }
    },
    props: {
        totalTime: {
            type: Number,
            value: 600
        },
        initTime: {
            type: Number,
            value: 600
        },
    },
    computed: {

    },
    watch: {
        initTime(){
            this.init();
        }
    },
    mounted() {
        this.init();
    },
    destroyed() {

    },
    methods: {

        init() {
            this.seconds = this.initTime > 3600 ? 3600 : this.initTime; //不大于小时
            this.time = this.secondsInit(this.seconds).split('');
            let initdata = this.stepOption;
            let arr = [];
            for (let i = 0; i < 2; i++) {
                let bgcolor = "point passcolor";
                arr.push({
                    i: i,
                    bgcolor: bgcolor
                })
            }
            this.timework(this.time)
        },
        timework(time) {
            if (!(time.length > 4)) return;
            this.seconds--;
            let work = true;
            if (time[4] > 0) {
                time[4]--;
            } else if (time[3] > 0) {
                time[3]--;
                time[4] = 9;
            } else if (time[1] > 0) {
                time[1]--;
                time[3] = 5;
                time[4] = 9;
            } else if (time[0] > 0) {
                time[0]--;
                time[1] = 9;
                time[3] = 5;
                time[4] = 9;
            } else {
                work = false;
                this.$emit('timeover');
                console.log('结束了')
            }
            if (work) {
                let totalTime = this.totalTime || this.initTime;
                this.usewidth = (((totalTime - this.seconds) / totalTime) * 100) - 5 + '%';
                setTimeout(() => {
                    this.timework(time);
                    console.log('time', time, 't', this.usewidth, this.initTime - this.seconds)
                }, 1000)
            }
        },
        secondsInit(s) {
            var h;
            h = Math.floor(s / 60);
            s = s % 60;
            h += '';
            s += '';
            h = (h.length == 1) ? '0' + h : h;
            s = (s.length == 1) ? '0' + s : s;
            return h + ':' + s;
        }
    }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
