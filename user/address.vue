<template>
<view class="address">
	<cu-custom bgColor="bg-gradual-red" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">我的地址</block>
	</cu-custom>
	<view class="flex flex-direction flex-sub">
		<scroll-view scroll-y class="flex-sub bg-white" style="overflow: hidden;">
			<view class="list" v-if="addressList.length">
				<view class="item solid-bottom" v-for="(item, index) in addressList" :key="index" @tap="selectBack(item.id)">
					<view>
					<view class="o-t">
						<view><text>{{ item.real_name }}</text><text>{{ item.phone }}</text></view>
					</view>
					<view class="o-a solid-bottom">
						<view><text v-if="item.is_default">默认</text>{{ item.province }} - {{ item.city }} - {{ item.district }} {{ item.detail }}</view>
					</view>									
					</view>
					<view class="o-d">
						<radio-group @tap.stop="setDefaults(item)">
							<label class="radio">
								<view>
									<radio :class="['red',{checked: item.is_default}]" :checked="item.is_default ? true : false"></radio>
								</view>
								<view>设为默认</view>
							</label>								
						</radio-group>
						<view>
							<view class="margin-right-sm" @tap.stop="EditItem(item)"><image src="/static/edit.png"></image>编辑</view>
							<view @tap.stop="DelAddress(item.id, index)"><image src="/static/del.png"></image>删除</view>
						</view>
					</view>
				</view>						
			</view>			
			<empty-data src="/static/address.png" v-else>''</empty-data>
		</scroll-view>
		<view class="add">
			<navigator url="/user/newAddress" hover-class="none">
				新增收货地址
			</navigator>
		</view>		
	</view>
</view>	
</template>

<script>
	import { setDefault, delAddress } from '@/api'
	import { mapGetters } from 'vuex'
	export default {
		name:'address',
		data () {
			return {
				type: 0
			}
		},
		onLoad(options) {
			if (options.type !== void 0) this.type = +options.type 
		},
		computed: {
			...mapGetters(['addressList'])
		},
		methods: {
			EditItem (item) {
				uni.navigateTo({
					url: `/user/newAddress?id=${item.id}`
				})
			},
			selectBack (id) {
				if (this.type) {
					uni.navigateBack()
					uni.setStorageSync('ADDRID', id)
				}
			},
			DelAddress (addressId, index) {
				uni.showModal({
					content: '你确定删除吗？',
					success: rst => {
						if (rst.confirm) {
							uni.showLoading({ mask: true, title: '删除中' })
							delAddress({ addressId }).then(res => {
								uni.hideLoading()
								uni.showToast({
									title: '删除成功',
									success: () => {
										this.$store.commit('DEL_ADDRESSLIST', index)
									}
								})
							})
						}
					}
				})
			},
			setDefaults (item) {
				const addressId = item.id
				uni.showLoading({ mask: true })
				setDefault({ addressId }).then(res => {
					uni.hideLoading()
					this.addressList.forEach(item => { item.is_default = 0 })
					item.is_default = 1
					uni.showToast({
						title: '设置成功'
					})
				})
			}
		}
	}
</script>

<style lang="less">
page, .address {
	height: 100%;
	overflow: hidden;
}
.address {
	display: flex;
	flex-direction: column;
	flex-flow: column;
	.list {
		background-color: f6f6f6;
		.item {
			padding: 0 15px;
			color: #333;
			background: white;
			margin-bottom: 30upx;
			& > view { font-size: 26upx }
			.o-t,
			.o-a,
			.o-d {
				display: flex;
				padding: 15upx 0;
			}
			.o-t ,.o-d {
				justify-content: space-between;
				align-items: center;							
			}
			.o-t {
				& > view:first-of-type {
					& > text {
						&:first-of-type { margin-right: 20upx;font-size:26upx; }
						// &:last-of-type { font-size: 20upx;color:var(--gray); }
					}
				}
			}
			.o-d {
				.radio {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					& > view {
						margin-right: 10upx;
						&:last-of-type {
							font-size: 20upx;
						}
					}
				}
			}
			.o-a {
				position: relative;
				padding-top: 0;
				text {
					color:var(--white);
					background-color: var(--red);
					font-size:20upx;
					padding:4upx 16upx;
					margin-right: 8upx;
				}
			}
			.o-d {
				radio-group { width: auto }
				&>  view {
					&:first-of-type {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}
					&:last-of-type {
						display: flex;
						align-items: center;
						& > navigator { margin-right: 15upx;  }
						& > view, & > navigator {
							font-size: 20upx;
							white-space: nowrap;
							display: flex;
							justify-content: center;
							align-items: center;
							image {
								width: 30upx;
								height: 30upx;
								display: block;
								margin-right: 10upx;
							}
						}
					}
				}
			}
		}
	}	
	.add {
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: white;
		box-sizing: border-box;
		& > navigator {
			background-color:var(--red);
			color:white;
			padding: 18upx 150upx;
			border-radius: 30upx;
			font-size:20upx;
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 22upx;
				height: 22upx;
				display: block;
				margin-right: 10upx;
			}
		}
	}	
}
</style>
