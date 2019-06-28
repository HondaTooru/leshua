<template>
	<view>
		<cu-custom bgColor="bg-gradual-red" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">我的钱包</block>
		</cu-custom>
		<view v-if="list.length">
			<view class="cu-list menu">
				<view class="cu-item" v-for="(item, index) in list" :key="index">
					<view class="content">
						<view>
							<text class="cuIcon-moneybagfill text-cyan margin-right-xs"></text>
							{{ item.mark }}
						</view>
						<view class="text-gray text-sm">
							<text class="cuIcon-time margin-right-xs"></text>
							{{ item.add_time }}
						</view>
					</view>
				</view>
			</view>			
		</view>
		<empty-data v-else></empty-data>
	</view>
</template>

<script>
	import { BalanceList } from '@/api'
	export default {
		name: 'money',
		data () {
			return {
				params: {
					first: 1,
					limit: 10
				},
				list: []
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList () {
				uni.showLoading()
				BalanceList(this.params).then(res => {
					uni.hideLoading()
					this.list = res.data
				})
			}
		}
	}
</script>

<style>
</style>
