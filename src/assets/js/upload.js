/*eslint-disable*/
// 图片压缩
export function compress(img) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  let initSize = img.src.length;
  let width = img.width;
  let height = img.height;
  canvas.width = width;
  canvas.height = height;
  // 铺底色
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, width, height);

  //进行最小压缩
  let ndata = canvas.toDataURL("image/jpeg", 0.1);
  // console.log("*******压缩后的图片大小*******");
  // console.log(ndata)
  // console.log(ndata.length);
  return ndata;
}

//  dataURL转换为File对象
export function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {type: mimeString});

}
