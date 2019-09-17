<template>
<view>
	<cu-custom bgColor="bg-gradual-red" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">我的优惠券</block>
	</cu-custom>
	<view class="list">
		<view class="item flex margin-bottom-sm flex-direction" v-for="(item, i) in list" :key="i">
			<!-- <image src="/static/use.png" class="state"></image> -->
			<view class="solid-dash flex-sub text-white padding-left-sm flex justify-between">
				<view>
					<view class="text-black margin-top-sm margin-left-sm text-left">优惠券描述</view>
					<view class="text-sm text-gray margin-left-sm margin-top-sm text-left">有效期  {{ item._add_time }} - {{ item._end_time }}</view>					
				</view>
				<view class="margin-top-xl margin-right-xl"><button class="cu-btn bg-white sm shadow" @tap="getCxx(item)">使用</button></view>
			</view>
			<view class="coupon-get flex justify-end align-center padding-right-lg padding-left-lg">
				<navigator url="" hover-class="none" class="text-cyan">查看可用商品
				<text class="cuIcon-right margin-left-xs"></text>
				</navigator>
			</view>
		</view>
	</view>	
</view>	
</template>

<script>
	import { getUseCoupon, getCoupon } from '@/api'
	export default {
		data () {
			return {
				list: []
			}
		},
		onLoad () {
			this.getList()
		},
		methods: {
			getCxx (item) {
				uni.showLoading({ title: '领取中', mask: true })
				getCoupon({ couponId: item.id }).then(res => {
					uni.hideLoading()
					uni.showModal({
						content: res.msg,
						showCancel: false
					})
				})
			},			
			getList () {
				uni.showLoading({ mask: true, title: '加载中' })
				getUseCoupon().then(res => {
					uni.hideLoading()
					this.list = res.data.map(item => {
						if (!item._add_time) {
							item._add_time = '无限期'
							item._end_time = ''
						}
						return item
					})
				})
			}
		}
	}
</script>

<style lang="less">
.list {
	padding: 15upx 20upx;
	.item {
		height: 220upx;
		position: relative;
		background-color: white;
		.solid-dash {
			border-bottom:2upx dashed #f9f9f9
		}
		&::after, &::before {
			content: '';
			position: absolute;
			top: 0;
			height: 100%;
			width: 28upx;
			background-image: radial-gradient(#f1f1f1 0, #f1f1f1 8upx, transparent 8upx);
			background-size: 28upx 28upx;
			background-position: 0 4upx;
			background-repeat: repeat-y;
			z-index: 1;
			}
		&::after {
			left: -12upx;
		}	
		&::before {
			right: -12upx;
		}
		.coupon-get {
			height: 70upx;
		}
		.state {
			position: absolute;
			width: 100upx;
			top: 10upx;
			right: 20upx;
			height: 100upx;
		}
	}
}		
</style>
