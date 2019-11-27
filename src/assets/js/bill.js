export default matching = function (type) {
  billJson.forEach((item) => {
    if (type = item.type) {
      return item
    }
  })
}

export const billJson = [
  {
    type: '1',
    urlSrc: require(''),
    massage: ''
  }, {
    type: '2',
    urlSrc: require(''),
    massage: ''
  }, {
    type: '3',
    urlSrc: require(''),
    massage: ''
  }]
