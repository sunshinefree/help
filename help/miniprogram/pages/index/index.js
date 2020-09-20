//index.js
const app = getApp()
const db =  wx.cloud.database()
Page({
  data: {
    logined:wx.getStorageSync('logined'),
    helpList:[],
    topTabItems:["全部","最新","互助","陪玩","砍价","最新","互助","陪玩","砍价"],
    swiperList:[
      {
      imageUrl:"https://hbimg.huabanimg.com/e6b5a0f837140922859ef5c41d04d03c00a7b942237ad-YdOvf2_fw658/format/webp"
      },
      {
        imageUrl:"https://hbimg.huabanimg.com/fdc06a061865eb687acd20b4763f4f9e00dae087281c0-vwxwmy_fw658/format/webp"
      },
  ],
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged:false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {


    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
onShow(){
  this.onGetHelpList()
},

  switchTab:function(e){
    this.setData({
      currentTopItem:e.currentTarget.dataset.idx
    });
    // //如果需要加载数据
    // if (this.needLoadNewDataAfterSwiper()) {
    //   this.refreshNewData();
    // }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '快来帮帮ta吧',
      path: '/pages/index/detail?_id=' + wx.getStorageSync('item')._id
    }
  },
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  //新用户进 如何在集合添加一个用户

  db.collection("helper").where({
    openid:wx.getStorageSync('openid'),
  }).count({
    success(ress){
      wx.setStorageSync('logged', true)
      console.log(ress,"45454")
      if(ress.total == 0){
        db.collection("helper").add({
          data:{
            openid:wx.getStorageSync('openid'),
           ...e.detail.userInfo,
           creditValue:100     
             }
        }).then(ress => {


        })
        .catch(console.error)
      }

      else{
        wx.showToast({
          title: '用户登录成功',
        })
      }
    }
  })
    console.log(e)
wx.setStorageSync('userInfo', e.detail.userInfo)
    this.onGetOpenid()
  },


  onGetHelpList: function() {
    // 查询系统所有的 help  求助信息 
    db.collection('help').where({
 show:true
    }).orderBy('createTime', 'desc').get({
      success: res => {
        this.setData({
           helpList:res.data
        })
        console.log(res,'获取help信息成功')
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

toDetail(e){
console.log(e)
wx.setStorageSync('item', e.currentTarget.dataset.item)
wx.navigateTo({
  url: '/pages/index/detail?_id=' +   wx.getStorageSync('item')._id,
})
},
addHelp(){
wx.navigateTo({
  url: '/pages/newHelp/newHelp',
})
},



  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
wx.setStorageSync('openid', res.result.openid)
      },

    })
  },
})
