<template>
<view class="idx">
	<cu-custom bgColor="bg-white">
		<block slot="content">派送宝</block>
	</cu-custom>	
    <block>
		<view class="location bg-white">
			<text class="cuIcon-location padding-right-xs"></text>{{ address }}
			<text class="cuIcon-right padding-left-xs"></text>
			</view>
		<view class="cu-bar search bg-white" :style="{ top: CustomBar + 'px' }">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<swiper vertical autoplay circular interval="5000" class="tui-swiper">
					<swiper-item v-for="(item,index) in hotSearch" :key="index" class="tui-swiper-item" @tap="search">
						<view class="tui-hot-item">{{item}}</view>
					</swiper-item>
				</swiper>			
			</view>
		</view>
		<view class="slide">
			<swiper :indicator-dots="false" :current="current" @change="current = $event.detail.current" :autoplay="true" :interval="3000" :duration="1000" circular>
				<swiper-item v-for="(item, index) in list" :key="index">
					<image :src="item.pic" @tap="linkTo(item)"></image>
				</swiper-item>
			</swiper>
			<view class="dots flex">
				<view v-for="(item, index) in list" :key="index" :class="{ act: current === index }"></view>
			</view>
		</view>
		<view class="category">
			<swiper class="screen-swiper square-dot"
			:indicator-dots="true"
			indicator-active-color="#e54d42"  
			indicator-color="#8799a3">
				<swiper-item v-for="(item, index) in category" :key="index">
					<view class="item" v-for="(k, idx) in item" :key="idx" @tap="goPro(k)">
						<image :src="k.pic"></image>
						<view>{{ k.cate_name }}</view>
					</view>						
				</swiper-item>			
			</swiper>
		</view>
		<view class="bg-white padding-tb-sm" ><image src="/static/t1.jpg" class="tit"></image></view>		
		<view class="coupon_info bg-white">
			<swiper :indicator-dots="true" autoplay class="cu-swiper square-dot" circular :interval="3000" :duration="1000">
				<swiper-item v-for="(item, index) in news" :key="index">
					<navigator hover-class="none" :url="item.pid ? '/pages/index/prodetail?id='+item.pid : ''"><image :src="item.image" class="shadow"></image></navigator><!--:url="'/user/coupondetail?id='+item.cid"-->
				</swiper-item>
			</swiper>
		</view>
		<view class="bg-white" v-if="coupon.length">
			<swiper :indicator-dots="false" class="coupon shadow" autoplay :interval="3000" :duration="1000" circular>
				<swiper-item v-for="(item, index) in coupon" :key="index">
					<view class="swiper-item">
						<navigator hover-class="none" :url="item.pid ? '/pages/index/prodetail?id='+item.pid : ''" class="item">
							<image :src="item.image"></image>		
						</navigator>					
					</view>
				</swiper-item>
			</swiper>			
		</view>
		<view class="shop">
			<image src="/static/t2.jpg" class="tit"></image>
			<view class="list">
				<navigator hover-class="none" :url="'/pages/index/prodetail?id='+item.id" class="item" v-for="item in shop" :key="item.id">
					<image :src="item.image"></image>
					<view>
						<view class="text-black text-lg margin-top-xs text-cut">{{ item.store_name }}</view>
						<view class="margin-top-xs text-red margin-tb-xs text-cut text-sm">{{ item.address || '' }}</view>
						<view class="margin-top-xs text-sm">{{ item.cate_name || '' }}</view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="cu-modal" :class="{ show }">
			<view class="cu-dialog bg-white">
				<view class="cu-bar justify-center">微信授权</view>
				<view class="padding text-left solid-bottom solid-top">
					派送宝 为了给你提供更好的服务，需要向你申请权限
				</view>
				<view class="padding-sm text-left text-gray solid-bottom">
					获取你的公开信息（昵称，头像，地区及性别）
				</view>
				<view class="flex justify-end">
					<view class="padding-xs">
						<button class="cu-btn bg-white" @tap="show = false">拒绝</button>
						<button class="cu-btn bg-white text-green" open-type="getUserInfo" @getuserinfo="getInfo">允许</button>
					</view>
				</view>
			</view>
		</view>	
		<in-ids :show="flag" @on-close="flag = false"></in-ids>		
	</block>
	<empty-data src="/static/shop.png" :type="1" v-if="is_show"></empty-data>
</view>
</template>

<script>
	import { BindIndex, getCoupon, ProList } from '@/api'
	import { mapGetters } from 'vuex'
	import qqMap from '@/utils/qqmap-wx-jssdk.min'
	import InIds from '@/components/ids'
	export default {
		name: 'Home',		
		data () {
			return {
				CustomBar: this.CustomBar,
				flag: false,
				show: false,
				Load: false,
				current: 0,
				list: [],
				first: 1,
				coupon: [],
				category: [],
				hotSearch: [],
				shop: [],
				news: []
			}
		},
		computed: {
			...mapGetters(['userInfo', 'location', 'address', 'is_show'])
		},
		components: { InIds },
		created () {
			uni.showLoading({ mask: true, title:'加载中' })
			BindIndex({ first: this.first }).then(res => {
				uni.hideLoading()
				this.list = res.data.banner
				this.coupon = res.data.product_coupon.map(item => {
					item.coupon_price = +item.coupon_price
					return item
				})
				this.shop = res.data.list
				this.hotSearch = res.data.list.map(item => item.store_name)
				this.category = this.sliceArray(res.data.parentCategory)
				this.news = res.data.new
				this.$store.commit('SET_BARSHOW', res.data.barstyle === void 0 ? 0 : res.data.barstyle)
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
								}
							})
							// if (!this.userInfo) {
							// 	setTimeout(() => {
							// 		this.show = true
							// 	}, 1500)
							// }
						},
						fail: () => {
							this.$store.commit('SET_SHOW', true)
						}
					})					
				}
			})
			uni.$on('onLoad', async ()=> {
				uni.showLoading({ title: '加载中' })
				this.first++
				const len = await this.action()
				uni.hideLoading()
				if (!len && this.first !== 1) {
					uni.showToast({
						icon: 'none',
						title: '没有更多了'
					})
				} 
			})
		},
		destroyed () {
			uni.$off('onLoad')
		},
		methods: {
			sliceArray (arr, num = 10) {
				let newArr = []
				let len = Math.ceil(arr.length / num)
				for (let i = 0; i < len;i++) {
					let start = i * num
					let end =  start + num
					newArr.push(arr.slice(start, end))
				}
				return newArr
			},
			linkTo (item) {
				if (item.pid) {
					uni.navigateTo({
						url: `/pages/index/prodetail?id=`+item.pid
					})					
				}
			},
			goPro (item) {
				this.$store.commit('SET_CID', item.id)
				uni.$emit('change', 1)
			},
			goCouponDetail (cdeta) {
				const cdetail = cdeta.currentTarget.dataset.item
				uni.navigateTo({
					url: '/user/coupondetail',
					success: () => {
						this.$store.commit('SET_CDETAIL', cdetail)
					}
				})
			},
			getCxx (item) {
				uni.showLoading({ title: '领取中', mask: true })
				getCoupon({ couponId: item.id }).then(res => {
					uni.hideLoading()
					uni.showModal({
						content: res.msg,
						showCancel: false
					})
				})
			},
			action () {
				return new Promise(resolove => {
					ProList({ first: this.first }).then(res => {
						this.loaded = true
						this.shop = [...this.shop, ...res.data]
						resolove(res.data.length)
					})					
				})
			},						
			async getInfo (e) {
				if (e.detail.errMsg === 'getUserInfo:ok') {
					const x = await this.$store.dispatch('wxAuth', e)
					this.show = false
					if (!x) {
						this.flag = true
					}
				} else {
					uni.showModal({
						content: '授权失败',
						showCancel: false
					})
				}
			},
			search () {
				uni.navigateTo({
					url: '/user/search'
				})
			},
			change () {
				uni.$emit('change', 1)
			}
		}
	}
</script>

<style lang="less">
.idx {
	padding-bottom:100rpx;
	.location {
		padding: 10rpx 30rpx 0;
	}
	.search {
		position: sticky;
		width: 100%;
		height: 100rpx;
		top: 0;
		z-index: 77;
		.tui-swiper {
			font-size: 26rpx;
			height: 60rpx;
			flex: 1;
			padding-left: 12rpx;
		}

		.tui-swiper-item {
			display: flex;
			align-items: center;
		}

		.tui-hot-item {
			line-height: 26rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: #999;
		}
		
	}
	.slide {
		padding:30rpx 30rpx 20rpx;
		background-color:var(--white);
		position: relative;
		swiper {
			height: 340rpx;
			swiper-item {
				padding: 0 10rpx;
				box-sizing: border-box;
				image {
					width: 100%;
					height: 100%;
					border-radius: 15rpx;
				}					
			}
		}
		.dots {
			position: absolute;
			background-color: rgba(0, 0, 0, .6);
			padding: 10rpx 15rpx;
			bottom: 45rpx;
			border-radius: 25rpx;
			right: 55rpx;
			& > view {
				background-color: rgba(255, 255, 255, .4);
				height: 15rpx;
				width: 15rpx;
				border-radius: 50%;
				margin-right: 10rpx;
				will-change: background-color;
				transition-duration: .4s;
				&.act {
					background-color: white;
				}
				&:last-of-type {
					margin-right: 0
				}
			}
		}
	}
	.category {
		display: flex;
		flex-wrap: wrap;
		background-color: var(--white);
		position: relative;
		swiper {
			min-height: 340rpx;
			width: 100%;
			swiper-item {
				display: flex;
				flex-wrap: wrap;
				.item {
					width: 20%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: flex-start;
					& > view {
						font-size: 13px;
						margin-top:15rpx; 
					}
					image {
						height: 88rpx;
						width: 88rpx;
						display: block;
					}
				}				
			}
		}
	}
	.tit {
		width: 100%;
		height: 65rpx;
		display: block;
	}
	.coupon {
		padding: 0 15rpx;
		height: 500rpx;
		swiper-item {
			padding: 0 15rpx;
			box-sizing: border-box;
			background-color:var(--white);
			.item {
				width: 100%;
				border-radius: 15rpx;
				overflow: hidden;
				position: relative;
				& > image {
					width: 100%;
					height: 500rpx;
				}
				& > view {
					z-index: 88;
					position: absolute;
					color:white;					
					&.tag {
						background-color:#fe6d49;
						top:0;
						left: 0;
						border-bottom-right-radius: 10rpx;						
					}
					&.price {
						bottom: 15rpx;
						left: 15rpx;
						.btn {
							border-radius: 25rpx;
							padding: 10rpx 20rpx;
							&.yellow {
								background-color: #fdc753;
							}
							&.orange {
								background-color: #fe878c;
							}
						}
					}
				}
			}			
		}
	}
	.coupon_info {
		padding: 0 0 15rpx;
		swiper {
			height: 450rpx;
			swiper-item {
				padding: 0 30rpx;
				box-sizing: border-box;
				image {
					height: 450rpx;
					width: 100%;
					border-radius: 15rpx;
				}
			}
		}
	}
	.shop {
		background-color: var(--white);
		padding: 40rpx 0 20rpx;
		.list {
			padding: 30rpx 30rpx 20rpx 30rpx;
			box-sizing: border-box;
			display:flex;
			flex-wrap:wrap;
			.item {
				display: flex;
				padding-bottom: 25rpx;
				flex-direction:column;
				width: calc(50vw - 40rpx);
				box-sizing: border-box;
				& > image {
					width: calc(50vw - 40rpx);
					height: calc(50vw - 40rpx);
					border-radius: 15px;
				}
				& > view {
					flex: 1;
				}
				&:nth-of-type(2n + 1) {
					margin-right: 20rpx;
				}
			}
		}
	}
}
</style>
