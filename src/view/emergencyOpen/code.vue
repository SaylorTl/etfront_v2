<template>
    <div class="emergency-open-code page-wrapper">
        <div class="code-content">
            <label class="code-content__label">紧急开闸码</label>
            <div class="code-content__inner">
                <div class="code-content__inner__item--active">
                    +
                </div>
                <div
                    v-for="item in 3"
                    :key="item"
                    class="code-content__inner__item"
                >
                    +
                </div>
            </div>
            <div class="code-content__btn-container">
                <x-xbutton class="btn">立刻开闸</x-xbutton>
            </div>
        </div>
    </div>
</template>
<script>
export default {}
</script>
<style lang="less">
@import '~assets/css/mixin.less';
.code-content__inner__item {
    text-align: center;
    font-size: 0.5rem;
    width: 0.95rem;
    height: 0.95rem;
    line-height: 0.75rem;
    .border-1px(#999);
    color: #999;
}
.emergency-open-code {
    padding: 1.1rem 0.4rem 0;
    .code-content {
        &__label {
            color: #999;
        }
        &__inner {
            padding: 0.5rem 0.2rem;
            display: flex;
            justify-content: space-between;
        }
        &__inner__item--active {
            &:extend(.code-content__inner__item);
            .border-1px(#67c23a);
            &::after {
                border-style: dashed;
            }
            color: #67c23a;
        }
        &__btn-container {
            margin-top: 0.2rem;
        }
    }
}
</style>
