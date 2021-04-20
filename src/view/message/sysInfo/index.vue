<template>
	<div>
		<div class="page-sys-info-time">2019/3/12</div>
		<card-item></card-item>
		<card-item :isSysInfo=true></card-item>
		<card-item :showButton=true></card-item>
	</div>
</template>
<script>
	import CardItem from '../card/index.vue'
	export default {
		name: 'sysInfo',
		components: {
			CardItem
		},
		props: [
		],
	}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
