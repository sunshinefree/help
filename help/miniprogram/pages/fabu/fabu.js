// miniprogram/pages/fabu/fabu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onGetHelpList: function() {
    // 查询系统所有的 help  求助信息 
    const db =wx.cloud.database()
    db.collection('help').where({
   _openid:wx.getStorageSync('openid')
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */

   
toDetail(e){
  console.log(e)
  wx.setStorageSync('item', e.currentTarget.dataset.item)
  wx.navigateTo({
    url: '/pages/verify/verify',
  })
  },
  onReady: function () {

  },


  endhelp(e){
   var item = e.currentTarget.dataset.item
   const db = wx.cloud.database()
   var that = this 
   db.collection("help").doc(item._id).remove(
{
  success(res){
    console.log(res,"我的天 删除成功")
    that.onGetHelpList()
  }
}
  ) 

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onGetHelpList()
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