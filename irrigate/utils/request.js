var app = getApp();

function getConnection(sn, callback){
  wx.request({
    url: app.buildUrl('/device/connection'),
    header: app.getRequestHeader(),
    data: {sn:sn},
    success: function (res) {
      callback(res)
    }
  });
}

module.exports = {
  getConnection: getConnection
};
