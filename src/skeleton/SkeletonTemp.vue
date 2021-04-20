<template>
    <div v-if="isShow" class="skeleton-temp page-temp-pay">
        <div class="temp-pay-ad skeleton-temp-ad">
            <div></div>
        </div>
        <div class="temp-card card">
            <div class="temp-label">
                <div class="skeleton-temp-title"></div>
                <div class="temp-history-btn">
                    <div class="special-btn"></div>
                    <div class="history-btn skeleton-temp-history">
                        <!-- <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/history-plate.svg" /> -->
                    </div>
                </div>
            </div>
            <div class="temp-plate">
                <div class="skeleton-temp-plate"></div>
            </div>
            <div class="temp-history"></div>
            <div class="temp-btn">
                <div class="skeleton-temp-btn"></div>
            </div>
            <div class="temp-tips">
                <div class="skeleton-temp-tips1"></div>
                <div class="skeleton-temp-tips2"></div>
                <!-- <p><span>*</span>1.车牌识别有误的车辆，到人工收费处缴费；</p>
                <p>2.请在免费出场时间内离场，超时需要补缴停车费。</p>-->
            </div>
        </div>
        <div class="temp-pay-call skeleton-temp-call"></div>
        <div class="temp-pay-skip-btn card">
            <!-- <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/home_tad_logo@2x.png">
            <div>主功能页面入口</div>-->
        </div>
    </div>
</template>
<script>
export default {
    name: "skeleton-temp",
    props: ["isShow"]
};
</script>
<style lang="less">
.skeleton-temp {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: #fff;
    .skeleton-temp-ad {
        & > div {
            max-width: 100%;
            height: 1.2rem;
            background: #eee;
            border-radius: 0.15rem;
        }
    }
    .skeleton-temp-title {
        height: 0.6rem;
        width: 3rem;
        background: #eee;
    }
    .skeleton-temp-history {
        background: #eee;
    }
    .skeleton-temp-plate {
        width: 100%;
        height: 0.72rem;
        background: #eee;
    }
    .skeleton-temp-btn {
        width: 100%;
        height: 1rem;
        background: #eee;
    }
    .skeleton-temp-tips1,
    .skeleton-temp-tips2 {
        width: 4rem;
        height: 0.3rem;
        background: #eee;
        margin: auto;
        margin-top: 0.1rem;
    }
    .skeleton-temp-call {
        background: #eee;
        margin-top: 0.3rem;
        width: 2rem;
        height: 1.6rem;
        right: 0.32rem;
    }
}
</style>
