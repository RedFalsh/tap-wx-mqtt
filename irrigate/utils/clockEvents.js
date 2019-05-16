
var mOnFire = require("onfire.js");
var EVENT_SET_TIME = 'EVENT_SET_TIME';

//设备状态消息推送回调 topic是主题 ，status是mqtt的payload部分
function notifySetTimeEvent(period, openTime, closeTime) {
  mOnFire.fire(EVENT_SET_TIME, period, openTime, closeTime);
}

//监听设备主动推送的监听回调
function listenSetTimeEvent(isSetListener, funtion) {
  //方法重载，根据参数个数判断是否设置监听或取消监听
  if (isSetListener) {
    mOnFire.on(EVENT_SET_TIME, funtion)
  } else {
    //传入方法，取消监听回调
    mOnFire.un(funtion)
  }
}
module.exports = {
  //时间设置回调
  notifySetTimeEvent: notifySetTimeEvent,
  listenSetTimeEvent: listenSetTimeEvent,
}
