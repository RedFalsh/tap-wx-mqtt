var mDeviceClouds = require('../../utils/devicesClouds.js');
var cmd = require('../../utils/cmd.js');

Page({
  data: {
    devicePubTopic: null,
    deviceSubTopic: null,
    pathLightOpen: '../../resoures/png/deviceStatus/light_on.jpg',
    pathLightOff: '../../resoures/png/deviceStatus/light_off.jpg',
    isOpen: false,
    lightValue: 0,
    valueSlier: 0,
    valuePic: '../../images/dev/tap_128.png',
  },
  callBackDeviceStatus: function(topic, payload) {
    //此处判断服务器的下发主题和此设备的主题是否一致！
    if (this.data.devicePubTopic === topic) {
      console.log("设备状态回调:" + payload);
      //这里处理同步ui工作的代码逻辑处理
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log("拿到上个界面传来的设备信息：" + options.devicePubTopic);
    this.setData({
      devicePubTopic: options.devicePubTopic,
      deviceSubTopic: options.deviceSubTopic
    })

    wx.setNavigationBarTitle({
      title: options.alias
    })

    //设置监听函数
    mDeviceClouds.listenDeviceStatusEvent(true, this.callBackDeviceStatus);

    //控制设备，此函数任意地方调用!第一个参数是topic，第二个是payload
    //mDeviceClouds.notifyWriteDeviceEvent(options.deviceSubTopic, "hello world , i am from wechat");
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //取消监听函数，释放内存
    mDeviceClouds.listenDeviceStatusEvent(false, this.callBackDeviceStatus);
  },
  eventSlider: function(e) {
    console.log("发生 change 事件，携带值为:" + e.detail.value);
    this.setData({
      lightValue: e.detail.value
    })
    //开始构造json数据
    var obj = new Object();
    obj.change = "pwm";
    obj.value = e.detail.value;
    //开始发布消息
    mDeviceClouds.notifyWriteDeviceEvent(this.data.deviceSubTopic, JSON.stringify(obj));
  },
  //按键触发
  onSwitch: function(e) {
    console.log("onSwitch success :" + e.detail.value);
    //同步数据
//    if (e.detail.value)
//      this.setData({
//        lightValue: 100,
//        valuePic: this.data.pathLightOpen
//      })
//    else this.setData({
//      lightValue: 0,
//      valuePic: this.data.pathLightOff
//    })
    //开始构造json数据
    var jsonObj = new Object();
    jsonObj.code = cmd.TAP_OPEN;
    //开始发布消息
    mDeviceClouds.notifyWriteDeviceEvent(this.data.deviceSubTopic, JSON.stringify(jsonObj));
  },

  onClock: function(){
    console.log("onClock")
  },

  onTime: function () {
    console.log("onTime")
  }
})