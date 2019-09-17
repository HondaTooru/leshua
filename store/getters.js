const getters = {
	userInfo: state => state.user.userInfo,
	spid: state => state.user.spid,
	addressList: state => state.user.addressList,
	phone: state => state.user.phone,
	cid: state => state.shop.cid,
	BarShow: state => state.shop.BarShow,
	model: state => state.shop.model,
	cdetail: state => state.shop.cdetail,
	address: state => state.shop.address,
	location: state => state.shop.location,
	is_show: state => state.shop.is_show
}

export default getters