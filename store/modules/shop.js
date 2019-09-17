const shop = {
	state: {
		model: {},
		location: [],
		address: '加载中...',
		cid: '',
		cdetail: '',
		is_show: false,
		BarShow: 0
	},
	mutations: {
		SET_BARSHOW: (state, BarShow) => {
			state.BarShow = BarShow
		},
		SET_MODEL: (state, model) => {
			state.model = model
		},
		SET_CID: (state, cid) => {
			state.cid = cid
		},
		SET_CDETAIL: (state, cdetail) => {
			state.cdetail = cdetail
		},
		SET_LOCATION: (state, location) => {
			state.location = location
		},
		SET_ADDRESS: (state, address) => {
			state.address = address
		},
		SET_SHOW: (state, is_show) => {
			state.is_show = is_show
		}
	}
}

export default shop