/*
 * @Author: Jane
 * @Date: 2021-06-04 18:27:25
 * @LastEditors: Jane
 * @LastEditTime: 2021-06-04 18:27:59
 * @Descripttion: 
 */
/*
 * @Author: Jane
 * @Date: 2021-06-03 16:59:03
 * @LastEditors: Jane
 * @LastEditTime: 2021-06-04 16:50:06
 * @Descripttion: 敏感词搜索函数
 * @调用方法：new Sensitive().search(str) str 需要检测的字符串
 */

import DATA from './data';

/**
 * @Author: Jane
 * @description: 敏感词搜索构造函数
 * @param {*}
 * @return {String} text 被过滤的字符串
 */
class SensitiveSearch {
  constructor() {
    this.sensitiveWordList = DATA.DATA;
    this.sensitiveReg = /^[a-zA-Z\u4E00-\u9FA5]+$/; // 过滤特殊字符正则

    this.sensitiveWordListMap = this.makeSensitiveMap();
  }

  /**
   * @Author: Jane
   * @description: 构造敏感词map
   * @param {*}
   * @return {Object} map
   */
  makeSensitiveMap() {
    const result = new Map();
    this.sensitiveWordList.map((word) => {
      let map = result;
      for (let i = 0; i < word.length; i += 1) {
        // 依次获取字
        const char = word.charAt(i);
        // 判断是否存在
        if (map.get(char)) {
          // 获取下一层节点
          map = map.get(char);
        } else {
          // 将当前节点设置为非结尾节点
          if (map.get('laster') === true) {
            map.set('laster', false);
          }
          const item = new Map();
          // 新增节点默认为结尾节点
          item.set('laster', true);
          map.set(char, item);
          map = map.get(char);
        }
      }
      return word;
    });
    return result;
  }

  /**
   * @Author: Jane
   * @description: 检查敏感词是否存在
   * @param {Object} txt
   * @param {Number} index
   * @return {Object}
   */
  checkSensitiveWord(txt, index) {
    let mapData = this.sensitiveWordListMap;
    let flag = false;
    let wordNum = 0;// 记录过滤
    let sensitiveWord = ''; // 记录过滤出来的敏感词
    for (let i = index; i < txt.length; i += 1) {
      const word = txt.charAt(i);
      if (word === ' ' || !this.sensitiveReg.test(word)) {
        sensitiveWord += word;
      } else {
        mapData = mapData.get(word);
        if (mapData) {
          wordNum += 1;
          sensitiveWord += word;
          if (mapData.get('laster') === true) {
            // 表示已到词的结尾
            flag = true;
            break;
          }
        } else {
          break;
        }
      }
    }
    // 两字成词
    if (wordNum < 2) {
      flag = false;
    }
    return { flag, sensitiveWord };
  }

  /**
   * @Author: Jane
   * @description: 判断文本中是否存在敏感词
   * @param {Object} data 将要判断的文本
   * @return {String}
   */
  search(data) {
    let text = data;
    let result = { flag: false, sensitiveWord: '' };
    // 过滤掉除了中文、英文、数字之外的干扰字符进行检查
    // const newText = text.replace(/[^\u4e00-\u9fa5\u0030-\u0039\u0061-\u007a\u0041-\u005a]+/g, '');
    text.replace(/(^\s*)|(\s*$)/g, ''); // 去除首尾空格
    text.replace(/[\r\n]/g, ''); // 去掉回车
    for (let i = 0; i < text.length; i += 1) {
      result = this.checkSensitiveWord(text, i);
      if (result.flag) {
        // 这里我们可以返回false提示用户不能提交 或者把敏感词全部替换为*
        // return false
        let str = '';
        switch (result.sensitiveWord.length) {
          case 1:
            str = '*';
            break;
          case 2:
            str = '**';
            break;
          default:
            str = '***';
            break;
        }
        text = text.replace(result.sensitiveWord, str);
      }
    }
    return text;
  }
}
export default SensitiveSearch;
