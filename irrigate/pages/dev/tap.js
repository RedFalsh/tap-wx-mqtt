var mDevicesClouds = require('../../utils/devicesClouds.js');
//模拟数据获取，小伙伴项目可以去自己的服务器请求数据。
var postData = require('../../test/tap-data.js');

var cmd = require('../../utils/cmd.js');
var app = getApp();
Page({
  data: {
    devicesCloudsDatas: postData,
    cloudsDevices: null,
    devices: null
  },

  onLoad: function () {

    wx.setNavigationBarTitle({
      title: app.globalData.appName
    })
    if(app.globalData.mqttConnectFlag){
      wx.showLoading({
        title: '设备加载中...',
        duration:1000
      })
      this.getDevices()
      //设置监听函数,设备监听
      mDevicesClouds.listenDeviceStatusEvent(true, this.callBackDevicesStatus)
    }
    //这个是监听服务器的连接回调
    // mDevicesClouds.listenConnectEvent(true, this.funListenConnectEvent)
    // console.log(this.data.cloudsDevices)

  },

  onUnload: function () {
    console.log("onUnload")
    //这个是取消监听服务器的连接回调
    mDevicesClouds.listenConnectEvent(false, this.funListenConnectEvent)
    //取消监听函数，释放内存
    mDevicesClouds.listenDeviceStatusEvent(false, this.callBackDevicesStatus);
  },

  callBackDevicesStatus: function(topic, payload) {
    console.log("设备状态回调:");
    console.log("topic:" + topic);
    console.log("payload:" + payload);

    var devices = this.data.devices
    for (var i = 0; i < devices.length; i++){
      if (devices[i].devicePubTopic == topic){
        var jsonObj = JSON.parse(payload);
        switch(jsonObj.code){
          case cmd.TAP_STATUS:
            devices[i].status = jsonObj.msg
            break;
          case cmd.TAP_ONLINE:
            devices[i].online = jsonObj.msg
            break;
          default:
            break;
        }
      }
    }
    // 根据回调信息信息刷新界面设备状态
    this.setData({
      cloudsDevices: devices
    })
  },

  funListenConnectEvent: function (parm1) {
    console.log("是否成功连接服务器: " + parm1)
    //隐藏窗口
    wx.hideLoading()
    console.log("是否成功连接服务器: " + parm1)
    if (parm1) {

      wx.showToast({
        title: '恭喜，连接成功。',
        icon: 'none',
        duration: 1000
      })
      this.getDevices()

      //拿到模拟数据的主题，开始订阅设备主题，小伙伴自行设计逻辑，比如拿到用户绑定的设备列表，一个一个去订阅
      // for (var i = 0; i < this.data.devices.length; i++) {
      // let topic = this.data.devices[i].devicePubTopic;
      // if (this.data.devices[i].online) {
      // //console.log('此设备在线，我们订阅设备推送的主题：' + topic);
      // mDevicesClouds.notifySubDeviceTopicEvent(topic);
      // }
      // }
    } else {
      wx.showToast({
        title: '服务器连接异常。',
        icon: 'none',
        duration: 3000
      })
    }
  },

  //开关按键触发
  onSwitch: function (e) {
    var device = this.data.devices[e.currentTarget.dataset.index];
    var status = e.currentTarget.dataset.status;

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
      console.log('topic:' + device.sub)
      console.log('msg:' + JSON.stringify(jsonObj))
      mDevicesClouds.notifyWriteDeviceEvent(device.sub, JSON.stringify(jsonObj));
    }
    else{
      wx.showToast({
        title: '操作失败, 设备离线',
        icon: 'none',
        duration: 1000
      })
    }
  },

  // 跳转到设备详情页面
  jumpDeviceControl: function (e) {
    var device = this.data.devices[e.currentTarget.dataset.index];
    // 设备是否在线？如果在线则可以跳转
    switch (device.type) {
      case 'tap':
        wx.navigateTo({
          // url: "../deviceTap/deviceTap?sn=" + device.sn + "&pub=" + device.pub + "&sub=" + device.sub + "&name=" + device.name + "&status=" + device.status
          url: "../deviceTap/deviceTap?sn=" + device.sn + "&pub=" + device.pub + "&sub=" + device.sub + "&name=" + device.name + "&status=" + device.status + "&online=" + device.online
        })
        break;
      case 'outlet':
        wx.navigateTo({
          url: "../deviceSocket/deviceSocket?devicePubTopic=" + device.devicePubTopic + "&sub=" + device.sub + "&alias=" + device.alias
        })
        break;
      default:
        break;
    }
  },

  // 扫一扫添加设备
  onScan: function(e){
    console.log(e)
    wx.scanCode({
      success: (res) => {
        var jsonObj = JSON.parse(res.result)
        var topic = '/dev/'+jsonObj.sn + '/sub'
        mDevicesClouds.notifySubDeviceTopicEvent(topic)
        wx.request({
          url: app.buildUrl('/device/add'),
          header: app.getRequestHeader(),
          method: 'POST',
          data: jsonObj,
          success: function (res) {
            if (res.data.code != 200) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 1000
              })
              return
            }
            wx.showToast({
              title: '添加设备成功',
              icon: 'none',
              duration: 1000
            })
          }
        });
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },

  // 获取设备
  getDevices:function(){
    var that = this
    wx.request({
      url: app.buildUrl('/device/list'),
      header: app.getRequestHeader(),
      success: function (res) {
        if (res.data.code != 200) {
          console.log('获取设备信息失败')
          return
        }
        console.log('获取设备信息成功')
        console.log(res.data.data)
        var devices = res.data.data
        that.setData({
          devices: devices
        })
        console.log(app.globalData.mqttConnectFlag)
        // if(app.globalData.mqttConnectFlag)
        // {
        for (var i = 0; i < devices.length; i++) {
          let topic = devices[i].pub;
          if (devices[i].online) {
            //console.log('此设备在线，我们订阅设备推送的主题：' + topic);
            mDevicesClouds.notifySubDeviceTopicEvent(topic);
            console.log('订阅:'+topic)
          }
        }
        // }

      }
    });
  }

})
