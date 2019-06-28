<template>
	<view style="overflow: hidden;">
		<cu-custom bgColor="bg-gradual-red" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">订单详情</block>
		</cu-custom>
		<view class="detail bg-white">
			<view class="top bg-red">
				<view class="status">
					<view>{{ item.status_name }}</view>
					<view class="addr">
						<view class="flex align-center">
							<view class="flex margin-right-xs"><image src="/static/addr.png"></image><text class="text-black text-df">{{ item.real_name }}</text></view>
							<view class="phone">{{ item.user_phone }}</view>
						</view>
						<view class="text-sm text-lgrey padding-left-sm padding-top-xs">地址：{{ item.user_address }}</view>						
					</view>
				</view>
			</view>
			<view class="shop solid-bottom shadow-blur">
				<view class="tit flex align-center">
					<text class="lg text-black cuIcon-shopfill padding-right-xs"></text>
					派送宝商城</view>
			</view>
			<view class="pro padding-sm">
				<view class="flex align-center" v-for="(o, index) in item.cartInfo" :key="index">
					<view class="img" hover-class="none">
						<image :src="o.productInfo.image"></image>
					</view>
					<view class="flex-sub">
						<view class="text-df text-cut text-black">{{ o.productInfo.store_name }}</view>
						<view class="rule margin-top-xs">
							<text class="text-xs">数量：x{{ o.cart_num }}</text>
							<text class="margin-left-xs">{{ o.productInfo.attrInfo.suk }}</text>
						</view>
						<!-- <view class="text-price text-bold text-df margin-top-xs">{{ 1500 }}</view> -->
					</view>						
				</view>
			</view>
		</view>
		<view class="bg-white calc padding-left-sm padding-right-sm margin-top-sm margin-bottom-sm padding-bottom-xs">
			<view class="flex padding-top-xs">
				<view class="padding-right-sm">订单编号：</view>
				<view>{{ item.order_id }}</view>
			</view>	
			<view class="flex padding-top-xs">
				<view class="padding-right-sm">下单时间：</view>
				<view>{{ item.add_time }}</view>
			</view>
<!-- 			<view class="flex padding-top-xs">
				<view class="padding-right-sm">发货时间：</view>
				<view>2020-20-20 59:59:59</view>
			</view>
			<view class="flex padding-top-xs">
				<view class="padding-right-sm">签收时间：</view>
				<view>2020-20-20 59:59:59</view>
			</view>	 -->					
		</view>
		<view class="total bg-white">
			<view class="solid-bottom padding-top-sm padding-bottom-sm">
				<view class="padding-right-sm padding-left-sm">
					<view class="flex justify-between">
						<view>商品总额：</view>
						<view class="text-price text-bold text-df">{{ item.cost }}</view>
					</view>
<!-- 					<view class="flex justify-between">
						<view>运费：</view>
						<view class="text-bold text-red text-df">
							+<text class="text-price">12.00</text>
						</view>
					</view> -->
				</view>
			</view>
			<view class="flex justify-end padding-sm">
				<view>实付款：<text class="text-price text-bold text-red">{{ item.total_price }}</text></view>
			</view>
		</view>
		<view class="tool flex justify-end padding-sm bg-white" v-if="(item.status === 4&&item.paid==1) || (item.status==1&&item.paid==1) || (!item.status&&item.paid==0)">
			<view>
				<button class="cu-btn line-red sm round" v-if="item.status === 4&&item.paid==1">评论晒单</button>
				<button class="cu-btn line-red sm round" v-if="item.status==1&&item.paid==1" @tap="Co_Order">确认收货</button>
				<button class="cu-btn line-red sm round" v-if="!item.status&&item.paid==0" @tap="C_order">取消订单</button>
				<button class="cu-btn bg-red sm round" v-if="!item.status&&item.paid==0" @tap="rightPay">去付款</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { orderDetail, toPay, ConOrder, cancelOrder } from '@/api'
	export default {
		name: 'detail',
		data () {
			return {
				order_id: '',
				item: {},
				list: [
					{ name: '全部订单', type: -2 },	
					{ name: '待付款', type: 0 },
					{ name: '待发货', type: 1 },
					{ name: '待收货', type: 2 },
					{ name: '已签收', type: 3 },
					{ name: '待评价', type: 4 },
					{ name: '已退款', type: -1 }					
				]				
			}
		},
		onLoad(options) {
			this.order_id = options.batchcode
			this.getDetails()
		},
		methods: {
			rightPay () {
				uni.showLoading({ mask: true, title: '支付中' })
				toPay({ order_id: this.order_id }).then(res => {
					uni.hideLoading()
					uni.requestPayment({
						provider: 'weixin',
						...res.data.result.jsConfig,
						success: rst => {
							uni.navigateBack()
						}
					})					
				})
			},
			Co_Order () {
				uni.showLoading({ mask: true, title: '加载中...' })
				ConOrder({order_id: this.order_id}).then(res => {
					uni.hideLoading()
					if (res.code === 200) {
						uni.showModal({
							content: '收货成功',
							showCancel: false,
							success: rst => {
								this.item.status = 4
							}
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
					}
				})
			},			
			C_order () {
				uni.showLoading({ mask: true, title: '加载中...' })
				cancelOrder({order_id: this.order_id}).then(res => {
					uni.hideLoading()
					if (res.code === 200) {
						uni.showModal({
							content: '取消成功',
							showCancel: false,
							success: rst => {
								uni.navigateBack()
							}
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
					}
				})
			},
			getDetails () {
				uni.showLoading({ title: '加载中...' })
				orderDetail({ order_id: this.order_id }).then(res => {
					uni.hideLoading()
					let x = res.data
					let m = []
					for (let i in x.cartInfo) m.push(x.cartInfo[i])
					x.status = +x.status
					x.cartInfo = m
					x.status_name =x._status._title // this.list.filter(k => k.type === x.status)[0].name
					this.item = x
				})
			}
		}
	}
</script>

<style lang="less">
page {
	padding-bottom: 120upx;
}
.detail {
	.status {	
		color: white;		
		padding: 20upx 15upx 100upx;
		position: relative;		
		& > view {
			&.addr {
				position: absolute;
				left: 15upx;
				right: 15upx;
				bottom: 0;
				transform: translate3d(0, 50%,0);
				background-color: white;
				border-radius: 15upx;
				overflow: hidden;
                box-shadow: 0px 2px 12px 0px #e8e8e8;
				color: black;
				padding: 20upx 15upx;
				image {
					width: 35upx;
					height: 35upx;
					display: block;
					margin-right: 6upx;
				}				
			}			
		}
	}
	.shop {
		padding: 80upx 0 0 0;
		.tit {
			height: 80upx;
			display: flex;
			align-items: center;
			padding: 0 15upx;
			.lg {
				font-size: 36upx;
			}
		}
	}
	.pro {
		& > view {
			&:not(:last-of-type) {
				margin-bottom: 15upx;
			}
			.img {
				width: 140upx;
				height: 140upx;
				margin-right: 20upx;									
				image {
					width: 100%;
					height: 100%;
					display: block;
				}
			    & + view { overflow: hidden; }
			}												
		}
	}
}
.tool {
	position: fixed;
	left: 0;
	width: 100%;
	bottom: 0;
	z-index: 99;
	button {
		&:not(:last-of-type) {
			margin-right: 15upx;
		}
	}
}
</style>
