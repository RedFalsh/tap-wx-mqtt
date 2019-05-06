var mDevicesClouds = require('../../utils/devicesClouds.js');
//模拟数据获取，小伙伴项目可以去自己的服务器请求数据。
var postData = require('../../test/tap-data.js');

var cmd = require('../../utils/cmd.js');

Page({
  data: {
    devicesCloudsDatas: postData,
    cloudsDevices: null
  },

  callBackDevicesStatus: function(topic, payload) {
    console.log("设备状态回调:");
    console.log("topic:" + topic);
    console.log("payload:" + payload);

    var devices = this.data.devicesCloudsDatas["listData"]
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
    //隐藏窗口
    wx.hideLoading()
    console.log("是否成功连接服务器: " + parm1)
    if (parm1) {

      // wx.showToast({
      //   title: '恭喜，连接成功。',
      //   icon: 'none',
      //   duration: 1000
      // })

      //拿到模拟数据的主题，开始订阅设备主题，小伙伴自行设计逻辑，比如拿到用户绑定的设备列表，一个一个去订阅
      for (var i = 0; i < this.data.devicesCloudsDatas["listData"].length; i++) {
        let topic = this.data.devicesCloudsDatas["listData"][i].devicePubTopic;
        if (this.data.devicesCloudsDatas["listData"][i].online) {
          //console.log('此设备在线，我们订阅设备推送的主题：' + topic);
          mDevicesClouds.notifySubDeviceTopicEvent(topic);
        }
      }
    } else {
      wx.showToast({
        title: '服务器连接异常。',
        icon: 'none',
        duration: 3000
      })
    }
  },
  onLoad: function () {

     wx.showLoading({
       title: '加载中...',
       duration:3000
     })

    this.setData({
      cloudsDevices: this.data.devicesCloudsDatas.listData
    })

    //这个是监听服务器的连接回调
    mDevicesClouds.listenConnectEvent(true, this.funListenConnectEvent)
    // console.log(this.data.cloudsDevices)

    //设置监听函数,设备监听
    mDevicesClouds.listenDeviceStatusEvent(true, this.callBackDevicesStatus)
  },
  jumpDeviceControl: function (e) {
    var device = this.data.devicesCloudsDatas["listData"][e.currentTarget.dataset.index];
    //设备是否在线？如果在线则可以跳转
    switch (device.type) {
    case 'tap':
      wx.navigateTo({
        url: "../deviceTap/deviceTap?devicePubTopic=" + device.devicePubTopic + "&deviceSubTopic=" + device.deviceSubTopic + "&alias=" + device.alias
      })
      break;
    case 'outlet':
      wx.navigateTo({
        url: "../deviceSocket/deviceSocket?devicePubTopic=" + device.devicePubTopic + "&deviceSubTopic=" + device.deviceSubTopic + "&alias=" + device.alias
      })
      break;
    default:
      break;
    }
  },
  onUnload: function () {
    console.log("onUnload")
    //这个是取消监听服务器的连接回调
    mDevicesClouds.listenConnectEvent(false, this.funListenConnectEvent)
    //取消监听函数，释放内存
    mDevicesClouds.listenDeviceStatusEvent(false, this.callBackDevicesStatus);
  },


  //开关按键触发
  onSwitch: function (e) {
    var device = this.data.devicesCloudsDatas["listData"][e.currentTarget.dataset.index];
    console.log("onSwitch success :" + e.currentTarget.dataset.status);
    var status = e.currentTarget.dataset.status;
    if (device.online)
    {
        var jsonObj = new Object();
        jsonObj.code= 200;
        switch(device.status)
        {
            case 0:
                jsonObj.code = cmd.TAP_OPEN;
                break;
            case 1:
                jsonObj.code = cmd.TAP_CLOSE;
                break;
            case 2:
                jsonObj.code = cmd.TAP_OPEN;
                break;
            default:
                break;
        }
        mDevicesClouds.notifyWriteDeviceEvent(device.deviceSubTopic, JSON.stringify(jsonObj));
    }
  }

})