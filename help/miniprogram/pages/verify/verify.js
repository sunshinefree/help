// miniprogram/pages/verify/verify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTabItems:["等待","已通过","未通过"],
    currentTopItem:0
  },
  switchTab:function(e){
    this.setData({
      currentTopItem:e.currentTarget.dataset.idx
    });

    if(e.currentTarget.dataset.idx==0){
      this.yellow()
    }
    else if(e.currentTarget.dataset.idx==1){
      this.green()
    }
    else{
      this.red()
    }
    // //如果需要加载数据
    // if (this.needLoadNewDataAfterSwiper()) {
    //   this.refreshNewData();
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //找到help ——id相关任务的所有参加报名的用户
    var that =this 
    const db  =wx.cloud.database()
  //   db.collection("user_help").where({
  //   _id:wx.getStorageSync('item')._id
  //   }).get({
  //     success(res){
  // that.setData({
  //   user_help_list:res.data
  // })
  //     }
  //   })
 that.yellow()
  },
  toDetail(e){
    console.log(e)
    //这里面的id openid都是b用户的openid 目的是查到 b用户的验证截图？？就在这个页面审核吧
    wx.setStorageSync('item', e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/index/detail',
    })
    },

    yellow(){
      var that =this
const db = wx.cloud.database()
db.collection("user_help").where({
  statu:"审核中"
}).orderBy("createTime","asc").get({
  success(res){

    that.setData({
      user_help_list:res.data
    })
  }
})
    },


    green(){
      var that =this
      const db = wx.cloud.database()
      db.collection("user_help").where({
        statu:"审核通过"
      }).orderBy("createTime","asc").get({
        success(res){
      console.log("加油",res)    


        that.setData({
          user_help_list:res.data
        })
      }

        
      })
          },

          red(){
            var that =this
            const db = wx.cloud.database()
            db.collection("user_help").where({
              statu:"审核不通过"
            }).orderBy("createTime","asc").get({
              success(res){
                that.setData({
                  user_help_list:res.data
                })
              }
            })
                },

fail(e){
  var item  = e.currentTarget.dataset.item
  var that = this
const db = wx.cloud.database()
db.collection("user_help").where({
    _id:item._id,
    openid:item.openid
}).update({
  data:{
    statu:"审核不通过"
  }
  ,
  success(res){
    console.log("审核修改")
    that.yellow()
  }
})
},


pass(e){
  var item  = e.currentTarget.dataset.item
const db = wx.cloud.database()
//找到参加该任务活动的用户B 改变它的审核状态 通过就可以给相关用户 10 点信用 helper
db.collection("help").doc(
  wx.getStorageSync('item')._id
  ).update({
    data:{
finishNum:db.command.inc(1)
    }
  })
db.collection("user_help").where({
    _id:item._id,
    openid:item.openid
}).update({
  data:{
    statu:"审核通过",
    creditValue:db.command.inc(-10)
  }
  ,
  success(res){
    console.log("审核修改")
  }
})




db.collection("helper").where({
  openid:wx.getStorageSync('openid')
}).update({
data:{
  creditValue:db.command.inc(-10)
}
,
success(res){
  console.log("审核修改")
}
})



db.collection("helper").where({
  openid:item.openid
}).update({
data:{
  creditValue:db.command.inc(10)
}
,
success(res){
  console.log("审核修改")
}
})


this.yellow()
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