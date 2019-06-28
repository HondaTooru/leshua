<template>
	<view class="create">
		<cu-custom bgColor="bg-gradual-red" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">确认订单</block>
		</cu-custom>
		<view>
			<view v-if="addrs !== '{}'" :class="['address bg-white', { readonly: isCreate }]" @tap="selectAddr">
				<view class="people">
					<text>{{ addrs.real_name }}</text><text>{{ addrs.phone }}</text>
				</view>		
				<view class="info"><text v-if="addrs.is_default">默认</text>{{ addrs.province+addrs.city+addrs.district+' '+addrs.detail }}</view>
				<image src="/static/separator.png"></image>
			</view>
			<view class="list bg-white">
				<view class="head solid-bottom text-black"><text class="lg cuIcon-shopfill"></text>派送宝商城</view>
				<view class="item" v-for="(item, i) in list" :key="i">
					<image :src="item.productInfo.image"></image>
					<view class="desc">
						<view class="title"><text class="text-black">{{ item.productInfo.store_name }}</text></view>
						<view class="attr_name padding-top-xs padding-bottom-xs">{{ item.attrInfo.suk }}</view>
						<view class="price">
							<text><text class="m text-bold">{{ '' }}</text></text>
							<text class="text-xs">x{{ item.cart_num }}</text>
						</view>				
					</view>
				</view>				
			</view>
			<view class="message">
				<view>买家留言：</view>
				<input type="text" :disabled="isCreate" v-model="params.mark" placeholder="留言建议提前协商(50字以内)">
			</view>
			<view class="d">
				<view class="bg-white flex justify-between padding-top-xs padding-bottom-xs solid-bottom">
					<view>商品总额</view>
					<view class="text-price text-bold" v-if="model.is_unified==1">{{ model.u_price }}</view>
					<view class="text-price text-bold text-red text-xl"  v-else="model.is_unified==0"><block>{{truePrice}}</block></view>
				</view>
<!-- 				<view class="bg-white flex justify-between padding-top-xs padding-bottom-xs">
					<view>运费</view>
					<view class="text-price text-bold text-red">12.00</view>
				</view>	 -->			
			</view>
		</view>
		<view class="tool solid-top">
			<view class="text-price text-bold text-red text-xl" v-if="model.is_unified==1">{{ model.u_price }}</view>
			<view class="text-price text-bold text-red text-xl" v-if="model.is_unified==0"><block>{{truePrice}}</block></view>
			<view @tap="submit">去支付</view>
		</view>		
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { createOrder } from '@/api'
	export default {
		name: 'create',
		data () {		
			return {
				isCreate: false, // 订单是否创建完成
				addrId: '',
				list: [],
				truePrice:0,
				params: {
					payType: 'weixin',
					useIntegral: 0,
					mark: ''
				}
			}
		},
		computed: {
			...mapGetters(['addressList', 'model']),
			addrs () {
				if (this.addressList.length) {
					if (this.addrId) return this.addressList.filter(item => item.id === this.addrId)[0]
					const len = this.addressList.filter(item => item.is_default)
					if (len.length) {
						return len[0]
					} else {
						return this.addressList[0]
					}
				}
				return '{}'
			},
			addressId () {
				// const this.truePrice = uni.getStorageSync('truePrice')
				const addrId = uni.getStorageSync('ADDRID')
				if (addrId) return addrId
				if (this.addressList.length) {
					const len = this.addressList.filter(item => item.is_default)
					if (len.length) {
						return len[0].id
					} else {
						return this.addressList[0].id
					}
				}	
				return 0
			},
			cartId () {
				return JSON.stringify(this.list.map(item => item.id))
			}
		},
		onLoad() {
			uni.setStorageSync('ADDRID', '')
			this.$nextTick(() => {
				const list = uni.getStorageSync('SET_SHOP') || []
				this.list = list
				this.truePrice = uni.getStorageSync('truePrice') || 0
			})
		},
		onShow () {
			this.addrId = uni.getStorageSync('ADDRID')
			if (this.addrs === '{}') {
				uni.showModal({
					content: '您还没有收获地址',
					confirmText: '去添加',
					success: rst => {
						if (rst.confirm) {
							uni.navigateTo({
								url: '/user/address?type=1'
							})
						} else {
							uni.navigateBack()
						}
					}
				})
			}
		},
		methods: {
			selectAddr () {
				uni.navigateTo({
					url: '/user/address?type=1'
				})
			},
			submit () {
				uni.showLoading({ title: '支付中', mask:true })
				const cartId = this.cartId
				const addressId = this.addressId
				createOrder(Object.assign({}, this.params, { cartId }, { addressId })).then(res => {
					uni.hideLoading()
					uni.requestPayment({
						provider: 'wxpay',
						...res.data.result.jsConfig,
						success: rst => {
							uni.redirectTo({
								url: '/user/order/list?type=-2'
							})
						}
					})
				})
			}
		}
	}
</script>

<style lang="less">
.create {
	padding: 20upx 0 108upx;
	.address {
		padding: 20upx 15upx;
		margin: 0 15upx 20upx;
		position: relative;
		&.readonly { position: relative; }
		&:not(.readonly) { 
			&::before {
				position: absolute;
				top: 0;
				right:  30upx;
				bottom: 0;
				display: block;
				margin: auto;
				width: 30upx;
				height: 30upx;
				color: var(--black);
				content: "\e6a3";
				text-align: center;
				font-size: 34upx;
				font-family: cuIcon;
				line-height: 30upx
			}			
		}
		//.box-shadow;
		.people {
			text { 
				font-weight: 600;
				//font-size:@title;
				&:last-of-type {
					padding-left: 40upx;
				}
			 }
		}
		.info {
			font-size:20upx;
			color:var(--gray);
			padding-top: 10upx;
			& > text {
				color:white;
				background-color:var(--red);
				padding: 4upx 20upx;
				border-radius: 20upx;
				margin-right: 10upx;
			}
		}
		& > image {
			position: absolute;
			width: 100%;
			left: 0;
			bottom: 0;
			height: 2px;
		}
	}
	.d {
		& > view {
			padding-right: 15upx;
			padding-left: 15upx;
			padding-top: 15upx;
			padding-bottom: 15upx;
		}
		margin: 0 15upx 20upx;
	}
	.list {
		margin: 0 15upx 20upx;
		.head {
		    padding: 0 15upx;			
			height: 80upx;
			// font-size:@title;
			display: flex;
			align-items: center;
			.lg {
				font-size: 38upx;
				margin-right: 10upx;
			}
			image {
				width: 36upx;
				height: 36upx;
				margin-right: 10upx;
				display: block;
			}			
		}
		.item {
			padding: 20upx 15upx;
			display: flex;
			align-items: flex-start;
			&:not(:last-of-type) {  }
			image {
				width: 150upx;
				height: 150upx;
				display: block;
			}
			.desc {
				flex: 1;
				display: flex;
				flex-direction: column;
				flex-flow: column;
				justify-content: space-between;
				margin-left: 20upx;
				.title {  }
				.price {
					display: flex;
					justify-content: space-between;
					align-items: center;
					text {
						&:nth-of-type(1) {
							color:var(--red)
						}
					}
				}
				.attr_name {
					font-size:20upx;
					color:var(--gray);
				}
			}			
		}
	}
	.message {
		height: 80upx;
		margin: 20upx 15upx;
		padding: 0 15upx;
		display: flex;
		align-items: center;
		background-color:var(--white);
		input {
			flex: 1;
			height: 100%;
		}
	}
	.tool {
		box-sizing: border-box;
		width: 100%;
		bottom: 0;
		left: 0;
		background-color:white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80upx;
		padding-left: 15upx;
		z-index: 666;
		position: fixed;
		& > view {
			&:nth-of-type(2) {
				background-color:var(--red);
				color:white;
				height: 100%;
				display: flex;
				align-items: center;
				padding: 0 50upx;
			}
		}
	}	
}	
</style>
