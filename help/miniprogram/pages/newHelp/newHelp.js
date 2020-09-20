// miniprogram/pages/newHelp/newHelp.js
let   createTime 
let step 
let title
let verifyImgUrl = "/images/kongImg.png"
Page({

  /**
   * 页面的初始数据
   */
  data: {

    verifyImg:"/images/kongImg.png"
  },
chooseImg(){
  wx.showLoading({
    title: '正在发布',
  })
  var that  = this
wx.chooseImage({
  complete: (res) => {
    console.log(res,"选择图片成国公")
   verifyImgUrl =res.tempFilePaths[0]
    const filePath =  verifyImgUrl
var time = new Date().getTime()
    // 上传图片
    const cloudPath ="help/" + time+ filePath.match(/\.[^.]+?$/)[0]
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: re => {
        console.log('[上传文件] 成功：', re)
        // app.globalData.fileID = res.fileID
        // app.globalData.cloudPath = cloudPath
        // app.globalData.imagePath = filePath
that.setData({
verifyImg:re.fileID,

})
wx.hideLoading()
verifyImgUrl =re.fileID



  },
})


  },
})
},

title(e){
title  = e.detail.value
},
steps(e){
step  = e.detail.value
},
fabu(){
  wx.showLoading({
    title: '正在发布',
  })
  const db  = wx.cloud.database()
  createTime  = new Date().getTime()
  var that =this
  db.collection("help").add({
    data:{
      title,
   ...wx.getStorageSync('userInfo'),
    createTime,
    show:true,
    verifyImgUrls:verifyImgUrl,
      "reward": 10.0,

      // "creditValue": that.data.helper.creditValue,

      "limitTime": 180000.0,

      "taskSteps": [
        {
          "body":step,
          "head": title,
          "imageUrl": verifyImgUrl
        }
      ],
      "totalNum": 1,
      "finishNum": 0.0,
      "viewNum": 0.0,
      "visitorNum": 0.0,
      "appreciateNum": 20.0,
      "finishUser": [
        {
          "avatarUrl": "https://hbimg.huabanimg.com/46d97d08d969460005701dcb28c33da6e18531b419b94b-sk0vOg_fw658/format/webp",
          "nickName": "下小雨儿",
          "openid": "121313"
        }
      ],


      "sortName": "互助",
      // "joinNum": 0
    },
    success(res){
console.log(res,"发布新的互助消息")
wx.hideLoading(
)
wx.switchTab({
  url: '/pages/index/index',
})
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(wx.getStorageSync('openid'))
    var that =this
  const db =wx.cloud.database()
  db.collection("helper").where({
    _openid:wx.getStorageSync('openid')
  }).get({
    success(res){
      console.log(res,'互助值获取')
      that.setData({
        helper:res.data[0]
      })
    }
  })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})