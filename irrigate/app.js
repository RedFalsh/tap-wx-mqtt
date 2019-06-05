//app.js

var mDeviceClouds = require('/utils/devicesClouds.js');
var util = require('/utils/mqtt/util.js')
var {
  Client,
  Message
} = require('/utils/mqtt/paho-mqtt.js')

App({
    data: {
    logged: false,
    takeSession: false,
    requestResult: '',
    client: null
  },
  globalData: {
    userInfo: null,
    version: "1.0",
    appName: "疆物联",
    mqttConnectFlag: false,
    domain: "https://sczcnrs.320.io/api",
    // domain: "http://192.168.232.137:5000/api",

    server_domain: 'wss://15b3t97519.51mypc.cn/mqtt',
    keepAliveInterval: 60,
    userName:"admin",
    password:"public",
    //请保持唯一，一旦多个客户端用相同的clientID连接服务器就会挤掉之前的链接，后者先得。
    clientId: function() {
      var len = 16; //长度
      var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      var maxPos = $chars.length;
      var pwd = 'WC_';
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    }
  },
  setOnMessageArrived: function(onMessageArrived) {
    if (typeof onMessageArrived === 'function') {
      this.data.onMessageArrived = onMessageArrived
    }
  },
  setOnConnectionLost: function(onConnectionLost) {
    if (typeof onConnectionLost === 'function') {
      this.data.onConnectionLost = onConnectionLost
    }
  },

  doConnect: function() {
    var that = this;
    if (that.data.client && that.data.client.isConnected()) {
      console.log('不要重复连接');
      return
    }
    var client = new Client(this.globalData.server_domain, this.globalData.clientId());
    client.connect({
      userName: this.globalData.userName,
      password: this.globalData.password,
      useSSL: true,
      reconnect: true, //设置断线重连，默认是断线不重连
      cleanSession: true,
      keepAliveInterval: this.globalData.keepAliveInterval,
      onFailure: function(errorCode) {
        mDeviceClouds.notifyConnectEvent(false)
        //console.log("connect failed code:" + errorCode.errorCode)
        //console.log("connect failed message:" + errorCode.errorMessage)
      },
      onSuccess: function() {
        that.data.client = client
        client.onMessageArrived = function(msg) {
          if (typeof that.data.onMessageArrived === 'function') {
            return that.data.onMessageArrived(msg)
          }
          console.log("onMessageArrived topic:" + msg.destinationName)
          console.log("onMessageArrived payload:" + msg.payloadString)
          mDeviceClouds.notifyDeviceStatusEvent(msg.destinationName, msg.payloadString)
        }
        client.onConnectionLost = function(responseObject) {
          if (typeof that.data.onConnectionLost === 'function') {
            return that.data.onConnectionLost(responseObject)
          }
          if (responseObject.errorCode !== 0) {
            //console.log("onConnectionLost:" + responseObject.errorMessage);
          }
        }
        that.globalData.mqttConnectFlag = true
        console.log("connect success..")
        //连接成功mqtt服务器回调
        // console.log("连接服务器成功")
        // wx.showToast({
          // title: '连接成功',
          // duration: 1000
        // })
        mDeviceClouds.notifyConnectEvent(true)
      }
    });
  },

  onLaunch: function() {

    //延迟链接，以防后面的收不到链接成功回调
    var that = this
    setTimeout(function() {
      that.doConnect();
    }, 800)
    // 等待用户进入设备页面后连接mqtt
    // mDeviceClouds.listenDoConnectEvent(true, function(clientId) {
      // // that.globalData.clientId = clientId
      // setTimeout(function() {
      // that.doConnect();
      // }, 500)
    // })

    // 订阅某个设备推送状态函数：参数 device对象
    mDeviceClouds.listenSubDeviceTopicEvent(true, function(device) {
      var client = that.data.client;
      if (client && client.isConnected()) {
        console.log('订阅成功');
        return client.subscribe(device, {
          qos: 1
        });
      }
      console.log('订阅失败');
    })
    // 发送消息给设备
    mDeviceClouds.listenWriteDeviceEvent(true, function(device, message, qos = 1, retained = false) {
      var client = that.data.client;
      if (client && client.isConnected()) {
        var message = new Message(message);
        message.destinationName = device;
        message.qos = qos;
        message.retained = retained;
        console.log('发送ok');
        return client.send(message);
      }
    })
  },

  tip: function(params) {
    var that = this;
    var title = params.hasOwnProperty('title') ? params['title'] : '提示';
    var content = params.hasOwnProperty('content') ? params['content'] : '';
    wx.showModal({
      title: title,
      content: content,
      success: function(res) {
        if (res.confirm) { //点击确定
          if (params.hasOwnProperty('cb_confirm') && typeof(params.cb_confirm) == "function") {
            params.cb_confirm();
          }
        } else { //点击否
          if (params.hasOwnProperty('cb_cancel') && typeof(params.cb_cancel) == "function") {
            params.cb_cancel();
          }
        }
      }
    })
  },
  alert: function(params) {
    var title = params.hasOwnProperty('title') ? params['title'] : '提示';
    var content = params.hasOwnProperty('content') ? params['content'] : '';
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function(res) {
        if (res.confirm) { //用户点击确定
          if (params.hasOwnProperty('cb_confirm') && typeof(params.cb_confirm) == "function") {
            params.cb_confirm();
          }
        } else {
          if (params.hasOwnProperty('cb_cancel') && typeof(params.cb_cancel) == "function") {
            params.cb_cancel();
          }
        }
      }
    })
  },
  console: function(msg) {
    console.log(msg);
  },
  getRequestHeader: function() {
    return {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': this.getCache("token")
    }
  },
  buildUrl: function(path, params) {
    var url = this.globalData.domain + path;
    var _paramUrl = "";
    if (params) {
      _paramUrl = Object.keys(params).map(function(k) {
        return [encodeURIComponent(k), encodeURIComponent(params[k])].join("=");
      }).join("&");
      _paramUrl = "?" + _paramUrl;
    }
    return url + _paramUrl;
  },
  getCache: function(key) {
    var value = undefined;
    try {
      value = wx.getStorageSync(key);
    } catch (e) {}
    return value;
  },
  setCache: function(key, value) {
    wx.setStorage({
      key: key,
      data: value
    });
  }


  // mqtt连接过程


});
