<template>
  <div class="page-lock-info">
    <div class="card page-lock-info-card">
      <div class="ui-flex ui-flex-row ui-content-center ui-content-between">
        <div class="ui-flex ui-flex-col ui-justify-center">
          <h2 class="ui-h2">彩悦 A4车位锁</h2>
          <div class="ui-fs12 ui-flex ui-flex-row ui-items-center">
            <img class="page-lock-info-p" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/icon_parking@3x.png" alt="">
            <p class="page-lock-info-name">彩悦酒店停车场</p>
          </div>
        </div>
        <img class="page-lock-info-icon" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/icon_parkinglock@2x.png" alt="" />
      </div>
    </div>
    <div class="page-lock-info-from">
      <div class="ui-flex ui-flex-col ui-content-center ui-fs14 ui-fw-600">
        <div class="ui-flex ui-flex-row ui-content-between ui-items-center page-lock-info-from-item">
          <p class="ui-ft-color-666">车位锁状态</p>
          <p class="ui-ft-color-30">升起</p>
        </div>
        <div class="ui-flex ui-flex-row ui-content-between ui-items-center page-lock-info-from-item">
          <p class="ui-ft-color-666">车位锁编号</p>
          <p class="ui-ft-color-30">hgds321</p>
        </div>
        <div class="ui-flex ui-flex-row ui-content-between ui-items-center page-lock-info-from-item">
          <p class="ui-ft-color-666">停车场地址</p>
          <p class="ui-ft-color-30">深圳市龙华区留仙大道34号</p>
        </div>
        <div class="ui-flex ui-flex-row ui-content-between ui-items-center page-lock-info-from-item">
          <p class="ui-ft-color-666">共享车位记录</p>
          <p class="page-lock-info-from-look">查看</p>
        </div>
      </div>
    </div>
    <div class="ui-flex temp-btn">
      <button class="ui-content-center ui-justify-center btn btn_primary">共享车位</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'lock-info',
  };
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
