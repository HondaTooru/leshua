<template>
	<view class="cu-bar tabbar">
		<view v-for="(m, index) in tabBar" @tap="change(m, index)" :key="index" :class="['action', m.checked ? 'text-red' : 'text-black', m.icon === 'goodsnew' ? 'add-action' : '']">
			<view v-if="m.icon !== 'goodsnew'" :class="m.checked ? 'cuIcon-' + m.act : 'cuIcon-' + m.icon"></view>
			<button class="cu-btn cuIcon-goodsnew bg-red shadow" v-else></button>
			{{ m.name }}
		</view>
	</view>	
</template>

<script>
	export default {
		data () {
			return {
				tabBar: [
					{ name: '首页', icon: 'home', act: 'homefill', checked: true },
					{ name: '礼品', icon: 'similar', act: 'similar', checked: false },
					{ name: '收益', icon: 'goodsnew', act: 'goodsnewfill', checked: false },
					{ name: '分享', icon: 'share', act: 'share', checked: false },
					{ name: '我的', icon: 'my', act: 'myfill', checked: false },
				]				
			}
		},
		destroyed() {
			this.$off('change')
		},
		created() {
			uni.$on('change', res => {
				this.tabBar.forEach(k => { k.checked = false })
				this.tabBar[res].checked = true
				this.$emit('on-change', res)
			})
		},
		
		methods: {
			change(item, index) {
				this.tabBar.forEach(k => { k.checked = false })
				item.checked = true
				this.$emit('on-change', index)
			}			
		}
	}
</script>

<style lang="less">
	.cu-bar {
		position: fixed;
		bottom: 0;
		width: 100%;
		left: 0;
		background-color:#f8f8f9;
		z-index: 9999
	}	
</style>
