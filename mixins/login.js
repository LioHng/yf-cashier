export const mixins = {
  data() {
    return {
      focusInputName: '',
      // 验证码倒计时
      verifyCodeTime: 0,
      // 验证码倒计时定时器实例
      verifyCodeTimeInstance: null,
      // 是否第一次获取验证码
      isFirstGetCode: true,
      showPwd: false
    }
  },
  computed: {
    codeText() {
      const { verifyCodeTime } = this
      if (verifyCodeTime === 0) {
        if (this.isFirstGetCode) {
          return `获取验证码`
        } else {
          return `重新获取`
        }
      } else {
        return `${verifyCodeTime}s后重新获取`
      }
    },
    eyesIconName() {
      return this.showPwd ? 'eyes-open' : 'eyes-close'
    },
    passwordIptType() {
      return !this.showPwd
    }
  },
  methods: {
    handleInputPwd(e) {
      const pattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
      if (!pattern.test(e.target.value)) {
        this.$nextTick(() => {
          this.form.password = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '')
        })
      }
    },
    handleToggleShowPwd() {
      this.showPwd = !this.showPwd
    },
    focusClass(name) {
      return {
        focus: this.focusInputName === name
      }
    },
    setFocusInput(name) {
      this.focusInputName = name
    },
    handleVerifyCodeTime() {
      if (this.verifyCodeTime === 0) {
        if (this.verifyCodeTimeInstance) {
          clearInterval(this.verifyCodeTimeInstance)
        }
        this.verifyCodeTime = 60
        this.verifyCodeTimeInstance = setInterval(() => {
          if (this.verifyCodeTime !== 0) {
            this.verifyCodeTime -= 1
          } else {
            clearInterval(this.verifyCodeTimeInstance)
          }
        }, 1000)
      }
    }
  }
}
