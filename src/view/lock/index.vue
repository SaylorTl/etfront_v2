<template>
  <div class="page-lock-warpper">
    <div v-show="!lock">
      <lock-card @lockEmit="lockEmit"></lock-card>
      <lock-card @lockEmit="lockEmit"></lock-card>
      <lock-card @lockEmit="lockEmit"></lock-card>
      <lock-card @lockEmit="lockEmit"></lock-card>
    </div>
    <lock-info v-show="lock"></lock-info>
  </div>
</template>

<script>
  import LockCard from './card'
  import LockInfo from './lockInfo'
  export default {
    name: 'lock-park',
    components: {
      LockCard,
      LockInfo
    },
    data () {
      return {
        lock: false,
      }
    },
    methods: {
      lockEmit (item) {
        console.log(item)
        this.lock = true
      }
    },
  };
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
