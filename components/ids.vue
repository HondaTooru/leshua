<template>
	<view class="cu-modal" :class="{ show }">
		<view class="cu-dialog">
			<view class="cu-bar bg-white justify-end">
				<view class="content">请输入上级ID</view>
				<view class="action" @tap="$emit('on-close')">
					<text class="cuIcon-close text-red"></text>
				</view>
			</view>
			<view class="padding-xl">
				<form @submit="submit">
					<view class="cu-form-group">
						<input type="text" value="" v-model="spread_uid"  placeholder="请输入上级ID" />
					</view>
					<view class="cu-form-group">
						<button class="cu-btn bg-red sm shadow" form-type="submit">确定</button>
						<button class="cu-btn bg-cyan sm shadow" @tap="$emit('on-close')">取消</button>
					</view>
				</form>
			</view>
		</view>
	</view>	
</template>

<script>
	import { IsBinding } from '@/api'
	export default {
		data () {
			return {
				spread_uid: ''
			}
		},
		props:{
			show: {
				type: Boolean,
				default: false
			}
		},
		methods:{
			submit () {
				if (this.spread_uid.trim()) {
					uni.showLoading({ mask: true })
					IsBinding({ spread_uid: this.spread_uid }).then(res => {
						uni.hideLoading()
						console.log(res)
						if (res.msg === '绑定成功') {
							const user = uni.getStorageSync('O_USER')
							uni.setStorageSync('USER', user)
							this.$store.commit('SET_USERINFO', user)
							this.$emit('on-close')
							uni.showToast({
								title: res.msg
							})
						} else {
							uni.showModal({
								content: res.msg,
								showCancel: false
							})
						}
					})
				}
			}			
		}
	}
</script>

<style>
</style>
