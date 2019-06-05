var mDevicesClouds = require('../../utils/devicesClouds.js');
//模拟数据获取，小伙伴项目可以去自己的服务器请求数据。
// var postData = require('../../test/tap-data.js');
var cmd = require('../../utils/cmd.js');
import Dialog from '../../utils/vant-weapp/dist/dialog/dialog';
var timer; // 计时器
var app = getApp();
var req = require('../../utils/request.js');
Page({
  data: {
    cloudsDevices: null,
    devices: null
  },


  onLoad: function () {
    var that = this;
    wx.setNavigationBarTitle({
      title: app.globalData.appName
    })
    timer = setTimeout(function () {
      that.onUpdateDevices()
    }, 1000)
    // if(app.globalData.mqttConnectFlag){
    //   wx.showLoading({
    //     title: '设备加载中...',
    //     duration:1000
    //   })
    //   this.getDevices()
    //   //设置监听函数,设备监听
    //   mDevicesClouds.listenDeviceStatusEvent(true, this.callBackDevicesStatus)
    // }
    //设置监听函数,设备监听
    mDevicesClouds.listenDeviceStatusEvent(true, this.callBackDevicesStatus)
    //这个是监听服务器的连接回调
    // mDevicesClouds.listenConnectEvent(true, this.funListenConnectEvent)
    // console.log(this.data.cloudsDevices)
  },

  onShow: function () {
    this.getConnections()
  },

  onPullDownRefresh() {
    if (app.globalData.mqttConnectFlag) {
      wx.showLoading({
        title: '设备加载中...',
        duration: 1000
      })
      this.getDevices()
    }
  },

  onUnload: function () {
    console.log("onUnload")
    //这个是取消监听服务器的连接回调
    mDevicesClouds.listenConnectEvent(false, this.funListenConnectEvent)
    //取消监听函数，释放内存
    mDevicesClouds.listenDeviceStatusEvent(false, this.callBackDevicesStatus);
  },
  
  // mqtt 接收信息回调
  callBackDevicesStatus: function (topic, payload) {
    console.log("收到mqtt订阅消息:");
    console.log("topic:" + topic);
    console.log("payload:" + payload);
    var that = this
    var devices = that.data.devices
    for (var i = 0; i < devices.length; i++) {
      if (devices[i].pub == topic) {
        var arr = payload.split(':')
        var code = arr[0]
        var msg = arr[1]
        console.log(arr);
        if (code == cmd.TAP_STATUS) {
          if (msg == "1-0") devices[i].status1 = 0
          if (msg == "1-1") devices[i].status1 = 1
          if (msg == "1-2") devices[i].status1 = 2
          if (msg == "1-3") devices[i].status1 = 3
          if (msg == "1-4") devices[i].status1 = 4
          if (msg == "2-0") devices[i].status2 = 0
          if (msg == "2-1") devices[i].status2 = 1
          if (msg == "2-2") devices[i].status2 = 2
          if (msg == "2-3") devices[i].status2 = 3
          if (msg == "2-4") devices[i].status2 = 4
        }
        if (code == cmd.TAP_ALIVE) {
          devices[i].online = 1
        }
        if (code == cmd.TAP_ONLINE) {
          devices[i].online = parseInt(msg)
        }
      }
    }
    // 根据回调信息信息刷新界面设备状态
    that.setData({
      devices: devices
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

  //设备刷新
  onUpdateDevices: function () {
    this.setData({
      devices: null
    })
    wx.showLoading({
      title: '设备加载中...',
      duration: 1000
    })
    this.getDevices()
  },

  //开关按键触发
  onSwitch: function (e) {
    var that = this
    var device = this.data.devices[e.currentTarget.dataset.index]
    var status = e.currentTarget.dataset.status
    var number = e.currentTarget.dataset.number
    if (device.online) {
      var code = '';
      var msg = '';
      if (number == 1) // 1号阀门操作
      {
        msg = '1'
        switch (device.status1) {
          case 0:
            code = cmd.TAP_OPEN;
            break;
          case 1:
            code = cmd.TAP_CLOSE;
            break;
          case 2:
            code = cmd.TAP_OPEN;
            break;
          default:
            break;
        }
      }
      if (number == 2) // 2号阀门操作
      {
        msg = '2'
        switch (device.status2) {
          case 0:
            code = cmd.TAP_OPEN;
            break;
          case 1:
            code = cmd.TAP_CLOSE;
            break;
          case 2:
            code = cmd.TAP_OPEN;
            break;
          default:
            break;
        }
      }
      if (code) {
        var payload = code + ":" + msg
        console.log('topic:' + device.sub)
        console.log('msg:' + payload)
        mDevicesClouds.notifyWriteDeviceEvent(device.sub, payload, 2);
      }
    }
    else {
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
    switch (device.number) {
      case 'dqt001':
        wx.navigateTo({
          url: "../deviceSocket/deviceSocket?devicePubTopic=" + device.devicePubTopic + "&sub=" + device.sub + "&alias=" + device.alias
        })
        break;
      case 'dqt002':
        wx.navigateTo({
          url: "../devTapTwo/deviceTap?sn=" + device.sn + "&pub=" + device.pub + "&sub=" + device.sub + "&name=" + device.name + "&status=" + device.status + "&online=" + device.online
        })
        break;
      default:
        break;
    }
  },

  // 扫一扫添加设备
  onScan: function (e) {
    console.log(e)
    var that = this
    wx.scanCode({
      success: (res) => {
        var jsonObj = JSON.parse(res.result)
        console.log(res.result)
        var topic = '/dev/' + jsonObj.sn + '/sub'
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
            that.getDevices()
          }
        });
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },

  // 订阅设备
  doSubscribe: function () {
    var that = this
    var devices = that.data.devices
    if (app.globalData.mqttConnectFlag) {
      for (var i = 0; i < devices.length; i++) {
        let topic = devices[i].pub;
        if (devices[i].online) {
          //console.log('此设备在线，我们订阅设备推送的主题：' + topic);
          mDevicesClouds.notifySubDeviceTopicEvent(topic);
          console.log('订阅:' + topic)
        }
      }
    }
  },

  // 获取所有设备是否在线
  getConnections: function () {
    var that = this
    var devices = that.data.devices
    var sn_list = new Array()
    if (devices) {
      for (var i = 0; i < devices.length; i++) {
        sn_list[i] = devices[i].sn
      }
      console.log(sn_list)
      wx.request({
        url: app.buildUrl('/device/connections'),
        header: app.getRequestHeader(),
        data: { sn_list: sn_list },
        success: function (res) {
          if (res.data.code != 200) {
            console.log('获取设备在线信息失败')
            return
          }
          // 处理设备返回在线信息
          var connections = res.data.data
          for (var sn in connections) {
            for (var i = 0; i < devices.length; i++) {
              if (sn == devices[i].sn) {
                devices[i].online = connections[sn].online
                break
              }
            }
          }
          // 更新设备数据
          that.setData({
            devices: devices
          })
          that.doSubscribe()
        }
      });
    }
  },

  // 获取设备
  getDevices: function () {
    var that = this
    wx.request({
      url: app.buildUrl('/device/list'),
      header: app.getRequestHeader(),
      success: function (res) {
        if (res.data.code != 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          return
        }
        var devices = res.data.data
        that.setData({
          devices: devices
        })
        that.doSubscribe()
      },
      fail: function (err) {
        wx.showToast({
          title: '设备加载失败!',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },

  // 删除设备
  onDeleteDevice: function (e) {
    var that = this
    var sn = e.currentTarget.dataset.sn
    Dialog.confirm({
      title: '删除',
      message: '确认要删除此设备么?'
    }).then(() => {
      // on confirm
      wx.request({
        url: app.buildUrl('/device/delete/' + sn),
        header: app.getRequestHeader(),
        success: function (res) {
          if (res.data.code != 200) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
            return
          }
          that.getDevices()
        }
      });
    }).catch(() => {
      // on cancel
    });
  },


})
