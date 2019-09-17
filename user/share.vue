<template>
	<view>
		<cu-custom bgColor="bg-gradual-red" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">我的分享</block>
		</cu-custom>		
		<cu-head>
			<userAuth v-if="!userInfo"></userAuth>
			<view class="cu-avatar xl round bg-white" :style="{backgroundImage:'url('+avatar+')'}">
				<text class="avatar-text" v-if="!userInfo">LOGIN</text>
			</view>
			<view class="text-df padding-top-xl padding-bottom-xs">我的等级：{{ userInfo.member_card || '暂无等级' }}</view>
			<view class="text-df"><text class="cuIcon-share padding-right-xs"></text> 分享《派送宝》小程序可获得推广收益</view>			
		</cu-head>
		<view class="list bg-white">
			<userAuth v-if="!userInfo"></userAuth>
			<view class="item padding-sm solid-bottom flex align-center" @tap="share">
				<view class="flex-sub">
					<view class="text-df">二维码图片分享</view>
					<view class="text-xs padding-top-xs">自动生成设计号的图片携带个人二维码推广</view>
				</view>
				<view>
					<image src="/static/code.png"></image>
				</view>
			</view>
			<button open-type="share" class="share item flex align-center bg-white cu-btn">
				<view class="flex-sub text-left">
					<view class="text-df">链接分享</view>
					<view class="text-xs padding-top-xs">自动生成设计号的图片携带个人二维码推广</view>
				</view>
				<view>
					<image src="/static/link.png"></image>
				</view>						
			</button>					
		</view>
		<view class="cu-modal" :class="modalName=='Image'?'show':''">
			<view class="cu-dialog">
				<view class="img">
					<image src="/static/share_bg.png" class="bg"></image>
					<image :src="CODE" class="code"></image>
				</view>
				<view class="cuIcon-close text-white close" @tap="modalName = null"></view>
			</view>
		</view>			
	</view>
</template>

<script>
	import cuHead from '@/components/head.vue'
	import { mapGetters } from 'vuex'
	import { GetCode } from '@/api'
	export default {
		components: {
			cuHead
		},
		onShareAppMessage() {
			return {
				title: '快来加入派送宝领取更多福利吧！',
				path: `/pages/index/index?scene=${this.userInfo.uid}`,
			}
		},
		onLoad (query) {
			this.scene =decodeURIComponent(query.scene)
			this.scene = this.scene == 'undefined' ? '' : this.scene
			const data={
				query:JSON.stringify(query),
				scene: this.scene
			}
			Scened(data).then(res => {})
			this.$store.commit('SET_SPID', this.scene)
		},		
		computed: {
			...mapGetters(['userInfo']),
			avatar () {
				let AVATAR = this.userInfo ? this.userInfo.avatar : ''
				return AVATAR
			}
		},
		data () {
			return {
				show: false,
				modalName: null,
				CODE: '',
				scene: ''
			}
		},
		methods: {			
			share () {
				uni.showLoading({ title: '加载中', mask: true })				
				GetCode().then(res => {
					uni.hideLoading()
					this.modalName = 'Image'
					this.CODE = res.msg
				})
			}
		}
	}
</script>

<style lang="less">
.list {
	position: relative;
	.item {
		image {
			display: block;
			width: 120upx;
			height: 120upx;
		}
		&.share {
			height: auto;
			padding: 20upx !important;
		}
	}
}
.close {
	position: absolute;
	top: 10upx;
	right: 10upx;
	font-size: 36upx;
	z-index: 33;
}
.bg {
    height:82vh;
	width: 100%;
	position: relative;
	z-index: 11;
}
.code {
	position: absolute;
	width: 300upx;
	height: 300upx;
	z-index: 66;
	bottom: 75upx;
	left: 50%;
	transform: translate3d(-50%,0,0);
}
</style>
