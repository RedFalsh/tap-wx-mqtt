//模拟数据
var localData = [{
  'alias': '阀门1',
  'type': 'light',
  'img': 'http://qiniu.xuhongv.com/device_list_light.png',
  'online': true,
  'deviceSubTopic': 'light/29e90c3d0/Sub',
  'devicePubTopic': 'light/29e90c3d0/Pub',
}, {
  'alias': '阀门2',
  'type': 'outlet',
  'img': 'http://qiniu.xuhongv.com/device_list_outlet.png',
  'online': true,
  'deviceSubTopic': 'outlet/59e90c3d6/Sub',
  'devicePubTopic': 'outlet/59e90c3d6/Pub',
}, {
  'alias': '阀门2',
  'type': 'outlet',
  'img': 'http://qiniu.xuhongv.com/device_list_light.png',
  'online': false,
  'deviceSubTopic': 'light/m9e90c396/Sub',
  'devicePubTopic': 'outlet/m9e90c396/Pub',
}, ]

module.exports = {
  listData: localData,
  text: 0
}