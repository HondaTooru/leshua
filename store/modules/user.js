import { wxLogin, getUserInfo, AddressList } from '@/api'

const user = {
	state: {
		userInfo: 0,
		addressList: [],
		encrypteData: '',
		iv: '',
		signature: '',
		spid: ''
	},
	mutations: {
		SET_ADDRESSLIST: (state, addressList) => {
			state.addressList = addressList
		},
		DEL_ADDRESSLIST: (state, index) => {
			state.addressList.splice(index, 1)
			uni.setStorageSync('ADDRESS', state.addressList)
		},
		SET_USERINFO: (state, userInfo) => {
			state.userInfo = userInfo
		},
		SET_ENCRYPTEDATA: (state, encrypteData) => {
			state.encrypteData = encrypteData
		},
		SET_IV: (state, iv) => {
			state.iv = iv
		},
		SET_SIGNATURE: (state, signature) => {
			state.signature = signature
		},
		SET_MONEY: (state, money) => {
			state.userInfo.now_money += money
		},
		SET_SPID: (state, spid) => {
			state.spid = spid
		}
	},
	actions: {
		 wxAuth ({ state, commit, dispatch }, e) {
			 return new Promise(resolve => {
				uni.login({
					provider: 'weixin',
					success: async result => {
						const code = result.code
						const userinfo = e.detail.rawData
						const x = await dispatch('wxLogin', { code, userinfo, e })
						resolve(x)
					}
				})
			 })			
		},
		async wxLogin ({ dispatch }, info) {
			return new Promise( async resolve => {
				uni.showLoading({ title: '授权中­' })
				await dispatch('login', info)
				const x = await dispatch('getUserInfo')
				await dispatch('getAddress')
				uni.hideLoading()
				resolve(x)
			})
		},
		login ({ commit, state }, { code, userinfo, e }) {
			return new Promise(resolve => {
				wxLogin({ code, userinfo, spid: state.spid }).then(res => {
					const openid = res.data.routine_openid
					uni.setStorageSync('openid', openid)
					resolve()
				})				
			})			
		},
		getUserInfo ({ commit }) {
			return new Promise(resolve => {
				getUserInfo().then(res => {
					const user = res.data
					const id = +res.data.spread_uid
					if (id > 0) {
						res.data.now_money = +res.data.now_money
						commit('SET_USERINFO', user)
						uni.setStorageSync('USER', user)
						resolve(true)
					} else {
						resolve(false)
						uni.setStorageSync('O_USER', user)
					}
				})
			})
		},
		getAddress ({ commit }) {
			return new Promise(resolve => {
				AddressList().then(res => {
					const list = res.data.map(item => {
						item.is_default = +item.is_default
						return item
					})
					commit('SET_ADDRESSLIST', list)
					uni.setStorageSync('ADDRESS', list)
					resolve()
				})
			})
		}
	}
}

export default user