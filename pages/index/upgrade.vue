<template>
	<view>
		<cu-custom bgColor="bg-gradual-red" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">升级通道介绍</block>
		</cu-custom>
		<image :src="upgrade" class="response block" mode="widthFix"></image>
	</view>
</template>
	<style>
		.up{
			display: flex;
		}
	</style>
	<script>
		export default {
			data() {
				return {
					upgrade: '',
				}
			},
			onLoad (e) {
				console.log(e)
				this.upgrade=e.imgsrc
				console.log(this.upgrade)
			},
		}
	</script>