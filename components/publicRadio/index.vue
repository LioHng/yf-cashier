<template>
  <view class="imageContainer" @click.stop="handleChange">
    <image :src="imageUrl" />
  </view>
</template>
<script>
import radioIcon from '@/static/images/svg/radio.svg'
import radioSelectedIcon from '@/static/images/svg/radioSelected.svg'

export default {
  name: 'PublicRadio',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    imageUrl() {
      return this.value ? radioSelectedIcon : radioIcon
    }
  },
  methods: {
    handleChange() {
      this.$emit('input', !this.value)
    }
  }
}
</script>
<style scoped lang="scss">
.imageContainer {
    width: 34rpx;
    height: 34rpx;

    image {
        width: 100%;
        height: 100%;
    }
}
</style>
