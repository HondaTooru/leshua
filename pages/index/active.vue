<template>
<view>
	<cu-custom bgColor="bg-gradual-red" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">激活派送员</block>
	</cu-custom>
	<form @submit="active">
		<view class="cu-bar bg-white">
			<view class="action">
				图片上传
			</view>
			<view class="action">
				{{imgList.length}}/1
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
				 <image :src="imgList[index]" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseImage" v-if="imgList.length < 1">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
		<!-- <view class="cu-form-group">
			<view class="title">姓名</view>
			<input placeholder="请输入您的姓名" name="name" v-model="params.name"></input>
		</view>	
		<view class="cu-form-group">
			<view class="title">身份证</view>
			<input placeholder="请输入您的身份证" name="card" v-model="params.card"></input>
		</view>	
		<view class="cu-form-group">
			<view class="title">银行卡号</view>
			<input placeholder="请输入您的银行卡号" name="bank_card" v-model="params.bank_card"></input>
		</view>	
		<view class="cu-form-group">
			<view class="title">订单号</view>
			<input placeholder="请输入您的订单号后六位" name="number" v-model="params.number"></input>
		</view>-->
		<view class="cu-form-group">
			<view class="title">联系电话</view>
			<input placeholder="请输入您的联系电话" name="userPhone" v-model="params.user_phone"></input>
		</view> 
		<view class="cu-form-group" v-if="!show">
			<textarea maxlength="-1" name="common" placeholder="留言评论" v-model="params.common"></textarea>
		</view>		
		<view class="cu-form-group">
			<button class="cu-btn round bg-gradual-red"  @tap="showRule">派送员激活说明</button>
		</view>	
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-red margin-tb-sm lg" form-type="submit">立即激活</button>
		</view>
	</form>
	<view class="cu-modal" :class="{ show: show }">
		<view class="cu-dialog">
			<view class="cu-bar bg-white justify-end">
				<view class="content">派送员激活说明</view>
				<view class="action" @tap="show = false">
					<text class="cuIcon-close text-red"></text>
				</view>
			</view>
			<view class="padding-xl" style="text-align: left;">
				<rich-text :nodes="rule"></rich-text>
			</view>
		</view>
	</view>		
</view>
</template>

<script>
	import { upload, SubMitApply, rulesd } from '@/api'
	import graceChecker from '@/common/graceChecker'
	export default {
		name: 'active',
		data () {
			return {
				show: true,
				imgList: [],
				params: {
					common: '',
					// name: '',
					//card: '',
					//bank_card: '',
					imgsrc: '',
					user_phone: '',
					number:'',
				},
				rule:'',
			}
		},
		created() {
			rulesd().then(res => {
				this.rule = res.data.rule
			})
		},
		methods: {
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			showRule () {
				this.show = true
				// uni.showLoading({ mask: true })
				// rulesd().then(res => {
				// 	uni.hideLoading()
				// 	this.rule = res.data.rule
				// 	this.show = true
				// })
			},
			ChooseImage() {
				uni.chooseImage({
					count: 1, //默认9
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
			DelImg(e) {
				uni.showModal({
					content: '确定要删除吗？',
					cancelText: '再看看',
					confirmText: '再见',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
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
			apply () {
				return new Promise((resolve, reject) => {
					SubMitApply(this.params).then(res => {
						resolve()
						uni.showModal({
							content: res.msg,
							showCancel: false,
							success: rst => {
								uni.navigateBack()
							}
						})
					})
				})
			},
			async active (e) {
				const rule = [
					// { name: 'name', checkType:'notnull', errorMsg: '请输入您的姓名' },
					// { name: 'card', checkType:'notnull', errorMsg: '请输入您的身份证' },
					// { name: 'bank_card', checkType:'notnull', errorMsg: '请输入正确您的银行卡号' },
					// { name: 'number', checkType:'notnull', errorMsg: '请输入您的编号' },
					{ name: 'userPhone', checkType:'phoneno', errorMsg: '请输入正确的手机号码' },
				]
				const formData = e.detail.value
				const checkRes = graceChecker.check(formData, rule)
				if (this.imgList.length) {
					if (checkRes) {
						uni.showLoading({ mask: true, title: '加载中...' })
						this.params.imgsrc = await this.uploadImg()
						await this.apply()
						uni.hideLoading()
						
					} else {
						uni.showToast({ title: graceChecker.error, icon: "none" })
					}					
				} else {
					uni.showToast({ title: '请选择图片', icon: "none" })
				}
			}			
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}	
</style>
