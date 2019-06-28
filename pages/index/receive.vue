<template>
	<view>
		<cu-head>
			<image src="/static/recive.png" class="img" style="height: 150upx; width: 150upx;"></image>
			<view class="text-df padding-bottom-xs">总金额</view>
			<view class="text-xxl text-bold">{{ userInfo.now_money || '0.00' }}</view>			
		</cu-head>
		<view class="padding-sm bg-white shadow-lg">
			<view class="flex align-center justify-between">
				<view>派送员榜单</view>
				<view class="cu-avatar-group">
					<view class="cu-avatar round lg" v-for="(item,index) in pList" :key="index" :style="[{ backgroundImage:'url(' + item.avatar + ')' }]"></view>
				</view>				
			</view>
		</view>
		<view class="flex bg-white justify-center align-center margin-top-sm padding-bottom-sm padding-top-sm radius margin-left-sm margin-right-sm">
			<navigator hover-class="none" :url="'/pages/index/cardlist?title=全部&type=0'" class="flex-sub text-center padding-top-sm padding-bottom-sm solid-right">
				<view>全部</view>
				<view class="padding-top-sm text-bold text-black">{{ card.whole }}</view>
			</navigator>
			<navigator hover-class="none" :url="'/pages/index/cardlist?title=粉丝&type=1'" class="flex-sub text-center padding-top-sm padding-bottom-sm solid-right">
				<view>粉丝</view>
				<view class="padding-top-sm text-bold text-black">{{ card.fans }}</view>
			</navigator>
			<navigator hover-class="none" :url="'/pages/index/cardlist?title=V1派送员&type=2'" class="flex-sub text-center padding-top-sm padding-bottom-sm solid-right">
				<view>V1派送员</view>
				<view hover-class="none" class="padding-top-sm text-bold text-black">{{card.class_a }}</view>
			</navigator>
			<navigator hover-class="none" :url="'/pages/index/cardlist?title=V2派送员&type=3'" class="flex-sub text-center padding-top-sm padding-bottom-sm solid-right">
				<view>V2派送员</view>
				<view class="padding-top-sm text-bold text-black">{{ card.class_b }}</view>
			</navigator>
			<navigator hover-class="none" :url="'/pages/index/cardlist?title=V3派送员&type=4'" class="flex-sub text-center padding-top-sm padding-bottom-sm">
				<view>V3派送员</view>
				<view class="padding-top-sm text-bold text-black">{{ card.class_c }}</view>
			</navigator>									
		</view>
		<view @tap="share" class="flex flex-direction margin-left-sm margin-right-sm margin-top-xl">
			<button class="cu-btn lg bg-red"><text class="cuIcon-forwardfill"></text>查看升级通道介绍</button>
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
	import cuHead from '@/components/head.vue'
	import { getCard } from '@/api'
	import { mapGetters } from 'vuex'
	export default {
		data () {
			return {
				show: false,
				card: {
					whole: 0,
					fans: 0,
					class_a: 0,
					class_b: 0,
					class_c: 0,
				},
				pList: [],
				avatar: [],
				modalName:'',
				upgrade:'',
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		created () {
			if (!this.userInfo) {
				setTimeout(() => {
					this.show = true
				}, 1500)
			} else {
				this.getList()
			}
		},
		methods: {
			async getInfo (e) {
				if (e.detail.errMsg === 'getUserInfo:ok') {
					await this.$store.dispatch('wxAuth', e)
					this.getList()
				} else {
					uni.showModal({
						content: '授权失败',
						showCancel: false
					})
				}
			},			
			getList () {
				uni.showLoading({ title: '加载中' })
				getCard().then(res => {
					uni.hideLoading()
					this.card = res.data.card
					this.upgrade=res.data.upgrade
					this.pList = res.data.p_list
					this.show = false
				})
			},
			share () {
				uni.navigateTo({
					url: '/pages/index/upgrade?imgsrc='+this.upgrade
				})
			}
		},
		components: { cuHead }
	}
</script>

<style lang="less">
</style>
