<template>
<view>
	<cu-custom bgColor="bg-gradual-red">
		<block slot="content">派送宝</block>
	</cu-custom>
	<view class="bg-lgrey padding-bottom-xl" v-if="Load">
		<view class="text-bold text-center text-shadow" style="height:200px"><!--title padding-bottom-xl  padding-top-xl padding-left-sm padding-right-sm -->
			<image :src="commiss.slogan" style="height:200px;width:100%"></image>
		</view>
		<view><!-- padding-left-sm padding-right-sm -->
			<view class="radius" style="background:#ffffff"> <!-- bg-lgray padding-xl -->
				<navigator hover-class="none" :url="'/pages/index/prodetail?id='+item.id" v-for="(item, index) in benefit" :key="index">
				<image :src="item.image" class="response radius block" style="height: 636upx;"></image>
				<!-- <view class="text-center padding-top-sm padding-bottom-sm text-black">价值<text class="text-red text-bold">{{ item.ot_price }}</text>{{ item.store_name }} </view>	-->				
				</navigator>
				<swiper :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000" style="height: 710upx;">
					<swiper-item v-for="(item, index) in give" :key="index">
						<navigator hover-class="none" :url="'/pages/index/prodetail?id='+item.id">
						<view class="bg-white">
						<image :src="item.image" style="height:710upx;" class="response siy-radius block"></image>
						</view>
						</navigator>					
					</swiper-item>
				</swiper>
				<view class="flex flex-direction "><!-- btn -->
					<userAuth v-if="!userInfo"></userAuth>
					<image src='/static/button.jpg' style="height:70px;margin:auto;width:230px;margin-top:15px;" @tap="toActive"></image>
				</view>	
			</view>
		</view>
		<view style="background: #ffffff;">
			 <view class="title text-df flex justify-center padding-top-sm">
				<image src='/static/tiaohen.jpg' style="height:70px;margin:auto;width:230px;"></image>
			</view>
		</view>	
	
		<view class="bg-white sw">
			<view class="wave bg-white shadow-blur" style="background: #ffffff;">
				<image src="/static/wave.gif" class="gif-black response"></image>
			</view>
			<view class="title text-df flex justify-center padding-top-sm">
				<text class="line text-black">其他豪品</text>
			</view>
			<swiper :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item, idx) in best" :key="idx">
					<view class="flex margin-left-sm margin-right-sm margin-top-xl padding-bottom-xl" style="height: 280upx;">
						<navigator hover-class="none" :url="'/pages/index/prodetail?id='+son.id" class="flex-sub item" v-for="(son, i) in item" :key="i"><image :src="son.image" class="response xh"></image></navigator>
					</view>
				</swiper-item>			
			</swiper>
			<view class="text-red text-center padding-top-sm" @tap="change">更多福利点击这里>></view>
		</view>
	</view>
	<view class="cu-modal" :class="{ show }">
		<view class="cu-dialog bg-white">
			<view class="cu-bar justify-center">微信授权</view>
			<view class="padding text-left solid-bottom solid-top">
				派送宝 为了给你提供更好的服务，需要向你申请权限
			</view>
			<view class="padding-sm text-left text-gray solid-bottom">
				获取你的公开信息（昵称，头像，地区及性别）
			</view>
			<view class="flex justify-end">
				<view class="padding-xs">
					<button class="cu-btn bg-white" @tap="show = false">拒绝</button>
					<button class="cu-btn bg-white text-green" open-type="getUserInfo" @getuserinfo="getInfo">允许</button>
				</view>
			</view>
		</view>
	</view>		
</view>
</template>

<script>
	import { BindIndex } from '@/api'
	import { mapGetters } from 'vuex'
	export default {
		name: 'Home',		
		data () {
			return {
				show: false,
				benefit: [],
				give: [],
				best: [],
				setup: [],
				commiss: {},
				Load: false
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		created () {
			uni.showLoading({ mask: true, title:'加载中' })
			BindIndex().then(res => {
				uni.hideLoading()
				this.Load = true
				const result = res.data
				let list = []
				let arry = []
				this.benefit = result.benefit
				this.give = result.give
				this.commiss = result.commiss
				this.$store.commit('SET_MODEL', result.setup)
				result.best.forEach((item, index) => {
					arry.push(item)
					if ((index + 1) % 3 === 0) {
						list.push(arry)
						arry =[]
					}
				})
				if (!this.userInfo) {
					setTimeout(() => {
						this.show = true
					}, 1500)
				}
				this.best = list
			})
		},
		methods: {
			getInfo (e) {
				if (e.detail.errMsg === 'getUserInfo:ok') {
					this.$store.dispatch('wxAuth', e)
					this.show = false
				} else {
					uni.showModal({
						content: '授权失败',
						showCancel: false
					})
				}
			},
			toActive () {
				uni.navigateTo({
					url: '/pages/index/active'
				})
			},
			change () {
				uni.$emit('change', 1)
			}
		}
	}
</script>

<style lang="less">
	.title {
		background: linear-gradient(to bottom, #d44a52, #ac1a1f);
		-webkit-background-clip: text;
		color: transparent;
		font-size: 40upx;
		text-align: center;
	}
.bg-lgray {
	background: #f0f1f2;
}
.btn {
	position: relative
}
.sw {
	padding-bottom: 120upx;
	position: relative;
	margin-top: 56upx;
	.wave {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		image {
			position: relative;
			height: 140upx;
			top: -138upx;
		}
	}
}
.xh {
	height: 100%;
}
.item:nth-of-type(2n) {
	margin-right: 20upx;
	margin-left: 20upx;
}
.pos {
	position: relative;
	.bg-round {
		width: 60upx;
		height: 60upx;
		.bg-lgrey;
		position: absolute;
		top: 50%;
		transform: translate3d(0, -50%, 0);
		border-radius: 50%;
		&.left {
			left: -30upx;
		}
		&.right {
			right: -30upx;
		}
	}
	
}

.siy-radius {
	border-top-right-radius: 6upx;
	border-top-left-radius: 6upx;
}
.bty-radius {
	border-bottom-left-radius: 6upx;
	border-bottom-right-radius: 6upx;
}
.bg-siy {
	background: #f8f8f9;
}
.bg-gradual-siy {
	background:linear-gradient(180deg, #e88888, #e54d42);
	color: white;
	margin: 40upx 140upx 20upx;
}
.bg-lgrey {
	background:url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wgARCAACAAIDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQBAQAAAAAAAAAAAAAAAAAAAAP/2gAMAwEAAhADEAAAAF4Uv//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Af//EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oACAEDAQE/AI//2Q==')
}
.line {
	position: relative;
	&::after,&::before {
		position: absolute;
		content: '';		
		background:var(--red);				
	}
	&::after {
		bottom: -14upx;
		height: 6upx;
		width: 100%;
		left: 0;
		border-radius: 50upx;
	}
	&::before {
		height: 10upx;
		width: 10upx;
		border-radius: 50%;
		right: -30upx;
		bottom: -16upx;
	}
}
</style>
