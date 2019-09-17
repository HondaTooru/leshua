<template>
	<view class="cu-bar tabbar">
		<block v-if="BarShow">
			<view v-for="(m, index) in tabBar" @tap="change(m, index)" :key="index" :class="['action', m.checked ? 'text-red' : 'text-black', m.icon === 'goodsnew' ? 'add-action' : '']">
				<view v-if="m.icon !== 'goodsnew'" :class="m.checked ? 'cuIcon-' + m.act : 'cuIcon-' + m.icon"></view>
				<button class="cu-btn cuIcon-goodsnew bg-red shadow" v-else></button>
				{{ m.name }}
			</view>			
		</block>
		<block v-else>
			<view :class="['action', m.checked ? 'text-red' : 'text-black']" v-for="(m, index) in listBar" :key="index" @tap="change(m, index)">
				<view :class="m.checked ? 'cuIcon-' + m.act : 'cuIcon-' + m.icon"></view>
				{{ m.name }}
			</view>
		</block>
	</view>	
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data () {
			return {
				tabBar: [
					{ name: '首页', icon: 'home', act: 'homefill', checked: true },
					{ name: '券池', icon: 'shop', act: 'shopfill', checked: false },
					{ name: '收益', icon: 'goodsnew', act: 'goodsnewfill', checked: false },
					{ name: '会员入口', icon: 'pick', act: 'pick', checked: false },
					{ name: '我的', icon: 'my', act: 'myfill', checked: false },
				],
				listBar: [
					{ name: '首页', icon: 'home', act: 'homefill', checked: true },
					{ name: '券池', icon: 'shop', act: 'shopfill', checked: false },
					{ name: '收益', icon: 'goodsnew', act: 'goodsnewfill', checked: false },
					{ name: '我的', icon: 'my', act: 'myfill', checked: false }
				]
			}
		},
		destroyed() {
			this.$off('change')
		},
		computed: {
			...mapGetters(['BarShow'])
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
				let idx = index
				if (this.BarShow) {
					this.tabBar.forEach(k => { k.checked = false })
				} else {
					this.listBar.forEach(k => { k.checked = false })
					if (idx === 3) idx += 1
				}
				item.checked = true
				console.log(idx)
				this.$emit('on-change', idx)
				if (index === 1) this.$store.commit('SET_CID', '')
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
