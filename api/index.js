import service from '@/utils/request'

export function BindIndex (data) {
	return service.post('/routine/Buildapi/index', data)
}

export function ProList () { // 产品列表
	return service.get('/routine/Buildapi/get_product_list').then(res => res)
}

export function ProDetails (data) { // 产品详情
	return service.post('/routine/Auth_api/details', data).then(res => res)
}

export function wxLogin (data) { // 用户登录
	return service.post('/routine/Login/index', data).then(res => res)
}

export function getUserInfo (data) { // 获取用户资料
	return service.post('/routine/Auth_api/get_user_info', data).then(res => res)
}

export function addCart (data) {  // 加入购物车
	return service.post('/routine/Auth_api/unique', data).then(res => res)
}

export function CartList (data) { // 购物车列表
	return service.post('/routine/Auth_api/get_cart_list', data).then(res => res)
}

export function upDateCartNum (data) { // 更新购物车数量
	return service.post('/routine/Auth_api/update_cart_num', data).then(res => res)
}

export function delRemoveCart (data) { // 删除购物车数据
	return service.post('/routine/Auth_api/del_remove_cart', data).then(res => res)
}

export function editUserAddr (data) { // //添加修改用户地址
	return service.post('/routine/Auth_api/edit_user_address', data).then(res => res)
}

export function AddressList (data) { //获取用户所有地址
	return service.post('/routine/Auth_api/user_address_list', data).then(res => res)
}

export function setDefault (data) { //设置为默认地址
	return service.post('/routine/Auth_api/set_address', data).then(res => res)
}

export function delAddress (data) { //删除地址
	return service.post('/routine/Auth_api/del_user_address', data).then(res => res)
}

export function getDefault (data) { //获取默认地址
	return service.post('/routine/Auth_api/user_default_address', data).then(res => res)
}

export function confirmCart (data) { //提交购物车数据
	return service.post('/routine/Auth_api/confirm_order', data).then(res => res)
}

export function createOrder (data) { //提交数据创建订单 返回拉起需要支付的参数
	return service.post('/routine/Auth_api/pay_create_order', data).then(res => res)
}

export function GetCode () {
	return service.post('/routine/Auth_api/get_code').then(res => res)
}

export function getCard () { // 获取我的会员
	return service.post('/routine/Auth_api/count_card').then(res => res)
}

export function getCardList (data) { // 获取会员列表
	return service.post('/routine/Auth_api/cardlist', data).then(res => res)
}

export function getOrder (data) { // 获取订单列表
	return service.post('/routine/Auth_api/order_list', data).then(res => res)
}

export function orderDetail (data) { // 订单详情
	return service.post('/routine/Auth_api/order_dedail', data).then(res => res)
}

export function BalanceList (data) { // 零钱使用记录
	return service.post('/routine/Auth_api/balance_list', data).then(res => res)
}

export function upload (data) { // 上传
	return service.post('/routine/Auth_api/upload', data, { header: { 'content-type': 'multipart/form-data' } }).then(res => res)
}
 
export function SubMitApply (data) {  // 激活
	return service.post('/routine/Auth_api/submit_apply', data).then(res => res)
}

export function UserExtract (data) { // 提现
	return service.post('/routine/Auth_api/user_extract', data).then(res => res)
}

export function toPay (data) { // 去付款
	return service.post('/routine/Auth_api/user_pay_order', data).then(res => res)
}

export function ConOrder (data) { // 确认收货
	return service.post('/routine/Auth_api/deter_order', data).then(res => res)
}

export function cancelOrder (data) { // 取消订单
	return service.post('/routine/Auth_api/remove_order', data).then(res => res)
}
export function Scened (data) { // 记录会员参数
	return service.post('/routine/Buildapi/sence', data).then(res => res)
}
export function rulesd (data) { //会员活动规则
	return service.post('/routine/Buildapi/rule', data).then(res => res)
}