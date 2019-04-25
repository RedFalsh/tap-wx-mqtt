// pages/dev/terminal/terminal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sites: [],
    nodes:[
      {
      'sn':'1234567890',
      'name':'终端一号',
      'position':'一团',
      'alive':false,
      'tap_status':1,
      },
    ],
  },

  searchNodes: function(){
    wx.switchTab({
      url: '/pages/dev/node/node',
      success: res => {

        console.log(res);

      },

      fail: err => {

        console.log(err)

      }
    });
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