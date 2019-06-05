import Dialog from '../../utils/vant-weapp/dist/dialog/dialog';
var app = getApp();
Page({
  data: {
    sn: null,
    device: null
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "通用设置"
    })
    this.setData({
      device: options,
      sn: options.sn
    })
    console.log(options.sn)
  },

  onUnload: function () {

  },

  // 操作记录查询界面
  onOperateLog: function () {
    var sn = this.data.sn
    wx.navigateTo({
      url: "../deviceTap/operatelog?sn="+sn
    })
  },

  // 名称设置
  onName: function () {
    var that = this
    var sn = that.sn
    Dialog.confirm({
      title: '删除',
      message: '确认要删除此设备么?'
    }).then(() => {
      // on confirm
      wx.request({
        url: app.buildUrl('/device/edit/'),
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
          app.tip({'content':'删除设备成功!'})
        }
      });
    }).catch(() => {
      // on cancel
    });
  },

  // 删除设备
  onDelete: function () {
    var that = this
    var sn = that.data.device.sn
    console.log(sn)
    Dialog.confirm({
      title: '删除',
      message: '确认要删除此设备么?'
    }).then(() => {
      // on confirm
      wx.request({
        url: app.buildUrl('/device/delete'),
        header: app.getRequestHeader(),
        data: {sn: sn},
        success: function (res) {
          if (res.data.code != 200) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
            return
          }
          app.tip({'content':'删除设备成功!'})
        }
      });
    }).catch(() => {
      // on cancel
    });
  }

})
