<template>
  <div class="g-wrapper">
    <div class="aaa"></div>
    <ep-scroll ref="scroll" class="bbb" @pulling-up="pullUp" :options="options" :data="items">
        <ul class="ccc" ref="ccc">
            <li v-for="(item,i) in items" :key="i">{{i}}</li>
        </ul>
    </ep-scroll>
  </div>
</template>
<script>
export default {
  components: {

  },
  data() {
    return {
      items: [],
      options: {
        pullUpLoad: {
          threshold: 0,
          txt: {
            more: '',
            noMore: '没有数据了'
          }
        },
        scrollbar: true
      },
      page: 1
    }
  },
  computed: {

  },
  created: function () {
    this.push(10)
  },
  beforeMount: function () {

  },
  mounted: function () {

  },
  beforeDestroy: function () {

  },
  destroyed: function () {

  },
  methods: {
    pullUp(done) {
      if (this.page > 0) {
         done();
        return;
      }
      this.page++;
      console.log(this.page)
      setTimeout(() => {
        this.push(10);
    //     this.$nextTick(() => {
    //       this.$refs['ccc'].refresh();
    //       // if (this.page == 3) {
    //       //   setTimeout(()=>{
    //       //     this.$refs['scroll'].forceUpdate();
    //       //   },500)
    //       // }
    //     })

      }, 2000)

    },
    push(count) {
      for (let i = 0; i < count; i++) {
        this.items.push({
          title: this.items.length + 1
        });
      }
    }
  },
  watch: {

  },
  directives: {

  }
}
</script>
<style lang="less">
    .g-wrapper{
        width:100%;
        height:100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        .aaa{
            width:100%;
            height:0.6rem;
            background:red;
        }
        .bbb{
            width:100%;
        }
        .ccc{
            width:100%;
            flex:1;
            li{
                line-height: 1rem;
                border-bottom:1px solid #ddd;
            }
        }
    }
</style>