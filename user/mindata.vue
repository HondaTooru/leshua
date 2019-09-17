<template>
	<view>
		<cu-custom bgColor="bg-gradual-red" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">我的入驻资料</block>
		</cu-custom>
		<form @submit="submit">
			<view class="cu-form-group">
				<view class="title">申请时间</view>
				<input type="text" v-model="params.createtime" disabled name="shop_name" placeholder="请输入会员名称">
			</view>			
			<view class="cu-form-group">
				<view class="title">会员名称</view>
				<input type="text" v-model="params.name" disabled name="shop_name" placeholder="请输入会员名称">
			</view>
			<view class="cu-form-group">
				<view class="title">主营项目</view>
				<input type="text" v-model="params.type" disabled name="shop_model" placeholder="请输入会员主营项目">
			</view>
			<view class="cu-form-group" v-if="!show">
				<view class="title">简单介绍</view>
				<input placeholder="请输入介绍" disabled v-model="params.introduce" name="shop_jiesao">
			</view>	
			<view class="cu-form-group">
				<view class="title">联系人</view>
				<input name="shop_people" v-model="params.contact" disabled placeholder="请输入联系人">
			</view>	
			<view class="cu-form-group">
				<view class="title">手机号码</view>
				<input name="shop_tel" v-model="params.phone" disabled placeholder="请输入手机号码">
			</view>
			<view class="cu-bar bg-white margin-top">
				<view class="action">营业执照</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
					 <image :src="imgList[index]" mode="aspectFill"></image>
<!-- 						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view> -->
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<1">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
		</form>
	</view>
</template>

<script>
	import { setInfo } from '@/api'
	export default {
		name: 'minedata',
		data () {
			return {
				imgList: [],
				params: {
					createtime: '',
					name: '',
					type: '',
					introduce: '',
					contact: '',
					phone: ''
				}
			}
		},
		onLoad () {
			this.getDetails()
		},
		methods: {
			getDetails () {
				uni.showLoading({ title: '加载中' })
				setInfo().then(res => {
					uni.hideLoading()
					this.params = res.data
					if (res.data.license) this.imgList.push(`http://clob.bjhg168.com${res.data.license}`)
				})
			},
			ViewImage (e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				})				
			}			
		}
	}
</script>

<style>
</style>
