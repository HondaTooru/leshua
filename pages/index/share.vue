<template>
	<view class="shax">
		<cu-custom bgColor="bg-gradual-red">
			<block slot="content">会员入驻</block>
		</cu-custom>
		<form @submit="submit">
			<view class="cu-form-group">
				<view class="title">会员名称</view>
				<input type="text" v-model="params.name" name="shop_name" placeholder="请输入会员名称">
			</view>
			<view class="cu-form-group">
				<view class="title">主营项目</view>
				<input type="text" v-model="params.type" name="shop_model" placeholder="请输入会员主营项目">
			</view>
			<view class="cu-form-group align-start" v-if="!show">
				<view class="title">简单介绍</view>
				<textarea placeholder="请输入介绍"  v-model="params.introduce" name="shop_jiesao"></textarea>
			</view>	
			<view class="cu-form-group">
				<view class="title">联系人</view>
				<input name="shop_people" v-model="params.contact" placeholder="请输入联系人">
			</view>	
			<view class="cu-form-group">
				<view class="title">手机号码</view>
				<input name="shop_tel" v-model="params.phone" placeholder="请输入手机号码">
			</view>
			<view class="cu-bar bg-white margin-top">
				<view class="action">上传营业执照</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
					 <image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<1">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="flex align-center">
				<checkbox :class="{ checked: isReady }" class="red" :checked="isReady ? true : false" @tap="isReady = !isReady"></checkbox>
				<view class="margin-left-sm">我已同意并了解了<text class="text-red" @tap="show = true">《入住申请协议》</text></view>					
				</view>
			</view>
		    <view class="cu-form-group">
				<button class="cu-btn bg-red" form-type="submit">立即申请入驻</button>
			</view>
		</form>
		<alert-text :show="show" :source="text" @on-close="show = false"></alert-text>
	</view>
</template>

<script>
	import graceChecker from '@/common/graceChecker'
	import AlertText from '@/components/richtext'
	import { Bugrade, vipData } from '@/api'
	export default {
		data () {
			return {
				show: false,
				imgList: [],
				text: '',
				isReady: false,
				params: {
					name: '',
					type: '',
					introduce: '',
					contact: '',
					phone: '',
					license: ''
				}
			}
		},
		created () {
			this.getDetails()
		},
		components: { AlertText },
		methods: {
			getDetails () {
				Bugrade().then(res => {
					this.text = `<img src="${res.msg}" width="100%">`
				})
			},
			ViewImage (e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				})				
			},
			ChooseImage() {
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				});
			},
			uploadImg () {
				return new Promise((resolve, reject) => {
					const openid = uni.getStorageSync('openid')
					uni.uploadFile({
						url: 'https://clob.bjhg168.com/routine/Auth_api/upload',
						filePath: this.imgList[0],
						name: 'filename',
						formData: {
							openid
						},
						success: files => {
							let result = JSON.parse(files.data)
							resolve(result.data.url)
						}
					})						
				})
			},			
			DelImg(e) {
				uni.showModal({
					content: '确定要删除吗？',
					cancelText: '再看看',
					confirmText: '再见',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
							this.params.license = ''
						}
					}
				})
			},
			async submit (e) {
				const rule = [
					{ name: 'shop_name', checkType:'notnull', errorMsg: '请输入会员名称' },
					{ name: 'shop_model', checkType:'notnull', errorMsg: '请输入主营项目' },
					{ name: 'shop_jiesao', checkType:'notnull', errorMsg: '请输入简单介绍' },
					{ name: 'shop_people', checkType:'notnull', errorMsg: '请输入联系人' },
					{ name: 'shop_tel', checkType:'phoneno', errorMsg: '请输入正确的联系方式' }
				]
				const formData = e.detail.value
				const checkRes = graceChecker.check(formData, rule)
				if (checkRes) {
					console.log(this.isReady)
					if (this.imgList.length) {
						if (this.isReady) {
							uni.showLoading({ title: '请稍后', mask: true })
							const img = await this.uploadImg()
							this.params.license = img
							vipData(this.params).then(res => {
								uni.hideLoading()
								uni.requestPayment({
									provider: 'wxpay',
									...res.data.result.jsConfig,
									success: rst => {
										this.params = { 
											name: '',
											type: '',
											introduce: '',
											contact: '',
											phone: '',
											license: '',
										}
									}
								})								
							})
						} else {
							uni.showToast({
								title: '请阅读申请协议',
								icon: 'none'
							})							
						}
					} else {
						uni.showToast({
							title: '请上传营业执照',
							icon: 'none'
						})
					}
					
				} else {
					uni.showToast({ title: graceChecker.error, icon: "none" })
				}
			}			
		}
	}
</script>