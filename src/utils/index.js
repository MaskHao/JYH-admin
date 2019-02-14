/**
 * Created by jiachenpan on 16/11/18.
 */
// import { JSEncrypt } from 'jsencrypt'
import CryptoJS from 'crypto-js/crypto-js'
// const CryptoJS = require('crypto-js');
// import md5 from 'js-md5'
import axios from 'axios'
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
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
    )
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function reduceProsLength(obj, length) {
  const newObj = Object.assign({}, obj)
  Object.keys(newObj).forEach(res => {
    // if (res === 'GoodSku' && Array.isArray(newObj[res])) {
    //   newObj[res] = newObj[res].map(item => {
    //     return reduceProsLength({ ...item }, 3)
    //   })
    // } else {
    //   newObj[res.slice(length)] = newObj[res]
    //   delete newObj[res]
    // }
    if (res !== 'GoodSku') {
      newObj[res.slice(length)] = newObj[res]
      delete newObj[res]
    }
  })
  return newObj
}

export function addProsLength(obj, str) {
  const newObj = Object.assign({}, obj)
  Object.keys(newObj).forEach(res => {
    if (res !== 'GoodSku') {
      newObj[str + res] = newObj[res]
      delete newObj[res]
    }
  })
  return newObj
}

export function checkURL(URL) {
  var str = URL
  // 判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
  // 下面的代码中应用了转义字符"\"输出一个字符"/"
  var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
  var objExp = new RegExp(Expression)
  if (objExp.test(str) === true) {
    return true
  } else {
    return false
  }
}

/**
 *导出excel
 *
 * @export
 * @param {*} data
 */
export function excelExport(data, callback) {
  axios({
    method: 'post',
    url: process.env.BASE_API + '/Order/OrderExport ',
    data: GetVisitData(data),
    headers: {
      Accept: 'text/html, application/xhtml+xml, */*'
    },
    responseType: 'blob' // 表明返回服务器返回的数据类型
  }).then(res => {
    // 处理返回的文件流
    // 主要是将返回的data数据通过blob保存成文件
    var content = res.data
    var blob = new Blob([content])
    var fileName = '订单.xlsx' // 要保存的文件名称
    if ('download' in document.createElement('a')) {
      // 非IE下载
      const eLink = document.createElement('a')
      eLink.download = fileName
      eLink.style.display = 'none'
      eLink.href = URL.createObjectURL(blob)
      document.body.appendChild(eLink)
      eLink.click()
      URL.revokeObjectURL(eLink.href) // 释放URL 对象
      document.body.removeChild(eLink)
      callback
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, fileName)
      callback
    }
  })
}

export function getInteger(number) {
  if (number.length === 1) {
    number = number.replace(/[^1-9]/g, '')
  } else {
    number = number.replace(/\D/g, '')
  }
  return number
}

export function deepClone(obj) {
  const objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key])
        } else {
          // 如果不是，简单复制
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}

function GetTimeStamp() {
  const dtmNow = new Date()
  dtmNow.setMinutes(dtmNow.getMinutes() + dtmNow.getTimezoneOffset()) // 当前时间(分钟) + 时区偏移(分钟)
  return dtmNow.getTime().toString()
}

function GetRandomString(intLength) {
  intLength = intLength || 16
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < intLength; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}
export function GetVisitData(strParameter) {
  let strVisitValue = JSON.stringify(strParameter)
  const strVisitID = GetRandomString(16)
  strVisitValue = CryptoJS.AES.encrypt(
    strVisitValue,
    CryptoJS.enc.Utf8.parse(strVisitID),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  )
  strVisitValue = encodeURI(strVisitValue)
  strVisitValue = strVisitValue.replace(/\+/g, '%2B')
  strVisitValue = strVisitValue.replace(/\=/g, '%4S')
  const strTimeStamp = GetTimeStamp()
  let strSign =
    'mH607fLmHPCF' + '&' + JSON.stringify(strParameter) + '&' + strTimeStamp
  strSign = CryptoJS.MD5(strSign)
  const arrRequest = {
    VisitID: strVisitID,
    Parameter: strVisitValue,
    TimeStamp: strTimeStamp.toString(),
    Sign: strSign.toString()
  }
  const strRequest = 'strRequest=' + JSON.stringify(arrRequest)
  return strRequest
}
