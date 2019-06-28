<template>
<view>
	<cu-custom bgColor="bg-gradual-red" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">{{ title }}</block>
	</cu-custom>
	<view>
		<view class="list" v-if="list.length">
			<view class="cu-list menu-avatar">
				<view class="cu-item solid-bottom" v-for="(item, index) in list" :key="index">
					<view class="cu-avatar round lg" :style="{ backgroundImage: 'url('+ item.avatar +')' }"></view>
					<view class="content">
						<view class="text-grey">
							<text class="text-cut">{{ item.nickname }}</text>
							<view class="cu-tag round bg-orange margin-left-sm">{{ item.member_card }}</view>
						</view>
						<view class="text-gray text-sm">
							<text class="text-cut">
								{{ item.add_time }} 加入
							</text>
						</view>
					</view>
					<view class="action" style="width:180upx">
						<view class="text-grey text-xs">直属粉丝：{{ item.class_a }} </view>
						<view class="text-grey text-xs">订单数量：{{ item.count_order }}</view>
					</view>
				</view>
			</view>
		</view>
		<empty-data v-else></empty-data>
	</view>
</view>	
</template>

<script>
	import { getCardList } from '@/api'
	export default {
		name: 'cardlist',
		data () {
			return {
				list: [],
				id: '',
				title: '',
				loaded: true,
				params: {
					limit: 10,
					first: 1,
					type: 0
				}
			}
		},
		onLoad (options) {
			this.title = options.title
			this.params.type = +options.type
			this.id = options.id
			this.getList()
		},
		onReachBottom () {
			if (this.loaded) {
				this.params.first++
				this.getList()				
			}
		},
		methods: {
			getList () {
				uni.showLoading()
				getCardList(this.params).then(res => {
					uni.hideLoading()
					this.list = [...this.list, ...res.data]
					if (!res.data.length && this.params.first !== 1) {
						uni.showToast({
							title: '没有更多数据了',
							icon: 'none'
						})
						this.loaded = false
					}
				})
			}			
		}
	}
</script>

<style>
</style>
