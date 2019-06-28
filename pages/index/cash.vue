<template>
<view>
	<cu-custom bgColor="bg-gradual-red" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">零钱提现</block>
	</cu-custom>
	<view>
		<form @submit="submit">
			<view class="cu-form-group">
				<view class="title">可用金额</view>
				<input placeholder="请输入提现金额" disabled v-model="userInfo.now_money" name="input"></input>
			</view>			
			<view class="cu-form-group">
				<view class="title">提现金额</view>
				<input placeholder="请输入提现金额" name="money" v-model="params.money"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">提现用户</view>
				<input placeholder="请输入提现用户的名称" name="name" v-model="params.name"></input>
			</view>
		<!-- 	<view class="cu-form-group">
				<view class="title">提现手机号</view>
				<input placeholder="请输入提现手机号" name="weixin" v-model="params.weixin"></input>
			</view> -->
			<view class="cu-form-group">
				<view class="title">支付宝账号</view>
				<input placeholder="请输入支付宝账号" name="alipay_code" v-model="params.alipay_code"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">身份证</view>
				<input placeholder="请输入身份证" name="Idcard" v-model="params.Idcard"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">银行卡</view>
				<input placeholder="请输入银行卡" name="bank_code" v-model="params.bank_code"></input>
			</view>
			<view class="padding-sm flex flex-direction">
				<button class="cu-btn bg-red lg" form-type="submit">确认提现</button>
			</view>
		</form>
	</view>
</view>	
</template>

<script>
	import { mapGetters } from 'vuex'
	import { UserExtract } from '@/api'
	import graceChecker from '@/common/graceChecker'
	export default {
		name: 'cash',
		data () {
			return {
				params: {
					extract_type: 'alipay',
					money: '',
					name: '',
					weixin: '',
					Idcard:'',
					bank_code:'',
					alipay_code:''
				}
			}
		},
		methods: {
			submit (e) {
				const rule = [
					{ name: 'name', checkType: 'notnull', errorMsg: '请输入提现用户名' },
					// { name: 'weixin', checkType: 'phoneno', errorMsg: '请输入正确的手机号' }
				]
				const formData = e.detail.value
				const checkRes = graceChecker.check(formData, rule)
				if (+this.params.money <= +this.userInfo.now_money && +this.params.money > 0) {
					if (checkRes) {
						uni.showLoading({ mask: true, title:'请稍后...' })
						UserExtract(this.params).then(res => {
							uni.hideLoading()
							if (res.code === 200) {
								this.$store.commit('SET_MONEY', -+this.params.money)
								uni.showModal({
									content: res.msg,
									showCancel: false,
									success: rst => {
										if (rst.confirm) {
											uni.navigateBack()
										}
									}
								})
							} else {
								uni.showToast({
									icon: 'none',
									title: res.msg
								})
							}
						})
					} else {
						uni.showToast({ title: graceChecker.error, icon: "none" })
					}					
				} else {
					uni.showToast({ title: '请输入正确的提现金额', icon: "none" })
				} 
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		}
	}
</script>

<style>
</style>
