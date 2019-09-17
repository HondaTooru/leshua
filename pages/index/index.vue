<template>
	<view class="home">		
		<view class="page">
			<index-home v-if="current === 0"></index-home>
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
	import qqMap from '@/utils/qqmap-wx-jssdk.min'
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
		onLoad (query) {
			this.scene = decodeURIComponent(query.scene)
			this.scene = this.scene == 'undefined' ? '' : this.scene
			const data={
				query:JSON.stringify(query),
				scene: this.scene
			}
			Scened(data).then(res => {})
			this.$store.commit('SET_SPID', this.scene)
		},
		computed: {
			...mapGetters(['userInfo', 'address', 'location'])
		},
		onShow () {
			if (!this.location.length) {
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						const qqmapsdk = new qqMap({ key: 'CRZBZ-4MTK6-Z6DSO-MCI7X-LUTGV-73B5X' })
						const latitude = res.latitude
						const longitude = res.longitude
						this.$store.commit('SET_LOCATION', [res.latitude, res.longitude])
						qqmapsdk.reverseGeocoder({
							location: {
								latitude,
								longitude
							},
							success: addr => {
								const address = addr.result.address_component.street_number
								this.$store.commit('SET_ADDRESS', address)
								this.$store.commit('SET_SHOW', false)
							}
						})
						if (!this.userInfo) {
							setTimeout(() => {
								this.show = true
							}, 1500)
						}
					},
					fail: () => {
						uni.showModal({
							content:'附近商家需要您的位置信息来展示',
							confirmText: '去开启',
							success: rst => {
								if (rst.confirm) {
									uni.openSetting({})
								}
							}
						})
					}
				})					
			}
		},
		onReachBottom () {
			uni.$emit('onLoad')
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
