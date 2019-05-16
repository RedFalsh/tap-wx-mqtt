
var clocks=[
    {
      'period':'周一',
      'openTime':'16:54',
      'closeTime':'',
      'value':'打开时间: 16:54',
      'alive':true,
    },
    {
      'period':'每天',
      'openTime':'16:54',
      'closeTime':'17:54',
      'value':'打开时段: 16:54 - 17:54',
      'alive': true,
    },
    {
      'period':'工作日',
      'openTime':'',
      'closeTime':'16:54',
      'value':'关闭时间: 16:54',
      'alive': false,
    },
]

module.exports = {
  clocks: clocks,
}
