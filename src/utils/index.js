/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/');
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ]; }
    return value.toString().padStart(2, '0');
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split('&');
  searchArr.forEach(v => {
    const index = v.indexOf('=');
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
 * @param {array} cache
 * @param {string} pId
 * @param {string} id
 * @returns {array}
 */
export function levelToTree(cache, pId, id) {
  const parents = cache.filter(value => value[pId] === '0');
  const childrens = cache.filter(value => value[pId] !== '0');
  const translator = (parents, childrens) => {
    parents.forEach((parent) => {
      childrens.forEach((current, index) => {
        if (current[pId] === parent[id]) {
          const temp = JSON.parse(JSON.stringify(childrens));
          temp.splice(index, 1);
          translator([current], temp);
          typeof parent.childrens !== 'undefined' ? parent.childrens.push(current) : parent.childrens = [current];
        }
      }
      );
    }
    );
  };
  translator(parents, childrens);
  return parents;
}
/**
 * 保留两位小数
 * @param {number} num
 * @returns {number}
 */
export function keepTwoDecimalFull(num) {
  let result = parseFloat(num);
  if (isNaN(result)) {
    console.warn('传递参数错误，请检查！');
    return false;
  }
  result = Math.round(num * 100) / 100;
  let s_x = result.toString();
  let pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0';
  }
  return s_x;
}

export class LimitLoad {
  constructor(urls, handler, limit) {
    this.urls = urls;
    this.handler = handler;
    this.limit = limit;
  }
  async handleLimtite() {
    const sequence = [].concat(this.urls);
    let promise = [];
    const promiseAll = [];
    promise = sequence.splice(0, this.limit).map((url, index) => {
      const _t = this.handler(url);
      promiseAll.push(_t);
      return _t.then((res) => {
        return [index, res];
      });
    });
    for (let i = 0; i < sequence.length; i++) {
      const [index] = await Promise.race(promise);
      const _t = this.handler(sequence[i]);
      promiseAll.push(_t);
      promise[index] = _t.then((res) => {
        return [index, res];
      });
    }
    return Promise.allSettled(promiseAll);
  }
}
