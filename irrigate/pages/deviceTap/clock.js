var mClock = require('../../utils/clockEvents.js');
var clock = require('../../test/tap-clock.js');

Page({

  data: {
      sn: '29e90c3d0',
      clocks: null,
      openTime: null,
      closeTime: null,
  },

  onLoad: function (options) {
    // 获取设备的定时任务数据
    this.setData({
        clocks:clock.clocks
    })
    this.updateValue()
    //设置监听函数
    mClock.listenSetTimeEvent(true, this.callBackSetTime);
  },

  onUnload: function () {
    //取消监听函数，释放内存
    mClock.listenSetTimeEvent(false, this.callBackSetTime);
  },

  updateValue: function (){
    var clocks = this.data.clocks
    for(var i=0; i<clocks.length;i++)
    {
      if(clocks[i].openTime && clocks[i].closeTime)
        clocks[i].value = "开启时段:" + clocks[i].openTime + ' - ' + clocks[i].closeTime
      else if(clocks[i].openTime)
        clocks[i].value = "开启时刻:" + clocks[i].openTime
      else if(clocks[i].closeTime)
        clocks[i].value = "关闭时刻:" + clocks[i].closeTime
    }
    this.setData({
      clocks: clocks
    })
  },
  // 监听回调函数, 设定定时传回数据
  callBackSetTime: function(period, openTime, closeTime) {
    //此处判断服务器的下发主题和此设备的主题是否一致！
    console.log("定时设置状态回调:" + period);
    console.log("定时设置状态回调:" + openTime);
    console.log("定时设置状态回调:" + closeTime);
    var jsonObj = new Object();
    jsonObj.period = period;
    jsonObj.openTime = openTime;
    jsonObj.closeTime = closeTime;
    jsonObj.alive = true;
    jsonObj.value = '';

    var clocks = this.data.clocks;
    clocks.push(jsonObj);
    console.log(clocks);
    this.setData({
      clocks: clocks
    })
    this.updateValue()
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

  onAddTime: function () {
    wx.navigateTo({
      url: "../deviceTap/clockSet?type=add" + "&sn=" + this.data.sn
    })
  },

  onJumpClockEdit: function(e) {
    var id = e.currentTarget.dataset.index;
    var clocks = this.data.clocks;
    wx.navigateTo({
      url: "../deviceTap/clockSet?type=edit" +"&period="+clocks[id].period + "&openTime=" + clocks[id].openTime+ "&closeTime=" + clocks[id].closeTime + "&sn=" + this.data.sn
    })
  },

  onSwitch: function (e) {
    var idx = e.currentTarget.dataset.index;
    var clocks = this.data.clocks;
    if(clocks[idx].alive){
      clocks[idx].alive = false;
    }
    else{
      clocks[idx].alive = true;
    }
    this.setData({
      clocks: clocks
    })
  }
})
