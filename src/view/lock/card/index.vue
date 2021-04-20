<template>
  <div class="card ui-page-lock-card" @click.stop="lockEmit">
    <div class="ui-flex ui-flex-row ui-content-center">
      <img class="ui-self-center ui-page-lock-card-icon" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/icon_parkingunlock@2x.png" alt="" />
      <div class="ui-flex ui-flex-row ui-self-center ui-flex-8 ui-content-between ui-card-content">
				<div class="ui-flex ui-flex-col">
					<h3 class="ui-h3">彩悦A5车位锁</h3>
					<p class="ui-page-lock-card-dec">彩悦酒店停车场</p>
				</div>
				<div class="ui-flex ui-flex-col ui-justify-end">
					<p class="ui-page-lock-card-btn">共享车位</p>
				</div>
			</div>
    </div>
  </div>
</template>

<script>
    // https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/icon_parkinglock@2x.png
  export default {
    name: 'lock-card',
    methods: {
      lockEmit () {
        this.$emit('lockEmit', {name: '彩悦A5车位锁'})
      }
    },
  };
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
