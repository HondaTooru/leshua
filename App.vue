<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
			uni.getSystemInfo({
				success: e => {
					Vue.prototype.loaded = true
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					uni.checkSession({
						success: res => {
							const user = uni.getStorageSync('USER')
							const address = uni.getStorageSync('ADDRESS')
							this.$store.commit('SET_USERINFO', user)
							this.$store.commit('SET_ADDRESSLIST', address)
						},
						fail: err => {
							console.error(err)
							uni.clearStorageSync()
							this.$store.commit('SET_USERINFO', 0)
							this.$store.commit('SET_ADDRESSLIST', [])
						}
					})					
					// #endif		

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "styles/main.css";
	@import "styles/icon.css";
	@import "styles/animation.css";
.bg-transparent {
	background: transparent
}	
</style>
