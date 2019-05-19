
var mOnFire = require("onfire.js");
var EVENT_SET_TIME = 'EVENT_SET_TIME';
var EVENT_SET_TIME_BACK= 'EVENT_SET_TIME_BACK';

// 推送时间设置消息
function notifySetTimeEvent(period, openTime, closeTime) {
  mOnFire.fire(EVENT_SET_TIME, period, openTime, closeTime);
}

function listenSetTimeEvent(isSetListener, funtion) {
  //方法重载，根据参数个数判断是否设置监听或取消监听
  if (isSetListener) {
    mOnFire.on(EVENT_SET_TIME, funtion)
  } else {
    //传入方法，取消监听回调
    mOnFire.un(funtion)
  }
}

// 推送时间设置消息
function notifySetTimeBackEvent() {
  mOnFire.fire(EVENT_SET_TIME_BACK);
}
//监听设备主动推送的监听回调
function listenSetTimeBackEvent(isSetListener, funtion) {
  //方法重载，根据参数个数判断是否设置监听或取消监听
  if (isSetListener) {
    mOnFire.on(EVENT_SET_TIME_BACK, funtion)
  } else {
    //传入方法，取消监听回调
    mOnFire.un(funtion)
  }
}
module.exports = {
  //时间设置回调
  notifySetTimeEvent: notifySetTimeEvent,
  listenSetTimeEvent: listenSetTimeEvent,

  notifySetTimeBackEvent: notifySetTimeBackEvent,
  listenSetTimeBackEvent: listenSetTimeBackEvent,
}
