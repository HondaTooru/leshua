<template>
<view class="head flex justify-between align-center flex-direction text-white bg-gradual-red">
	<slot></slot>
	<view class="wave shadow-blur">
		<image src="/static/wave.gif" class="gif-black response"></image>
	</view>			
</view>	
</template>

<script>
</script>

<style lang="less">
.head {
	position: relative;
	padding: 200upx 0 100upx;
	overflow: hidden;
	.img {
		width: 150upx;
		height: 150upx;
	}
	.wave {
		position: absolute;
		left: 0;
		width: 100%;
		bottom: 0;
		image {
			height: 120upx;
			display: block;
		}
	}
}	
</style>
