var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sn: null,
    logs: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "设备操作记录"
    })
    this.setData({
      sn: options.sn
    })
    this.getOperateLogs()
  },


  // 根据日期进行分类
  groupBy: function(arr, prop, callback) {
    var newArr = new Array()
    var tempArr = new Array()
    for (var i = 0, j = arr.length; i < j; i++) {
      var result = callback(arr[i], arr[i + 1], prop);
      if (result) {
        tempArr.push(arr[i]);
      } else {
        tempArr.push(arr[i]);
        newArr.push(tempArr.slice(0));
        tempArr.length = 0;
      }
    }
    return newArr;
  },

  /**
   * 操作记录获取
   */
  getOperateLogs: function () {
    var that = this
    var sn = that.data.sn
    wx.request({
      url: app.buildUrl('/device/operatelog/list'),
      header: app.getRequestHeader(),
      data: {sn: sn},
      success: function (res) {
        if (res.data.code != 200) {
          console.log('获取定时信息失败')
          return
        }
        var logs = res.data.data
        var result = that.groupBy(logs, 'date', (a, b, key) => {
          var C1 = a[key].split(' ')[0];
          var C2 = null;
          try {
            C2 = b[key].split(' ')[0];
          } catch (exception) {
            C2 = null;
          }
          return C1 == C2;
        });
        console.log(result)
        // console.log(logs)
        that.setData({
          logs: result
        })

      }
    });
  }

})
