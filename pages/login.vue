<template>
  <view class="container">
    <view class="logo_box IMG">
      <image src="@/static/images/logo.png" mode="scaleToFill" />
    </view>
    <view class="form">
      <view :class="this.focusInputName === 'account'" class="formField flex items-center">
        <zui-svg-icon icon="user" width="42rpx" color="#bfbfbf" class="mr32" />
        <input
          v-model="form.account"
          class="input"
          placeholder="请输入手机号 / 账号"
          placeholder-class="placeholder"
          :maxlength="accountMaxLength"
          :type="accountType"
          @input="handleInputAccount"
          @blur="setFocusInput('')"
          @focus="setFocusInput('account')"
        >
      </view>
      <view v-show="isPwdLogin" :class="this.focusInputName === 'password'" class="formField flex items-center">
        <zui-svg-icon icon="cryptographic" width="42rpx" color="#bfbfbf" class="mr32" />
        <input
          v-model="form.password"
          class="input"
          placeholder="请输入密码"
          placeholder-class="placeholder"
          maxlength="16"
          :password="passwordIptType"
          @input="handleInputPwd"
          @blur="setFocusInput('')"
          @focus="setFocusInput('password')"
        >
        <zui-svg-icon
          class="mlAuto"
          :icon="eyesIconName"
          color="#bfbfbf"
          width="42rpx"
          @click.native="handleToggleShowPwd"
        />
      </view>
      <view
        v-show="isCodeLogin"
        :class="this.focusInputName === 'vaildCode'"
        class="formField flex items-center"
      >
        <zui-svg-icon icon="cryptographic" width="42rpx" color="#bfbfbf" class="mr32" />
        <input
          v-model="form.vaildCode"
          class="input"
          maxlength="6"
          placeholder="请输入验证码"
          placeholder-class="placeholder"
          type="number"
          @blur="setFocusInput('')"
          @focus="setFocusInput('vaildCode')"
        >
        <view class="codeText" @click="getVerCode">{{ codeText }}</view>
      </view>
    </view>
    <!-- 商家的隐私 -->
    <view class="mt40 flex items-center" @click="changeUserTerms" v-if="0">
      <public-radio v-model="userTermsChecked" />
      <view class="f24 ml12">
        <text class="Black6">我同意</text>
        <text class="Orange3" @click.stop="handleToPrivacyAgreement">《悠饭商家数据使用及隐私协议》</text>
      </view>
    </view>
    <view :class="loginBtnClass" class="logoBtn" @click="handleLogin">登录</view>
    <view class="otherLoginMethod" v-if="0">
      <template v-if="isPwdLogin">
        <view class="text" @click="handleToggleLogin(2)">验证码登录</view>
        <view class="divider" />
        <view class="text" @click="toForgetPwd">忘记密码?</view>
      </template>
      <template v-else>
        <view class="text" @click="handleToggleLogin(1)">账号密码登录</view>
      </template>
    </view>
  </view>
</template>

<script>
import { isPhone, toast } from '@/utils/common'
import { mapMutations } from 'vuex'
import PublicRadio from '@/components/publicRadio/index.vue'
import { mixins } from '@/mixins/login'
const accountReg = /[^a-zA-Z0-9]/g
export default {
  name: 'Login',
  components: { PublicRadio },
  mixins: [mixins],
  data() {
    return {
      // 登录方式-1：账号密码登录;2：验证码登录`
      loginType: 1,
      form: {
        account: '13544344694',
        phone: '',
        password: '123456',
        vaildCode: ''
      },
      userTermsChecked: false
    }
  },
  computed: {
    accountMaxLength() {
      const lengthEnum = [23, 11]
      return lengthEnum[this.loginType - 1]
    },
    accountType() {
      const typeEnum = ['text', 'number']
      return typeEnum[this.loginType - 1]
    },
    isPwdLogin() {
      return this.loginType === 1
    },
    isCodeLogin() {
      return this.loginType === 2
    },
    loginBtnClass() {
      let disabled
      if (this.isPwdLogin) {
        disabled = !this.checkValidAccount() || !this.checkValidPassword()
      } else if (this.isCodeLogin) {
        disabled = !this.checkValidAccount() || !this.checkValidCode()
      }
      return {
        disabled
      }
    }
  },
  watch: {
    'form.account': function(val) {
      this.form.phone = val
    }
  },
  onLoad(options) {
    if (options.status) {
      this.$nextTick(() => {
        this.$refs['WriteOffAccount'].open()
      })
    }
  },
  methods: {
    ...mapMutations('ms_user', ['SET_ADMIN_USER', 'SET_MERCHANT_STORE']),
    handleInputAccount(e) {
      this.$nextTick(() => {
        this.form.account = e.target.value.replace(accountReg, '')
      })
    },
    checkValidAccount() {
      return this.form.account.length !== 0
    },
    checkValidPassword() {
      return this.form.password.length >= 6
    },
    checkValidCode() {
      return this.form.vaildCode.length === 6
    },
    async handleLogin() {
      if (this.loginBtnClass.disabled) return
      // if (!this.userTermsChecked) {
      //   return toast(`请先同意数据隐私协议`)
      // }
      const { account, phone, password, vaildCode } = this.form
      const isPwd = this.loginType === 1
      await this.$store.dispatch('user/Login', {
        loginType: this.loginType,
        phoneNumber: isPwd ? account : phone,
        passCode: isPwd ? password : vaildCode
      }).catch(({ message }) => this.$modal.msg(message || '登录失败'))
        this.$tab.switchTab('/pages/index')
    },
    async handleConfirm(picValidCode) {
      const params = {
        phoneNumber: this.form.account,
        picValidCode
      }
      // const { code } = await sendValidCode(params)
      const { code } = await Promise.resolve({ code: '200', message: '发送成功' })
      if (code === '200') {
        this.isFirstGetCode = false
        toast('发送成功')
        this.$refs.verifyCodePopup.close()
        this.handleVerifyCodeTime()
      }
    },
    async getVerCode() {
      if (this.verifyCodeTime === 0) {
        if (!isPhone(this.form.account)) {
          return toast('请输入正确的手机号')
        }
        // const { code, message } = await checkAccount({
        //   phoneNumber: this.form.account
        // })
				const { code, message } = await Promise.resolve({code: '200'})
        if (code !== '200') {
          return toast(message)
        }
        this.$refs.verifyCodePopup.open(this.form.account)
      }
    },
    handleToggleLogin(type) {
      this.loginType = type
    },
    changeUserTerms() {
      this.userTermsChecked = !this.userTermsChecked
    },
    toForgetPwd() {
      this.$tab.navigateTo(`/pages/login/forgetPwd/index`)
    },
    handleToPrivacyAgreement() {
      this.$tab.navigateTo(`/pages/common/webview/index?url=https://site.youfantech.cn/h5/merchantPrivacyPolicy.html&title=悠饭商家端隐私政策`)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
    padding: 0 64rpx;
    height: 100vh;
    padding-top: calc(var(--status-bar-height) + 118rpx);
    background-color: #fff;
    .logo_box {
        width: 232rpx;
        height: 92rpx;
    }

    .form {
        margin-top: 40rpx;

        .formField {
            transition: all 0.2s;
            padding: 40rpx 0;
            box-shadow: 0 -1rpx 0 0 #ddd inset;

            .codeText {
                color: #ff8010;
                margin-left: auto;
            }

            &.focus {
                box-shadow: 0 -1rpx 0 0 #ff8010 inset;
            }

            .input {
                flex: 1;

                &::placeholder {
                    font-size: 34rpx;
                    color: #bfbfbf;
                }

                outline: none;
                border: none;
                font-size: 30rpx;
                height: 40rpx;
                line-height: 40rpx;
                color: #262626;
            }
        }
    }

    .logoBtn {
        color: #ffffff;
        margin-top: 40rpx;
        text-align: center;
        height: 96rpx;
        line-height: 96rpx;
        font-size: 34rpx;
        font-weight: bold;
        border-radius: 16rpx;
        background: #ff8010;

        &.disabled {
            background: #ddd;
        }
    }

    .otherLoginMethod {
        margin-top: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 34rpx;
        color: #8c8c8c;

        .divider {
            margin: 0 24rpx;
            background: #bfbfbf;
            width: 2rpx;
            height: 26rpx;
        }
    }

    .settled {
        z-index: 10;
        position: absolute;
        left: 50%;
        bottom: 160rpx;
        transform: translateX(-50%);
        color: #ff8010;
    }
}
</style>
