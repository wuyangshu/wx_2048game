// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    ani: [],
    motto: '进入',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  handleGoGame() {
    console.log(111)
    wx.navigateTo({
      url: '/pages/game/game',
    })
    // this.start()
    // this.animate('.user-motto', [
    //   {
    //     translateY: -1000,
    //     ease: 'ease'
    //   },
    //   {
    //     translateY: 50,
    //     ease: 'ease',
    //   },
    //   {
    //     translateY: 0,
    //     ease: 'ease',
    //   },
    // ], 1000, function () {
    //   this.clearAnimation('.user-motto', function () {
    //     console.log("清除了#container上的属性")
    //   })
    // }.bind(this))
  },
  start() {
    console.log('开始动画')
    let animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    });
    animation.translate(150, 0).rotate(180).step()
    animation.opacity(0).scale(0).step()
    this.setData({
      ani: animation.export()
    })
  }
})