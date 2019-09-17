<template>
	<view>
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">搜索</block>
		</cu-custom>
		<view class="cu-bar search bg-white" :style="{ top: CustomBar+ 'px' }">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" :focus="true" auto-focus confirm-type="search"/>
			</view>
			<view class="action">
				<button class="cu-btn round bg-white" @tap="isBack">取消</button>
			</view>			
		</view>
		<view class="contain">
			<view class="cu-bar bg-white" v-if="history.length">
				<view class="action text-black">
					搜索历史
				</view>
				<view class="action" @tap="clearHistory">
					<text class="lg text-gray cuIcon-delete"></text>
				</view>
			</view>
			<view class="list">
				<view v-for="(item, index) in history" :key="index">{{ item }}</view>
			</view>
			<view class="cu-bar bg-white">
				<view class="action text-black">
					大家真正搜
				</view>
				<view class="action"></view>
			</view>
			<view class="list">
				<view v-for="(item, index) in hot" :key="index">{{ item }}</view>
			</view>				
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				CustomBar: this.CustomBar,
				history: [
					"美洲杯",
					"D站观点",
					"C罗",
					"早安D站",
					"2019退役球星",
					"女神大会",
					"德利赫特",
					"托雷斯",
					"自热火锅",
					"华为手机",
					"有机酸奶"				
				],
				hot:[
					"德利赫特",
					"托雷斯",
					"早安D站",
					"D站观点",
					"德利赫特",
					"美洲杯",
					"华为手机",
					"C罗",
					"自热火锅",
					"2019退役球星",
					"女神大会"					
				]
			}
		},
		methods: {
			isBack () {
				uni.navigateBack()
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

<style lang="less" scoped>
.search {
	position: fixed;
	width: 100%;
	height: 100rpx;
	z-index: 99;	
}	
.contain {
	padding-top: 100rpx; 
	.list {
		display: flex;
		flex-wrap: wrap;
		background-color:var(--white);
		padding: 0 30rpx;
		& > view {
			padding: 10rpx 25rpx;
			border-radius: 25rpx;
			margin: 0 20rpx 20rpx 0;
			background-color:#ededed;
		}
	}	
}
	
</style>
