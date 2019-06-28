<template>
	<view class="olx flex flex-direction">
		<cu-custom bgColor="bg-gradual-red" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">我的订单</block>
		</cu-custom>
		<cu-tab v-if="loaded" :list="list" :act="params.type" @on-change="change"></cu-tab>
		<view class="flex-sub" style="overflow: hidden;">
		<scroll-view scroll-y style="height: 100%;" @scrolltolower="getList(1)">
			<view class="list" v-if="order.length">
				<view class="item" v-for="(item, i) in order" :key="i">
					<view class="title bg-white  padding-sm flex justify-between align-center">
						<view class="text-sm">{{ item.add_time }}</view>
						<view class="text-red text-sm">{{ item.status_name }}</view>
					</view>
					<view class="pro" @tap="toDetail(item.order_id)">
						<view class="flex justify-between padding-sm" v-for="(k, x) in item.cartInfo" :key="x">
							<image :src="k.productInfo.image"></image>
							<view class="flex-sub margin-left-sm">
								<view>{{ k.productInfo.store_name }}</view>
								<view class="flex justify-between  margin-top-sm">
									<view class="text-sm text-gray">{{ k.productInfo.attrInfo.suk }}</view>
									<view class="text-gray text-sm">x1</view>
								</view>
							</view>							
						</view>
					</view>
					<view class="total solid-bottom">
						<view class="text-sm flex justify-end padding-sm bg-white">
							<view><text class="padding-right-sm">共计{{ item.total_num }}件商品</text>付款<text class="text-price text-red text-bold text-df padding-left-xs">{{ item.pay_price }}</text></view>
						</view>
					</view>
					<view  class="button bg-white flex justify-end padding-top-xs padding-bottom-xs padding-left-sm padding-right-sm" v-if="(!item.status&&item.paid==0) || (item.status==1&&item.paid==1)">
						<view class="btn">
							<button class="cu-btn round line-red sm" v-if="!item.status&&item.paid==0" @tap="toDetail(item.order_id)">去付款</button>
							<button class="cu-btn line-red sm round" v-if="item.status==1&&item.paid==1" @tap="toDetail(item.order_id)">确认收货</button>
						</view>
					</view>
				</view>
			</view>	
			<empty-data v-else></empty-data>			
		</scroll-view>
		</view>
	</view>
</template>

<script>
	import cuTab from '@/components/cu-tab'
	import { getOrder } from '@/api'
	export default {
		name: 'list',
		components: { cuTab },
		onLoad(options) {
			this.params.type = +options.type
		},
		onShow() {
			this.getList(0)
		},
		data () {
			return {
				params:{
					type: -2,
					first: 0,
					limit: 10
				},
				loaded: false,
				order: [],
				list: [
					{ name: '全部订单', type: -2 },	
					{ name: '待付款', type: 0 },
					{ name: '待发货', type: 1 },
					{ name: '待收货', type: 2 },
					{ name: '已签收', type: 3 },
					// { name: '待评价', type: 4 },
					// { name: '已退款', type: -1 }					
				]
			}
		},
		methods: {
			toDetail (batchcode) {
				uni.navigateTo({
					url: `/user/order/detail?batchcode=${batchcode}`
				})
			},
			change (type) {
				this.params.type = type
				this.params.first = 0
				this.order = []
				this.getList()
			},
			getList (type) {
				uni.showLoading({ title: '加载中...' })
				if (type) {
					this.params.first++
				} else {
					this.params.first = 1
					this.order = []
				}
				let params = Object.assign({}, this.params)
				if (this.params.type === -2) params.type = ''
				getOrder(params).then(res => {
					uni.hideLoading()
					this.loaded = true
					let list = res.data.map(item => {
						let list = []
						for(let i in item.cartInfo) list.push(item.cartInfo[i])
						item.cartInfo = list
						// let date = new Date(+item.add_time)
						// let Y = date.getFullYear() + '-';
						// let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
						// let D = date.getDate() + ' ';
						// let h = date.getHours() + ':';
						// let m = date.getMinutes() + ':';
						// let s = date.getSeconds();
						// item.add_time = Y+M+D+h+m+s
						item.status = +item.status
						item.status_name = item._status._title //this.list.filter(x => x.type === item.status)[0].name
						return item
					})
					this.order = [...this.order, ...list]
					if (!res.data.length && this.params.first !== 1) {
						uni.showToast({
							title: '没有更多数据了',
							icon: 'none'
						})
					}
				})
			}			
		}
	}
</script>

<style lang="less">
	page, .olx {
		height: 100%;
		overflow: hidden;
	}
.list {
	.item {
		margin-top: 20upx;
		.pro {
			image {
				width: 170upx;
				height: 170upx;
			}
		}
		.btn {
			button {
				&:not(:last-of-type) {
					margin-right: 20upx;
				}
			}
		}		
	}
}
</style>
