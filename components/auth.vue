<template>
	<view class="auth">
		<button class="cu-btn bg-transparent" hover-class="none" open-type="getUserInfo" @getuserinfo="getInfo"></button>
	</view>
</template>

<script>
	export default {
		methods: {
			getInfo (e) {
				if (e.detail.errMsg === 'getUserInfo:ok') {
					this.$store.dispatch('wxAuth', e)
				} else {
					uni.showModal({
						content: '授权失败',
						showCancel: false
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.auth {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
		button {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			padding: 0;
		}
		
	}
</style>
