<!-- 本地分页示例 -->
<template>
  <z-paging 
    ref="paging" 
    v-model="dataList" 
    @query="queryList"   
    :defaultPageSize="40"
    :refresherEnabled="true"
  >
    <!-- <template #top >
      <view class="header-title">收银机列表</view>
    </template> -->
    <view 
      class="item_box" 
      v-for="(item,index) in dataList" 
      @tap="handleReLaunch"
    >
        <view class="info_box">
          <view>企业名称：悠饭深圳009</view>
          <view>绑定点位：深圳001</view>
        </view>
        <view class="info_box">
          <view>设备编号：CLF900{{ index }}</view>
          <view>出场编号：CD132123</view>
        </view>
        <view class="info_box">
          <view>类型：台式收银机</view>
          <view>添加时间：CD132123</view>
        </view>
    </view>
  </z-paging>
</template>

<script>
  export default {
      data() {
          return {
              dataList: []
          };
      },
      methods: {
          queryList() {
            const numbers = Array.from(Array(100).keys(), n => n + 1);
            this.$refs.paging.setLocalPaging(numbers);
              // 这里的请求只是演示，请替换成自己的项目的网络请求
              // this.$request.queryAllList().then(res => {
              //   // 设置本地分页并将服务端返回的完整列表数据传给z-paging，滚动到底部会在本地进行分页数据拼接，不会触发分页请求。下拉刷新或reload时会重新触发queryList
              //   this.$refs.paging.setLocalPaging(res.data.list);
              // })
          },
          handleReLaunch() {
            this.$tab.navigateTo('/pages/cashier/detail')
          }
      },
  };
</script>

<style lang="scss" scoped>
  .header-title {
    padding: 32rpx 32rpx 16rpx;
    font-size: 32rpx;
    font-weight: bold;
  }
  .item_box {
    margin:32rpx;
    background: #fff;
    margin-bottom: 20rpx;
    border-radius: 12rpx;
    padding: 32rpx;
    // &:first-child {
    //   margin-top: 0;
    // }
    .info_box{
      display: flex;
      justify-content: space-between;
      margin-bottom: 12rpx;
      view{
        flex:1;
        &:nth-last-of-type(1) {
          text-align: right;
        }
      }
    }
  }
</style>