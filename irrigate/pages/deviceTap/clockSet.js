var mClock = require('../../utils/clockEvents.js');

Page({

  data: {
    type: null,

    currentDate: '12:00',
    loading: false,

    // 弹出设置:
    show: {
      time: false,
      period: false,
      customPeriod: false,
    },
    // 打开关闭时间
    period:{
      value: '',
      flag: false,
      custom: {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
      },
    },
    open:{
      time:'',
      flag: false,
    },

    close:{
      time:'',
      flag: false,
    },
  },

  onLoad: function (options) {
    console.log(options)
    if(options.type=="edit")
    {
      var period = this.data.period
      var open = this.data.open
      var close = this.data.close

      period.value = options.period
      open.time= options.openTime
      close.time= options.closeTime
      this.setData({
        period:period,
        open:open,
        close:close
      })
    }
    this.setData({
      sn: options.sn
    })
  },

  onUnload: function () {

  },
  // 时间滚轮响应事件
  onInput(event) {
    const { detail, currentTarget } = event;
    // const result = this.formartDate(detail,'time');
    const result = this.getResult(detail, currentTarget.dataset.type);
    var open = this.data.open
    var close = this.data.close
    if(this.data.open.flag){
      open.time = result
    }
    if (this.data.close.flag) {
      close.time = result
    }
    this.setData({
      open:open,
      close:close
    })

  },

  // 弹出
  toggle(type) {
    this.setData({
      [`show.${type}`]: !this.data.show[type]
    });
  },

  toggleCustomPeridPopup() {
    this.toggle('customPeriod');
  },

  togglePeridPopup(e) {
    var value = e.currentTarget.dataset.value
    this.choseItem(value)
    this.toggle('period');
  },

  toggleTimePopup(e) {
    var value = e.currentTarget.dataset.value
    this.choseItem(value)
    this.toggle('time');
  },

  choseItem(value) {
    var period = this.data.period
    var open = this.data.open
    var close = this.data.close
    if(value=="period") {
      period.flag=true
      open.flag=false
      close.flag=false
    }
    if(value=="open") {
      period.flag=false
      open.flag=true
      close.flag=false
    }
    if(value=="close") {
      period.flag=false
      open.flag=false
      close.flag=true
    }
    this.setData({
      period:period,
      open:open,
      close:close
    })
  },
  onCloseTime() {
    this.toggleTimePopup()
  },

  onTransitionEnd() {
    console.log(`You can't see me 🌚`);
  },
  // 设置周期
  onSetPeriod(e) {
    console.log(e)
    if(e){
      var value = e.currentTarget.dataset.value
      var period = this.data.period;
      switch(value)
      {
        case "once":
          period.value="执行一次"
          break;
        case "everyday":
          period.value="每天"
          break;
        case "working":
          period.value="工作日"
          break;
        case "weekend":
          period.value="周末"
          break;
        case "custom":
          this.toggle('period');
          this.toggleCustomPeridPopup()
          break;
        default:break;
      }
      this.setData({
        period:period
      })
    }
  },

  // 自定义时间
  onSetPeriodCustom(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      [`period.custom.${name}`]: !this.data.period.custom[name]
    });
    var custom = this.data.period.custom
    var value = ''
    if(custom.Monday)
      value = value + '周一 '
    if(custom.Tuesday)
      value = value + '周二 '
    if(custom.Wednesday)
      value = value + '周三 '
    if(custom.Thursday)
      value = value + '周四 '
    if(custom.Friday)
      value = value + '周五 '
    if(custom.Staurday)
      value = value + '周六 '
    if(custom.Sunday)
      value = value + '周日 '
    var period = this.data.period;
    period.value = value
    this.setData({
      period:period
    })
  },
  // 设置时间
  onSetTime() {
    mClock.notifySetTimeEvent(this.data.period.value, this.data.open.time,this.data.close.time)
    wx.navigateBack()
  },
  // 清除时间设置
  onClearTime(e) {
    if(e){
      var value = e.currentTarget.dataset.value
      var period = this.data.period
      var open = this.data.open
      var close = this.data.close
      if(value=="period") {
        period.value = ''
      }
      if(value=="open") {
        open.time = ''
      }
      if(value=="close") {
        close.time = ''
      }
      this.setData({
        period:period,
        open:open,
        close:close
      })
    }
  },

  /**
   * 通过时间戳返回yyyy-MM-dd HH:mm:ss
   * @param timestamp
   * @returns {string}
   */
  formartDate(timestamp, type) {
    const time = new Date(timestamp);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    if(type=="date"){
      return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm);
    }
    if(type=="time"){
      return this.add0(h) + ':' + this.add0(mm);
    }
  },
  add0(m) {
    return m < 10 ? '0' + m : m;
  },

  getResult(time, type) {
    const date = new Date(time);
    switch (type) {
      case 'datetime':
        return date.toLocaleString();
      case 'date':
        return date.toLocaleDateString();
      case 'year-month':
        return `${date.getFullYear()}/${date.getMonth() + 1}`;
      case 'time':
        return time;
      default:
        return '';
    }
  },


})
