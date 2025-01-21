<template>
  <view class="cashier">
    <view class="show_area">
      <view class="top align-center justify-between flex">
        <view class="pay_type">
          支付方式：xxx支付
        </view>
        <view class="flex align-center">
          <view class="uni-list-cell uni-list-cell-pd flex align-center">
            <view class="uni-list-cell-db">工作餐选择</view>
            <switch :checked="switchChecked" color="#FF8010" style="transform:scale(0.5)" />
          </view>
          <view class="flex align-center">
            <view class="uni-list-cell-db">连续扫码</view>
            <switch checked style="transform:scale(0.5)" color="#FF8010"/>
          </view>
        </view>
      </view>
      <view class="bottom">
        <view class="money_area">
          <view class="money">
            {{ money }}
          </view>
          <view class="discount">
            <view class="num">
             {{ finallyResult }}
            </view>
            <view class="text">
              8折优惠 折扣收款 ￥10
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="number_btn_list">
      <view class="btn_list">
        <view class="btn_item flex">
          <view class="item" @tap="handleReplaceMoney(10)">￥10</view>
          <view class="item" @tap="handleReplaceMoney(20)">￥20</view>
          <view class="item" @tap="handleReplaceMoney(30)">￥30</view>
          <view class="item" @tap="handleReplaceMoney(40)">￥40</view>
        </view>
        <view class="btn_item flex">
          <view class="section_list">
            <view class="item_list">
              <view class="last_item" @tap="handleClear">AC</view>
              <view class="last_item" @tap="handleDelete">X</view>
            </view>
            <view class="item_list flex">
              <view class="last_item f40" @tap="handleNum(7)">7</view>
              <view class="last_item f40" @tap="handleNum(8)">8</view>
              <view class="last_item f40" @tap="handleNum(9)">9</view>
            </view>
          </view>
          <view class="section_item f40" @tap="handleNum('+')">
            +
          </view>
        </view>
        <view class="btn_item flex Height90">
          <view class="item f40" @tap="handleNum(4)">4</view>
          <view class="item f40" @tap="handleNum(5)">5</view>
          <view class="item f40" @tap="handleNum(6)">6</view>
          <view class="item">打印<br />小票</view>
        </view>
        <view class="btn_item flex">
          <view class="section_list">
            <view class="item_list flex">
              <view class="last_item f40" @tap="handleNum(1)">1</view>
              <view class="last_item f40" @tap="handleNum(2)">2</view>
              <view class="last_item f40" @tap="handleNum(3)">3</view>
            </view>
            <view class="item_list">
              <view class="last_item f40" @tap="handleNum(0)">0</view>
              <view class="last_item f40" @tap="handleNum('.')">.</view>
            </view>
          </view>
          <view class="section_item confirm" @tap="handleConfirm()">
            确定
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default ({
  data() {
    return {
      switchChecked: true,
      money:'0',
      finallyResult:0
    }
  },
  methods: {
    onSwitchChange() {

    },
    // 累加
    handleNum(item) {
      if(this.money === '0') {
        this.money = item === 0 ? '0' : `${item}`
        return
      }
      this.money = `${this.money}` + item
      if(this.money.indexOf('+') != -1) {
        this.handleAddFn()
      }else{
        this.finallyResult =  this.money
      }
    },
    // 删除
    handleDelete() {
      if( this.money === '0') {
        return
      }
      this.money =  this.money.substr(0, this.money.length - 1);
      if( this.money === '') {
        this.money = '0'
      }
      if(this.money.indexOf('+') != -1) {
        this.handleAddFn()
      }else{
        this.finallyResult =  this.money
      }
    },
    // 加的处理方法
    handleAddFn() {
      let numbersStr =  []
      numbersStr = this.money.split("+");
      this.finallyResult = numbersStr.reduce((accumulator, currentValue) => Number(accumulator) +  Number(currentValue));
    },
    // 清空
    handleClear() {
      this.money = '0'
      this.finallyResult = 0
    },
    // 直接替换金额
    handleReplaceMoney(handleReplaceMoney) {
      this.money = `${handleReplaceMoney}`
      this.finallyResult = handleReplaceMoney
    },
    handleConfirm() {
      uni.scanCode({
        success: (res) => {
          console.log('扫描结果:', res.result);
          uni.showToast({
            title: '扫描成功: ' + res.result,
            icon: 'none'
          });
        },
        fail: (err) => {
          console.error('扫描失败:', err);
          uni.showToast({
            title: '扫描失败',
            icon: 'none'
          });
        }
      });
    }
  }
})
</script>

<style lang="scss" scoped>
.cashier {
  display: flex;
  flex-direction: column;
  // height: calc(100vh - 44px - env(safe-area-inset-top));
  height: calc(100vh - 44px );
  .show_area {
    font-size: 26rpx;
    flex: 1;
    background: #fff;
    padding: 20rpx 32rpx;
    flex: 1;
    display: flex;
    flex-direction: column;
    .top {
      .uni-list-cell-db {
        font-size: 24rpx;
      }
      .pay_type {
        font-size: 24rpx;
        flex: 1;
      }
      &::v-deep uni-switch{
        &::before {
          transform:scale(0,0) !important;
          -webkit-transform:scale(0,0) !important;
        }
      }
    }
    .bottom {
      flex: 1;
      display: flex;
      align-items: flex-end;
      .money_area {
        width: 100%;
        .money {
          width: 100%;
          font-size: 60rpx;
          font-weight: bold;
        }
        .discount {
          display: flex;
          width: 100%;
          justify-content: flex-end;
          flex-wrap: wrap;
          color: #8c8c8c;
          .num {
            font-size: 40rpx;
            font-weight: bold;
          }
          .text {
            width: 100%;
            text-align: right;
            margin-top: 8rpx;
            font-size: 24rpx;
          }
        }
      }
     
    }
  }

  .number_btn_list {
    background: rgb(243, 243, 243);
    padding: 20rpx 48rpx;

    .btn_list {
      .btn_item {
        display: flex;
        margin-bottom: 20rpx;
        font-weight: bold;
        color: rgb(91,91,91);
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
        .item {
          display: flex;
          background: #fff;
          margin-right: 20rpx;
          justify-content: center;
          border-radius: 8rpx;
          width: 150rpx;
          height: 70rpx;
          align-items: center;

          &:nth-last-child(1) {
            margin-right: 0;
          }
        }

        .section_list {
          flex: 1;

          .item_list {
            display: flex;
            margin-bottom: 20rpx;

            &:nth-last-of-type(1) {
              margin-bottom: 0;
            }

            .last_item {
              flex: 1;
              margin-right: 20rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 90rpx;
              border-radius: 8rpx;
              background: #fff;
            }
          }
        }

        .section_item {
          display: flex;
          width: 150rpx;
          background: #fff;
          border-radius: 16rpx;
          align-items: center;
          justify-content: center;
        }
        .confirm {
          background: #FF8010;
          color: #fff;
        }
      }

      .Height90 {
        .item {
          height: 90rpx;
        }
      }
    }
  }
}
.f40 {
  font-size: 38rpx;
}
.f60 {
  font-size: 40rpx;
}
</style>