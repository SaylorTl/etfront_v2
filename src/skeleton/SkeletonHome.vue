<template>
    <div v-if="isShow" class="page-home skeleton-home">
        <div class="home-tab skeleton-home-tab"></div>
        <div class="tab-content">
            <div class="page-mine">
                <div class="card mine-info">
                    <div class="mine-info-top">
                        <div>
                            <div class="skeleton-home-name"></div>
                            <div class="skeleton-home-intro"></div>
                        </div>
                        <div class="skeleton-home-avatar"></div>
                    </div>
                    <div class="mine-info-bottom">
                        <div class="skeleton-home-type"></div>
                        <div></div>
                    </div>
                </div>
                <div class="mine-hr">
                    <!--分割线-->
                </div>
                <div class="card mine-card">
                    <div class="mine-card-title skeleton-home-title"></div>
                    <div class="mine-card-content">
                        <div class="mine-card-content-item">
                            <div class="mine-card-content-item-pic border skeleton-home-pic"></div>
                            <div class="skeleton-home-item-title"></div>
                        </div>
                        <div class="mine-card-content-item">
                            <div class="mine-card-content-item-pic border skeleton-home-pic"></div>
                            <div class="skeleton-home-item-title"></div>
                        </div>
                        <div class="mine-card-content-item">
                            <div class="mine-card-content-item-pic border skeleton-home-pic"></div>
                            <div class="skeleton-home-item-title"></div>
                        </div>
                        <div class="mine-card-content-item">
                            <div class="mine-card-content-item-pic border skeleton-home-pic"></div>
                            <div class="skeleton-home-item-title"></div>
                        </div>
                    </div>
                </div>
                <div class="card mine-card">
                    <div class="mine-card-title skeleton-home-title"></div>
                    <div class="mine-card-content">
                        <div class="mine-card-content-item">
                            <div class="mine-card-content-item-pic border skeleton-home-pic"></div>
                            <div class="skeleton-home-item-title"></div>
                        </div>
                        <div class="mine-card-content-item">
                            <div class="mine-card-content-item-pic border skeleton-home-pic"></div>
                            <div class="skeleton-home-item-title"></div>
                        </div>
                        <div class="mine-card-content-item">
                            <div class="mine-card-content-item-pic border skeleton-home-pic"></div>
                            <div class="skeleton-home-item-title"></div>
                        </div>
                        <div class="mine-card-content-item">
                            <div class="mine-card-content-item-pic border skeleton-home-pic"></div>
                            <div class="skeleton-home-item-title"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "skeleton-home",
    props: ["isShow"]
};
</script>
<style lang="less">
.skeleton-home {
    .skeleton-home-tab {
        background: #eee;
    }
    .skeleton-home-name {
        width: 2rem;
        background: #eee;
        height: 0.48rem;
    }
    .skeleton-home-intro {
        width: 4rem;
        height: 0.2rem;
        background: #eee !important;
    }
    .skeleton-home-avatar {
        background: #eee;
        border-radius: 0.15rem;
    }
    .skeleton-home-type {
        width: 3rem;
        height: 0.2rem;
        background: #eee;
    }
    .skeleton-home-title {
        width: 4rem;
        height: 0.6rem;
        background: #eee;
    }
    .skeleton-home-pic {
        background: #eee;
    }
    .skeleton-home-item-title {
        width: 1.5rem;
        height: 0.4rem;
        background: #eee;
    }
}
</style>