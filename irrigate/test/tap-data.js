//模拟数据
var localData = [{
  'sn': '29e90c3d0',
  'alias': '阀门1',
  'type': 'tap',
  'img': '',
  'online': true,
  'status': 0,
  'position': '中间',
  'deviceSubTopic': 'dev/29e90c3d0/sub',
  'devicePubTopic': 'dev/29e90c3d0/pub',
}, {
  'sn': '29e90c3d0',
  'alias': '阀门2',
  'type': 'tap',
  'img': 'https://github.com/RedFalsh/tap-wx-mqtt/blob/master/irrigate/images/dev/icon_tap.png',
  'online': true,
  'status': 1,
  'position': '中间',
    'deviceSubTopic': 'dev/29e90c3d0/sub',
    'devicePubTopic': 'dev/29e90c3d0/pub',
}, {
  'sn': 'm9e90c396',
  'alias': '阀门2',
  'type': 'tap',
  'img': 'https://github.com/RedFalsh/tap-wx-mqtt/blob/master/irrigate/images/dev/icon_tap.png',
  'online': false,
  'status': 2,
  'position': '中间',
    'deviceSubTopic': 'dev/m9e90c396/sub',
    'devicePubTopic': 'dev/m9e90c396/pub',
}, ]

module.exports = {
  listData: localData,
  text: 0
}
