<template>
<view>
	<view class="auth">
		<button class="cu-btn bg-transparent" hover-class="none" open-type="getUserInfo" @getuserinfo="getInfo"></button>
	</view>
	<in-ids :show="show" @on-close="show = false"></in-ids>
</view>	
</template>

<script>
	import { InIds } from '@/components/ids'
	export default {
		data () {
			return {
				show: false
			}
		},
		components: { InIds },
		methods: {
			async getInfo (e) {
				if (e.detail.errMsg === 'getUserInfo:ok') {
					const x = await this.$store.dispatch('wxAuth', e)
					if (!x) {
						this.show = true
					}
				} else {
					// uni.showModal({
					// 	content: '授权失败',
					// 	showCancel: false
					// })
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
		z-index: 99;
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
