import { Message } from 'element-ui';
/*
* @params response 代表着后台响应头里面的data
* @params iShowError 代表着上传文件之后后台返回excle（导出统一在响应拦截里面处理）的同时，前台给一个错误提示语
* */
function result(response, iShowError = false) { // 此方法的this指向已被call修改，使用时请先查看upLoadFile.vue
  console.log(response instanceof Blob);
  if (response instanceof Blob) {
    const reader = new FileReader();
    reader.readAsText(response, 'utf-8');
    const _this = this;
    reader.onload = function(e) {
      const content = reader.result;
      if (content.includes('{"code":')) { // 这里是导出的时候后台返回的提示，因为类型是Blob类型的，所以在这里判断是否有code，没有表示blob是一个文件流。有的话表示是一个提示语
        const result = JSON.parse(content);
        if (result.code && result.code !== 200) {
          Message({
            message: result.msg || 'Error',
            type: 'error',
            duration: 3 * 1000
          });
        }
        if (result.code && result.code === 200) {
          Message({
            message: result.msg,
            type: 'success',
            duration: 3 * 1000
          });
          _this.$emit('handleSuccess');
        }
      } else {
        if (iShowError) {
          Message({
            type: 'error',
            message: '上传失败！',
            duration: 3000
          });
        }
      }
    };
  }
}

export default result;
