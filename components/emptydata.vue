<template>
	<view class="emptydata" :style="{ backgroundColor: color }" @touchmove.stop.prevent="noEvent">
		 <view class="flex justify-center flex-direction align-center">
			 <image :src="src"></image>
			 <view :class="fontColor" v-if="!type"><slot>什么也没有~</slot></view>
			 <view v-else class="margin-top-xs">
				 <button class="cu-btn bg-red shadow" @tap="getOpenSet">去开启定位</button>
			 </view>
		 </view>
	</view>
</template>

<script>
	export default {
		props: {
			src: {
				type:String,
				default: '/static/nothing.png'
			},
			color: {
				type: String,
				default: 'white'
			},
			type: {
				type: Number,
				default: 0
			},
			fontColor: {
				type: String,
				default: 'text-gray'
			}
		},
		methods: {
			noEvent () {
				// 废弃
			},
			getOpenSet () {
				uni.openSetting()
			}
		}
	}
</script>

<style lang="less" scoped>	
.emptydata {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width:100%;
	position:absolute;
	top: 0;
	left: 0;
	z-index: 88;
	& > view {
		& > image {
			width: 200upx;
			height: 200upx;
		}
		& > view {
			font-size: 20upx;
			text-align: center;
		}
	}
}
</style>
