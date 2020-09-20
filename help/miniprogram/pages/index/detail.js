// miniprogram/pages/index/detail.js
let verifyImgUrl
let password 
Page ({


  /**
   * 页面的初始数据
   */
  data: {
    help:{},
    help_id:"",
    isJoin:false,
    statu:"提交审核",
        verifyImgUrl:"/images/kongImg.png",
        logged: wx.getStorageSync('logged')||false
      },
    
      /**
       * 生命周期函数--监听页面加载
       */

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
      onLoad: function (options) {
    const db = wx.cloud.database()
    db.collection("help").doc(
  options._id
    ).update({
      data:{
      viewNum:db.command.inc(1)
      }
    })
      },
      password(e){
        password = e.detail.value
      },
      submit(){
        wx.showLoading(
  {
    title:"正在提交"
  }
        )
    //提交审核1图片上传

    var that=this


    const db = wx.cloud.database()

    
    db.collection("help").doc(
    wx.getStorageSync('item')._id
  ).update({
    data:{

finishNum:1
    }
    ,
    success(res){
      console.log("审核修改")
 that.setData({
   statu:"审核中"
 })
    }
  })


    db.collection("user_help").where({
      openid:wx.getStorageSync('openid'),
      _id:wx.getStorageSync('item')._id
    }).count({
      success(ress){
        console.log(ress,"45454")
        if(ress.total == 0){
          db.collection("user_help").add({
            data:{
              password,
          
              openid:wx.getStorageSync('openid'),
              id:wx.getStorageSync('item')._id,
              statu:"审核中",
        ...wx.getStorageSync('item'),
        ...wx.getStorageSync('userInfo'),
              verifyImgUrl,
        
            },
            success(a){
              console.log(a,'4545454')

              wx.hideLoading(
 
                )
            }
          })
        }

        else{

          wx.hideLoading(
 
            )

          wx.showToast({
            title: '已经在审核中',
          })
        }
      }
    })
    


    
      },
    
        // 上传图片
        doUpload: function () {
          // 选择图片
      
    
              verifyImgUrl = this.data.verifyImgUrl
              const filePath =  verifyImgUrl
     var that  = this
     var time = new Date().getTime()
              // 上传图片
              const cloudPath = 'user_help/' + wx.getStorageSync('item')._id + "/" + time  + filePath.match(/\.[^.]+?$/)[0]
              that.setData({
      
                statu:"审核中"
               })
              wx.cloud.uploadFile({
                cloudPath,
                filePath,
                success: re => {
                  console.log('[上传文件] 成功：', re)
                  // app.globalData.fileID = res.fileID
                  // app.globalData.cloudPath = cloudPath
                  // app.globalData.imagePath = filePath
       that.setData({
        verifyImgUrl:re.fileID,
 
       })
       verifyImgUrl =re.fileID

      
    
            },
          })
        
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
        this.setData({
          help:wx.getStorageSync('item')
        })


        var that =this 
const db =wx.cloud.database()
//先判断有无该集合 在判断其他
db.collection("user_help").where({
  openid:wx.getStorageSync('openid'),
  _id:wx.getStorageSync('item')._id
}).count({
  success(res){
    if(res.total == 0){
      that.setData({
        statu:"提交审核"
      })
      // db.collection("user_help").add({
      //   data:{
      //     openid:wx.getStorageSync('openid'),
      //     _id:wx.getStorageSync('item')._id,
      //    ...wx.getStorageSync('userInfo'),
      //    statu:"提交审核"
      //      }
      // }).then(ress => {
      // })
      // .catch(console.error)
  
    }


    else{
      db.collection("user_help").where({
        openid:wx.getStorageSync('openid'),
        _id:wx.getStorageSync('item')._id
      }).get({
success(r){
that.setData({
  help:r.data[0],
  statu:r.data[0].statu
})
}
      })
    }
  }
})
//如果是创建者自己打开页面可以看见审核界面

// db.collection("help").where({
//   // openid:wx.getStorageSync('openid'),
// _id:wx.getStorageSync('item').wd||wx.getStorageSync('item')._id
// }).get({
//  success(res){
// console.log(wx.getStorageSync('item')._id,"888",wx.getStorageSync('openid'),res)
//   that.setData({
//     help:res.data[0]
//   })
//  } 
// })


      },
    
    join(){
      //1.更新集合help中求助信息   2 在user_help集合中增加用户报名信息 如审核状态 status
    const db =wx.cloud.database()
    const _ = db.command
    var that =this
    db.collection("help").doc(wx.getStorageSync('item')._id).update({
    data:{
    joinNum:_.inc(1)
    },
    success(res){
      wx.showToast({
        title: '报名成功'
      })
      console.log(res,"报名")
      that.setData({
        isJoin:true
      })
    }
    })
    
    db.collection('user_help').where({
        _openid:wx.getStorageSync('openid'),
       _id:wx.getStorageSync('item')._id
    }).count({
    }).then(res => {
      console.log(res)
    if(res.total == 0) {
      db.collection("user_help").doc(wx.getStorageSync('item')._id).add({
        data:{
          task_id:wx.getStorageSync('item')._id,
          statu:"审核中"
        },
        success(res){
          wx.showToast({
            title: '报名成功'
          })
          that.onShow()
          console.log(res,"报名")
          that.setData({
            isJoin:true
          })
        }
        })
    }
    
    else{
      wx.showToast({
        title: '您的互助信息正在审核中...',
      })
    }
    }).catch(err => {
      console.log(err)
      console.error(err)
    })
    
    // db.collection('user_help').where({
    //   _openid:wx.getStorageSync('openid'),
    //   task_id:wx.getStorageSync('item')._id
    // }).count({
    //   success: function(res) {
    //     console.log(res.total)
    
    
    //     if(res.total==0){
    
    //     }
    //   },
    //   fail: console.error
    // })
    
    
    
    
    },
    
    
    chooseImg(){
      wx.chooseImage({
        complete: (res) => {
          console.log(res,"选择图片作为校验图片")
       this.setData({
        verifyImgUrl:res.tempFilePaths[0]
       })

       verifyImgUrl = res.tempFilePaths[0]
       this.doUpload()
        },
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