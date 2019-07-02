<template>
	<view class="home">		
		<view class="page">
			<index-home v-if="current === 0" @on-tab="change"></index-home>
			<index-receive v-if="current === 2"></index-receive>
			<index-share v-if="current === 3"></index-share>
			<index-classify v-if="current === 1"></index-classify>
			<index-mine v-if="current === 4"></index-mine>
		</view>
		<cu-bar @on-change="change"></cu-bar>
	</view>
</template>

<script>
	import indexHome from './home'
	import indexClassify from './classify'
	import indexMine from './mine'
	import indexShare from './share'
	import indexReceive from './receive'
	import cuBar from './tabBar'
	import { Scened } from '@/api'
	import { mapGetters } from 'vuex'
	export default {
		name: 'Index',
		components: { 
			cuBar,
			indexHome,
			indexClassify,
			indexMine,
			indexShare,
			indexReceive
		},
		data() {
			return {
				current: 0,
				scene: ''
			}
		},
		onShareAppMessage() {
			return {
				title: '快来加入派送宝领取更多福利吧！',
				path: `/pages/index/index?scene=${this.userInfo.uid}`,
			}
		},
		// onShow() {
		// 	console.log(this.scene)
		// },
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
			...mapGetters(['userInfo'])
		},		
		methods: {
			change(e) {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				this.current = e
			}
		}
	}
</script>

<style lang="less">
	.page {
		overflow: hidden;		
	}
</style>
