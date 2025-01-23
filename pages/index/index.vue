<!-- 本地分页示例 -->
<template>
  <z-paging 
    ref="paging" 
    v-model="dataList" 
    @query="queryList"   
    :defaultPageSize="40"
    :refresherEnabled="true"
  >
    <view 
      class="item_box" 
      v-for="(item,index) in dataList"
      :key="index"
      @tap="handleReLaunch(item)"
    >
        <view class="info_box">
          <view>企业名称：{{item.companyShortName}}</view>
          <view>添加时间：{{item.addDate}}</view>
        </view>
        <view class="info_box">
          <view>设备编号：{{ item.equipmentNumber }}</view>
          <view>出厂编号：{{item.manufacturingNumber}}</view>
        </view>
        <view class="info_box">
          <view>绑定点位：{{item.positionName}}</view>
        </view>
        <view class="info_box">
          <view>类型：{{getType(item.ufanCashRegisterType)}}</view>
        </view>
    </view>
  </z-paging>
</template>

<script>
  import { getCashierList } from '@/api/cashier'
  const CashRegisterType = {
    GENERAL_CASH_REGISTER: { code: 0, name: "手持收银机" }, // 原普通收银机修改为手持收银机
    WEIGH_CASH_REGISTER: { code: 1, name: "称重收银机" }, // 废除
    ICCARD_CASH_REGISTER: { code: 2, name: "IC卡收银机" }, // 废除
    WGGAI_VISUAL_CASH_REGISTER: { code: 3, name: "戈子视觉结算台" }, // 废除
    BUFFET_CASH_REGISTER: { code: 4, name: "竖屏点餐机" }, // 废除
    DOUBLE_SCREEN_WEIGH_CASH_REGISTER: { code: 6, name: "双屏称重收银机" }, // 废弃
    VIRTUAL_CASH_REGISTER: { code: 7, name: "虚拟收银机" }, // 虚拟收银机
    DOUBLE_SCREEN_CASH_REGISTER: { code: 5, name: "台式收银机" } // 原双屏收银机修改为台式收银机
  }
  export default {
    data() {
        return {
            dataList: []
        };
    },
    onLoad() {
    },
    methods: {
      getType(type) {
        return CashRegisterType[type]?.name || ''
      },
      async queryList() {
        try {
          const { code, data } = await getCashierList()
          if(code == 200) {
            this.$refs.paging.complete(data.list);
          } else {
            this.$refs.paging.complete([]);
          }
        }catch(e) {
          this.$refs.paging.complete([]);
        }
      },
      handleReLaunch(item) {
        uni.setStorageSync('Cashier_Detail', item)
        this.$tab.navigateTo('/pages/index/cashier/detail')
      }
    },
  }
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
      font-size: 26rpx;
      & > view{
        flex:1;
        &:nth-child(2) {
          // text-align: right;
        }
      }
    }
  }
</style>