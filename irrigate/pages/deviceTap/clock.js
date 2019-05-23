
import Dialog from '../../utils/vant-weapp/dist/dialog/dialog';
var app = getApp();

Page({

  data: {
    sn: null,
    clocks: null,
    open_time: null,
    close_time: null,
  },

  onLoad: function (options) {
    // 获取上个页面传过来的设备sn
    this.setData({
      sn: options.sn
    })
  },

  onUnload: function () {
  },

  onShow: function(){
    this.getTimes()
  },

  // 获取定时列表
  getTimes:function(){
    var that = this
    var sn = that.data.sn
    wx.request({
      url: app.buildUrl('/device/time/list'),
      header: app.getRequestHeader(),
      data: {sn: sn},
      success: function (res) {
        if (res.data.code != 200) {
          console.log('获取定时信息失败')
          return
        }
        console.log('获取定时信息成功')
        console.log(res.data.data)
        var clocks = res.data.data
        for(var i=0; i<clocks.length;i++)
        {
          if(clocks[i].open_time == 'null') {
            clocks[i].open_time = ''
          }
          if(clocks[i].close_time == 'null') {
            clocks[i].close_time = ''
          }
          if(clocks[i].open_time && clocks[i].close_time)
            clocks[i].value = "开启时段:" + clocks[i].open_time + ' - ' + clocks[i].close_time
          else if(clocks[i].open_time)
            clocks[i].value = "开启时刻:" + clocks[i].open_time
          else if(clocks[i].close_time)
            clocks[i].value = "关闭时刻:" + clocks[i].close_time

          if(clocks[i].type==1)
          {
            clocks[i].period="执行一次"
          }
          if(clocks[i].type==2)
          {
            clocks[i].period="每天"
          }
          if(clocks[i].type==3)
          {
            clocks[i].period="工作日"
          }
          if(clocks[i].type==4)
          {
            clocks[i].period="周末"
          }
          if(clocks[i].type==5)
          {
            clocks[i].period="自定义"
          }
        }
        that.setData({
          clocks: clocks
        })
      }
    });
  },

  onAddTime: function () {
    wx.navigateTo({
      url: "../deviceTap/clockSet?type=add" + "&sn=" + this.data.sn
    })
  },

  onDeleteTime: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var sn = that.data.sn
    Dialog.confirm({
      title: '删除',
      message: '确认要删除此定时任务么?'
    }).then(() => {
      // on confirm
      wx.request({
        url: app.buildUrl('/device/time/delete'),
        header: app.getRequestHeader(),
        data: {sn: sn,id: id},
        success: function (res) {
          if (res.data.code != 200) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
            return
          }
          that.getTimes()
        }
      });
    }).catch(() => {
      // on cancel
    });
  },

  onJumpClockEdit: function(e) {
    var id = e.currentTarget.dataset.index;
    var clocks = this.data.clocks;
    wx.navigateTo({
      url: "../deviceTap/clockSet?type=edit"+"&id="+clocks[id].id +"&period="+clocks[id].period + "&open_time=" + clocks[id].open_time+ "&close_time=" + clocks[id].close_time + "&sn=" + this.data.sn
      // url: "../deviceTap/clockSet?type=edit" +"&period="+clocks[id].period + "&open_time=" + clocks[id].open_time+ "&close_time=" + clocks[id].close_time + "&sn=" + this.data.sn
    })
  },

  onSwitch: function (e) {
    var that = this
    var clocks = that.data.clocks;
    var index = e.currentTarget.dataset.index;
    // request数据
    var data = new Object()
    data.sn = that.data.sn
    data.id = clocks[index].id
    var alive = clocks[index].alive
    if(alive){
      data.alive = 0
    }
    else{
      data.alive = 1
    }

    wx.request({
      url: app.buildUrl('/device/time/edit'),
      header: app.getRequestHeader(),
      data: data,
      success: function (res) {
        if (res.data.code != 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          return
        }
        // 成功
        clocks[index].alive = !clocks[index].alive
        that.setData({
          clocks: clocks
        })
      }
    });
    // var clocks = this.data.clocks;
    // if(clocks[id].alive == 1){
      // clocks[id].alive = 0;
    // }
    // else{
      // clocks[id].alive = 1;
    // }
    // this.setData({
      // clocks: clocks
    // })
  }
})
