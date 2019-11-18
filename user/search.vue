<template>
	<view class="flex flex-direction search-page">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">搜索</block>
		</cu-custom>
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" :focus="true" auto-focus confirm-type="search" v-model="keyword" @input="search"/>
			</view>
			<view class="action">
				<button class="cu-btn round bg-white" @tap="isBack">取消</button>
			</view>			
		</view>
		<view class="box flex-sub">
			<scroll-view scroll-y="true" v-if="list.length" @scrolltolower="LoadMore">
				<view class="cu-list menu-avatar">
					<navigator hover-class="none" :url="'/pages/index/prodetail?id='+item.id" class="cu-item" v-for="(item, idx) in list" :key="idx">
						<view class="cu-avatar lg" :style="{ backgroundImage: 'url('+ item.image +')' }"></view>
						<view class="content">
							<view class="text-cut">{{ item.store_name }}</view>
						</view>
					</navigator>
				</view>
			</scroll-view>
			<empty-data v-else></empty-data>
		</view>
	</view>
</template>

<script>
	import { ProList } from '@/api'
	export default {
		data () {
			return {
				CustomBar: this.CustomBar,
				keyword: '',
				list: [],
				first: 1
			}
		},
		methods: {
			isBack () {
				uni.navigateBack()
			},
			search () {
				this.dataList(0)
			},
			LoadMore () {
				this.first++
				console.log(this.first)
				this.dataList(1)
			},
			dataList (t) {
				uni.showLoading({ title: '搜索中...' })
				if (!t) this.first = 0
				ProList({ keyword: this.keyword, first: this.first }).then(res => {
					uni.hideLoading()
					if (!t) this.list = []
					if (res.code === 200) {
						if (res.data.length) {
							this.list = [...this.list, ...res.data]
						} else {
							if (t) {
								uni.showToast({
									icon: 'none',
									title: '没有更多了'
								})
							} 
						}
					}
				})
			},
			clearHistory () {
				uni.showModal({
					content: '确定清楚历史记录吗？',
					success: rst => {
						if (rst.confirm) this.history = []
					}
				})
			}
		}
	}
</script>

<style lang="less">
.search-page {
	height: 100%;
	.box {
		position: relative;
		overflow: hidden;
		scroll-view {
			height: 100%;
		}
	}
}
page {
	height: 100%;
	overflow: hidden;
}	
</style>
