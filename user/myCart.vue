<template>
<view>
	<cu-custom bgColor="bg-gradual-red" :isBack="true">
		<block slot="backText">返回</block>
		<block slot="content">购物车</block>
	</cu-custom>
	<block v-if="list.length">
		<view class="wrap">
			<view class="cu-list menu-avatar">
				<block v-for="(item,index) in list" :key="index">
					<view class="cu-item bg-gray" :class="{'move-cur': modalName=='move-box-'+ index }"
					 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
						<view class="cu-avatar lg" :style="[{backgroundImage:'url('+ item.productInfo.image +')'}]">
							<view class="cu-tag badge" v-if="item.checked">
								<text class="cuIcon-check"></text>
							</view>
						</view>
						<view class="content">
							<view class="text-grey">
								<text class="text-cut">{{ item.productInfo.store_name }}</text>
							</view>
							<view class="text-gray text-sm">
								{{ item.productInfo.store_info }}
							</view>
						</view>
						<view class="action">
							<view class="text-grey text-xs">
								{{ item.attrInfo.suk }}
							</view>
							<view class="cu-tag round bg-grey sm">x{{ item.cart_num }}</view>
						</view>
						<view class="move">
							<view class="bg-grey" @tap="selected(item)">{{ item.checked ? '取消' : '选取' }}</view>
							<view class="bg-red" @tap="delCart(item, index)">删除</view>
						</view>
					</view>
					<view class="opt bg-white padding solid-bottom solid-top flex justify-end">
						<view class="action flex">
							<view class="edit margin-right-sm">
								<checkbox @tap="selected(item)" class='round red' :class="item.checked?'checked':''" :checked="item.checked"></checkbox>
							</view>
							<view class="del" @tap="delCart(item, index)">
								<image src="/static/del.png"></image>
								<text>删除</text>
							</view>
						</view>	
					</view>				
				</block>
			</view>			
		</view>
		<view class="tool flex bg-white justify-between padding-left-sm align-center solid-top">
			<view class="text-xl text-bold text-red text-price" v-if="model.is_unified==1"><block v-if="isBuy">{{ model.u_price }}</block></view>
			<view class="text-xl text-bold text-red text-price" v-else><block>{{truePrice}}</block></view>
			<view class="bg-red text-df text-white text-bold flex align-center justify-center" @tap="submit">去结算</view>
		</view>
	</block>
	<empty-data v-else></empty-data>
</view>	
</template>

<script>
	import { CartList, upDateCartNum, delRemoveCart, confirmCart } from '@/api'
	import { mapGetters } from 'vuex'
	export default {
		name: 'myCart',
		data () {
			return {
				radio: 'D',
				listTouchDirection: null,
				modalName: null,
				listTouchStart: 0,
				list: [],
				Disabled: false,
				//truePrice:0,
			}
		},
		onShow () {
			this.getList()
		},
		computed: {
			cartId () {
				return this.isLen.map(k => k.id)
			},
			isBuy () {
				return this.isLen.length === +this.model.l_number
			},
			truePrice () {
				return this.isLen.reduce((total, k) => k.truePrice + total, 0)
			},
			isLen () {
				return this.list.filter(item => item.checked)
			},
			...mapGetters(['model'])
		},
		methods:{
			submit () {
				if (this.isLen.length) {
					if (+this.model.is_limit) {
						if (!this.isBuy) {
							uni.showModal({
								content: `限购数量为${this.model.l_number}件产品`,
								showCancel: false
							})
						} else {
							uni.navigateTo({
								url: '/pages/index/create',
								success: () => {
									const list = this.list.filter(item => item.checked)
									uni.setStorageSync('SET_SHOP', list)
									uni.setStorageSync('truePrice',this.truePrice)
								}
							})							
						}
					} else {
						uni.navigateTo({
							url: '/pages/index/create',
							success: () => {
								const list = this.list.filter(item => item.checked)
								uni.setStorageSync('SET_SHOP', list)
								uni.setStorageSync('truePrice',this.truePrice)
							}
						})					
					}					
				} else {
					uni.showModal({
						content: '请选择需要购买的产品',
						showCancel: false
					})
				}
			},
			selected (item) {
				item.checked = !item.checked
			},
			delCart (item, index) {
				uni.showModal({
					content: '你确定删除吗？',
					success: rst => {
						if (rst.confirm) {
							uni.showLoading({ mask: true, title: '删除中' })
							this.Disabled = true
							delRemoveCart({ cartId: item.id }).then(res => {
								uni.hideLoading()
								this.list.splice(index, 1)
								uni.showToast({
									title: '删除成功',
									success: () => {
										setTimeout(() => {
											this.Disabled = false
										}, 1500)
									}
								})
							})							
						}
					}
				})
			},
			changeNums (e, item) {
				if (this.Disabled) return
				uni.showLoading({ mask: true })
				item.cart_num = e
				upDateCartNum({ cartId: item.id, cartNum: item.cart_num }).then(res => {
					uni.hideLoading()
				})
			},
			getList () {
				uni.showLoading({ title: '加载中' })
				CartList().then(res => {
					uni.hideLoading()
					this.list = res.data.valid.map(item => {
						item.attrInfo = item.productInfo.attrInfo
						item.checked = true
						return item
					})
				})
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			}			
		}
	}
</script>

<style lang="less">
.wrap {
	padding-bottom: 100upx;
}
.opt {
	.del {
		display: flex;
		align-items: center;
		image {
			margin-right: 6upx;
			width: 30upx;
			height: 30upx;
			display: block;
		}
	}
}	
.tool {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100upx;
	& > view {
		&:nth-of-type(2) {
			height: 100%;
			padding: 0 40upx;
		}
	}
}	
</style>
