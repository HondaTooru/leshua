const getters = {
	userInfo: state => state.user.userInfo,
	spid: state => state.user.spid,
	addressList: state => state.user.addressList,
	model: state => state.shop.model
}

export default getters