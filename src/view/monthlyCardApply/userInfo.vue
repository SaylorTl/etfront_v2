<template>
    <div class="monthly-card-apply-user page-wrapper">
        <header class="user__header">
            <i class="user__header__icon"></i>
            <span>香缇雅苑/金桔苑一栋/一单元 302/业</span>
        </header>
        <div class="user__form">
            <x-xinput
                title="申请人手机号"
                text-align="right"
                placeholder="输入手机号"
                :show-clear="false"
            />
            <x-xinput
                title="申请人姓名"
                text-align="right"
                placeholder="请输入"
                :show-clear="false"
            />
        </div>
        <div class="user__btn-container">
            <x-xbutton
                class="btn"
                @click.native="handleSubmit"
            >下一步</x-xbutton>
        </div>
    </div>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>
.monthly-card-apply-user {
    .weui-label {
        color: #303030;
        font-weight: 600;
    }
    .weui-cell {
        padding-left: 0;
        padding-right: 0;
        &::before {
            left: 0;
        }
    }
    .user {
        &__header {
            color: #47b363;
            display: flex;
            align-items: center;
            &__icon {
                display: inline-block;
                width: 0.3rem;
                height: 0.3rem;
                background: url(https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190321/icon_home.svg)
                    left center no-repeat;
                background-size: 100% 100%;
                margin-right: 0.08rem;
            }
        }
        &__form,
        &__btn-container {
            margin-top: 0.5rem;
        }
    }
}
</style>
