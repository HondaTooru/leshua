<template>
<view class="newAddress">
	<cu-custom bgColor="bg-gradual-red" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">{{ title }}</block>
	</cu-custom>
	<view>
		<form  @submit="opreate">
			<view class="line">
				<view class="title">联系人</view>
				<view>
					<view class="solid-bottom">
						<text>姓名</text>
						<input type="text" name="name" v-model="im.real_name" placeholder="请填写收货人的姓名"/>
					</view>
					<view>
						<text>手机号码</text>
						<input type="digit" name="phone" v-model="im.phone" placeholder="请填写收货人的手机号码"/>
					</view>
				</view>
			</view>
			<view class="line">
				<view class="title">收货地址</view>
				<view>
					<view class="solid-bottom">
						<text>所在地区</text>
						<view>
							<!-- #ifdef MP-WEIXIN -->
								<picker mode="region" :value="location" name="location" @change="selectCity">
									<view class="text-df">
									{{ location.length ? im.province +' - '+im.city+' - '+im.district : '请选择地址' }}
									</view>
								</picker>					
							<!-- #endif -->
							<!-- #ifndef MP-WEIXIN -->
							<view @click="showMulLinkageThreePicker" class="text-df">{{ location.length ? im.location_p +'-'+im.city+'-'+im.district : '请选择地址' }}</view>
							<!-- #endif -->						
						</view>
					</view>
					<view class="solid-bottom">
						<text>详细地址</text>
						<input type="text" name="address" v-model="im.detail" placeholder="请填写收货人的详细地址"/>
					</view>
					<view>
						<text>邮政编码</text>
						<input type="text" name="post_code" v-model="im.post_code" placeholder="请填写邮政编码"/>
					</view>					
				</view>
			</view>
			<view class="set" @tap="im.is_default ? im.is_default = 0 : im.is_default = 1">
				<view>
					<view>设置默认地址</view>
					<view>
						<radio-group>
							<view>
								<radio :class="['red', { checked: im.is_default }]" :checked="im.is_default ? true : false" />
							</view>
						</radio-group>				
					</view>			
				</view>
			</view>
			<view class="btn">
				<button type="warn" formType="submit">提交</button>
			</view>												
		</form>
	</view>
	<!-- #ifndef MP-WEIXIN -->
	<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
	@onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	<!-- #endif -->	
</view>	
</template>

<script>
	import graceChecker from '@/utils/graceChecker'
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker'
	import { editUserAddr } from '@/api'
	import { mapGetters } from 'vuex'
	export default {
		data () {
			return {
				location: [],
				cityPickerValueDefault: [0,0,0],
				themeColor: '#007AFF',
				id: '',
				im: {
					real_name: '',
					is_default: 0,
					post_code: '',
					phone: '',
					province: '',
					city: '',
					district: '',
					post_code: '',
					detail: ''
				}
			}
		},
		watch: {
			getAdress (val ,oldval) {
				if (val.length) {
					this.location = [val.province, val.city, val.district]
					this.im = val[0]
				}
			} 
		},
		onLoad(options) {
			if (options.id !== void 0) this.id = options.id
		},
		computed: {
			...mapGetters(['addressList']),
			getAdress () {
				return this.addressList.filter(item => item.id === this.id)
			},
			title () {
				return this.id ? '编辑地址' : '新增地址'
			}
		},
		methods: {
			// #ifdef MP-WEIXIN
			selectCity (e) {
				this.location = e.detail.value
				this.im.province = e.detail.value[0]
				this.im.city = e.detail.value[1]
				this.im.district = e.detail.value[2]
			},
			// #endif			
			// #ifndef MP-WEIXIN
            showMulLinkageThreePicker() {
				uni.hideKeyboard()
                this.$refs.mpvueCityPicker.show()
            },
			onCancel (e) {
				console.log(e)
			},
            onConfirm(e) {
				const value = e.label.split('-')
				this.location = value
				this.cityPickerValueDefault = e.value
				this.im.location_p = value[0]
				this.im.location_c = value[1]
				this.im.location_a = value[2]				
            },		
			// #endif
			opreate (e) {
				const rules = [
					{ name : "name", checkType : "notunll", errorMsg:"请输入姓名"},
					{ name: 'phone', checkType : 'phoneno', errorMsg:"请输入正确的手机号码" },
					// #ifdef MP-WEIXIN
					{ name: 'location', checkType: 'notnull', errorMsg: '请选择地址' },
					// #endif					
					{ name: 'address', checkType: 'notnull', errorMsg: '请输入详细地址' },
				]
				const formatData = e.detail.value
				const result = graceChecker.check(formatData, rules)
				if (result) {
					uni.showLoading({ mask: true, title: '请稍后' })
					const params = this.id ? Object.assign({}, this.im, { id: this.id }) : this.im
					const content = this.id ? '编辑成功' : '新增成功'
					editUserAddr(params).then(res => {
						uni.hideLoading()
						uni.showModal({
							content,
							showCancel: false,
							success: rst => {
								if (rst.confirm) {
									this.id ? '' : this.$store.dispatch('getAddress')
									uni.navigateBack()
								}
							}
						})
					})
				} else {
					uni.showToast({ title: graceChecker.error, icon: "none" })
				}
			}						
		},
		components: {
			mpvueCityPicker
		}
	}
</script>

<style lang="less">
.newAddress {
	.line {
		.title {
			height: 80upx;
			display: flex;
			align-items: center;
			padding: 0 15upx;
			& + view {
				padding: 0 15upx;
				background-color:white;
				& > view {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 20upx 0;
					position: relative;
					&:last-of-type {
						&::after {
							display: none;
						}
					}
					& > text { width: 120upx;text-align: justify;text-align-last:justify;padding-right: 30upx; }
					& > view { flex: 1;padding: 5upx 0; font-size:20upx; color:var(--gray)}
					& > input { flex: 1;}
					& > picker { font-size: 20upx}
				}
			}
		}
	}
	.set {
		& > view {
			display: flex;
			justify-content: space-between;
			margin-top: 20upx;
			background:white;
			padding:20upx 10px;
		}
	}
	.btn {
		margin: 60upx 15px 0;
	}	
}
</style>
