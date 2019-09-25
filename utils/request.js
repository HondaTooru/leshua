import Vue from 'vue'

class Request {
  config = {
    baseUrl: '',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success () {
    },
    fail (err) {
		uni.showToast({
			title: err.errMsg,
			icon: 'none',
			duration: 2000
		})
    },
    complete () {
    }
  }

  static posUrl (url) { /* 判断url是否为绝对路径 */
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  }

  interceptor = {
    request (f) {
      if (f) {
        Request.requestBeforeFun = f
      }
    },
    response (f) {
      if (f) {
        Request.requestComFun = f
      }
    }
  }

  static requestBeforeFun (config) {
    return config
  }

  static requestComFun (response) {
    return response
  }

  setConfig (f) {
    this.config = f(this.config)
  }

  request (options = {}) {
    options.baseUrl = options.baseUrl || this.config.baseUrl
    options.dataType = options.dataType || this.config.dataType
    options.url = Request.posUrl(options.url) ? options.url : (options.baseUrl + options.url)
    options.data = options.data || {}
    options.header = options.header || this.config.header
    options.method = options.method || this.config.method
    return new Promise((resolve, reject) => {
      let next = true
      let _config = null
      options.complete = (response) => {
        let statusCode = response.statusCode
        response.config = _config
        response = Request.requestComFun(response)
        if (statusCode === 200) { // 成功
          resolve(response)
        } else {
          reject(response)
        }
      }
      let cancel = (t = 'handle cancel') => {
        let err = {
          errMsg: t,
          config: afC
        }
        reject(err)
        next = false
      }
      let afC = { ...this.config, ...options }
      _config = { ...afC, ...Request.requestBeforeFun(afC, cancel) }
      if (!next) return
      uni.request(_config)
    })
  }

  get (url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'GET'
    return this.request(options)
  }

  post (url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'POST'
    return this.request(options)
  }
}

const service = new Request()
const str = ['订单不存在', '已领取过该优惠劵!', '领取的优惠劵已领完或已过期!']
service.setConfig(config => {
	config.baseUrl = 'https://clob.bjhg168.com'
	return config
})

service.interceptor.request((config, cancel) => { // 请求之前拦截
  let openid = uni.getStorageSync('openid')
	if (openid) config.data.openid = openid
	return config
})
service.interceptor.response(response => {
	return new Promise((resolve, reject) => {
		let result = response.data
		if (result.code === 200) {
			resolve(result)
		} else {
			uni.hideLoading()
			reject(result.msg)
			// if (result.msg) {
			// 	uni.showModal({
			// 		content: result.msg,
			// 		showCancel: false,
			// 		success: rst => {
			// 			if (!str.includes(result.msg)) uni.navigateBack() 
			// 		}
			// 	})				
			// }
		}		
	})
})


export default service