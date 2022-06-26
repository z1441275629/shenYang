/**
 * 
 * @param {String} id 元素id
 * @returns {HTMLElement}
 */
function getId(id) {
  return document.getElementById(id);
}

/**
 * 
 * @param {String} selector 选择器
 * @returns {NodeList}
 */
function getDom(selector) {
  return document.querySelectorAll(selector);
}

/**
 * @author web得胜
 * @param {String} url 需要下载的文件地址
 * */
 function downLoad(url, fileName){
  var oA = document.createElement("a");
  oA.download = fileName || '';// 设置下载的文件名，默认是'下载'
  oA.href = url;
  document.body.appendChild(oA);
  oA.click();
  oA.remove(); // 下载之后把创建的元素删除
}

// 保存成png格式的图片
function saveAsPNG(canvas) {
  return canvas.toDataURL("image/png");
}

// 保存成jpg格式的图片
function saveAsJPG(canvas) {
  return canvas.toDataURL("image/jpeg");
}

/**
 * 获取元素距离顶部的距离
 * @param {HTMLElement} element 
 * @returns 
 */
function getPageTop(element) {   
  var realTop = element.offsetTop;
  var parent = element.offsetParent;
  while (parent !== null) {
    realTop += parent.offsetTop;
    parent = parent.offsetParent;
  }
  return realTop;
}

/**
 * 获取元素距离左侧的距离
 * @param {HTMLElement} element 
 * @returns 
 */
 function getPageLeft(element) {   
  var realLeft = element.offsetLeft;
  var parent = element.offsetParent;
  while (parent !== null) {
    realLeft += parent.offsetLeft;
    parent = parent.offsetParent;
  }
  return realLeft;
}
