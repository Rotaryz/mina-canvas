<template>
  <div class="toast" v-if="showToast">
    <div class="content">{{content}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        showToast: false,
        content: ''
      }
    },
    methods: {
      show (content) {
        if (this.showToast) {
          return
        }
        this.content = content
        this.showToast = true
        setTimeout(() => {
          this.showToast = false
        }, 2000)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .toast
    position: fixed
    z-index: 99999
    top: 42%
    left: 50%
    max-width: 170px
    padding: 10px 15px
    border-radius: 2px
    transform: translateX(-50%)
    text-align: center
    background-color: rgba(54, 53, 71, .9)
    .content
      font-size: 14px
      font-family: 'PingFangSC-Regular'
      line-height: 20px
      color: #FFFFFF
</style>
