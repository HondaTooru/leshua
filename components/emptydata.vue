<template>
	<view class="emptydata" :style="{ backgroundColor: color }" @touchmove.stop.prevent="noEvent">
		 <view class="flex justify-center flex-direction align-center">
			 <image :src="src"></image>
			 <view :class="fontColor"><slot>什么也没有~</slot></view>
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
			fontColor: {
				type: String,
				default: 'text-gray'
			}
		},
		methods: {
			noEvent () {
				// 废弃
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
