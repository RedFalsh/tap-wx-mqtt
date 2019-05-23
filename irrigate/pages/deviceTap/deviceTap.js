var mDeviceClouds = require('../../utils/devicesClouds.js');
var cmd = require('../../utils/cmd.js');

var app = getApp();
Page({
  data: {
    device: {
      sn : null,
      name: null,
      status: null,
      online: null,
      pub: null,
      sub: null
    },
    sn : null,
    name: null,
    status: null,
    online: null,
    pub: null,
    sub: null,

    CloseBgColor: 'radial-gradient(ellipse, #808080, #484848,#303030)',
    OpenBgColor: 'radial-gradient(ellipse, #0066FF, #0033CC, #0000CC)',
    bgColor:'radial-gradient(ellipse, #808080, #484848,#303030)',
  },
  callBackDeviceStatus: function(topic, payload) {
    //此处判断服务器的下发主题和此设备的主题是否一致！
    if (this.data.pub === topic) {
      console.log("设备状态回调:" + payload);
      //这里处理同步ui工作的代码逻辑处理
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 拿到上个界面传来的设备信息, 获取sn，查询设备详情
    // 设备信息从上个页面获取
    // this.getDeviceOptions(options)
    // 设备信息从服务器获取
    this.getDeviceInfo(options.sn)

    //设置监听函数
    mDeviceClouds.listenDeviceStatusEvent(true, this.callBackDeviceStatus);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //取消监听函数，释放内存
    mDeviceClouds.listenDeviceStatusEvent(false, this.callBackDeviceStatus);
  },

  // 获取当前设备详情
  getDeviceOptions:function(options){
    var that = this
    console.log(that.options)
    that.setData({
      device: options,
    })

    if(options.online == 0)
    {
      wx.showToast({
        title: '当前设备不在线，请检查！',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 获取当前设备详情
  getDeviceInfo:function(sn){
    var that = this
    wx.request({
      url: app.buildUrl('/device/info'),
      header: app.getRequestHeader(),
      data: {'sn':sn},
      success: function (res) {
        if (res.data.code != 200) {
          wx.showToast({
            title: '获取设备信息失败',
            icon: 'none',
            duration: 2000
          })
          return
        }
        var device = res.data.data
        that.setData({
          device: device
        })
        if(device.online == 0)
        {
          wx.showToast({
            title: '当前设备不在线，请检查！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  },

  //按键触发
  onSwitch: function(e) {
    var device = this.data.device
    if (device.online)
    {
      var jsonObj = new Object();
      jsonObj.code= 200;
      switch(device.status)
      {
        case 0:
          jsonObj.code = cmd.TAP_OPEN;
          // jsonObj.code = cmd.TAP_SET_TIME;
          break;
        case 1:
          jsonObj.code = cmd.TAP_CLOSE;
          // jsonObj.code = cmd.TAP_SET_TIME;
          break;
        case 2:
          jsonObj.code = cmd.TAP_OPEN;
          break;
        default:
          break;
      }
      console.log('topic:' + this.sub)
      console.log('msg:' + JSON.stringify(jsonObj))
      mDeviceClouds.notifyWriteDeviceEvent(device.sub, JSON.stringify(jsonObj));
    }
    else{
      wx.showToast({
        title: '操作失败, 设备离线',
        icon: 'none',
        duration: 1000
      })
    }
  },

  onSet: function(){
    var device = this.data.device
    var options = ""
    for(var key in device){
      options += '&'+key+'='+device[key]
    }
    wx.navigateTo({
      url: "../deviceTap/set?" + options.substring(1)
    })
  },

  onTime: function () {
    var device = this.data.device
    wx.navigateTo({
      url: "../deviceTap/clock?sn=" + device.sn
    })
  }
})
