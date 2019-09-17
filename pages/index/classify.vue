<template>
<view>
	<cu-custom bgColor="bg-gradual-red">
		<block slot="content">商铺列表</block>
	</cu-custom>
	<scroll-view scroll-y @scrolltolower="loadMore" class="scroll" :style="{ top: top + 'px' }">
		<view class="list bg-white" v-if="loaded && list.length">
			<view  class="item shadow-warp solid bg-white" v-for="(i, k) in list" :key="k">
				<navigator :url="'/pages/index/prodetail?id='+i.id"><image :src="i.image"></image></navigator>
				<view>
					<view class="padding-sm">{{ i.store_name }}</view>
					<view class="padding-left-sm padding-right-sm padding-bottom-sm flex align-center">
					</view>
				</view>
			</view>	
		</view>		
	</scroll-view>
</view>
</template>

<script>
	import { ProList, addCart, ProDetails } from '@/api'
	import { mapGetters } from 'vuex'
	import uniNumberBox from '@/components/uni-number-box';
	export default {
		name: 'ProList',
		components: { uniNumberBox },
		data () {
			return {
				top: this.CustomBar,
				list: [],
				loaded: false,
				showAttr: false,
				pAttr: [],
				pValue: [],
				cartNum: 1,
				PRO: {},
				first:1
			}
		},
		created() {
			this.getList()
		},
		watch: {
			_is (val, oldval) {
				if (val) {
					if (this.selected.stock < this.cartNum) {
						this.cartNum = this.selected.stock
					}
				}
			}
		},
		computed: {
			...mapGetters(['userInfo', 'cid']),
			needSelect () {
				return this.pAttr.filter(item => {
					return !item.attr_value.some(k => k.check);
				})		
			},
			_is () {
				return JSON.stringify(this.selected) !== '{}'
			},
			selected () {
				if (!this.needSelect.length && this.pAttr.length) {
					let x = this.pAttr.map(item => {
						let n = item.attr_value.filter(k => k.check)[0].attr
						return n
					}).sort()
					return this.pValue.filter(item => item.suk.split(',').sort().toString() === x.toString())[0]
				}
				return {}
			}
		},
		methods: {
			linkCart () {
				uni.navigateTo({
					url: '/user/myCart'
				})
			},
			async loadMore(mescroll){
				this.first++
				uni.showLoading({ title: '加载中' })
				const len = await this.action()
				uni.hideLoading()
				if (!len && this.first !== 1) {
					uni.showToast({
						icon: 'none',
						title: '没有更多了'
					})
				} 
			},
			buyNums (e) {
				this.cartNum = e
			},
			End (e) {
				const item = e.currentTarget.dataset.item
				const id = item.id
				const uniqueId = item.cate_id
				uni.showLoading({ title: '加载中...' })
				ProDetails({ id }).then(res => {
					uni.hideLoading()
					const pro = res.data.storeInfo
					this.cartNum = 1
					this.pValue = []
					this.PRO = pro
					this.showAttr = true
					this.pAttr = res.data.productAttr
					for (let x in res.data.productValue) this.pValue.push(res.data.productValue[x])
				})
			},
			f () {
				if (this.pAttr.length) {
					if (!this.needSelect.length) {
						const productId = this.selected.product_id
						const uniqueId = this.selected.unique
						uni.showLoading({ title: '加载中...' })
						addCart({ productId, uniqueId, cartNum: this.cartNum }).then(res => {
							uni.hideLoading()
							uni.showModal({
								content: '加入成功',
								showCancel: false
							})
						})
					} else {
						let attrName = ` ${this.needSelect
							.map(item => item.attr_name)
							.toString()
							.replace(/,/gi, ' ')}`;					
						uni.showToast({
							icon: 'none',
							duration: 2000,
							title: `请选择${attrName}`
						})
					}
				} else {
					uni.showModal({
						content: '该产品没有属性?',
						showCancel: false
					})
				}
			},
			selectPro (o, i) {
				this.pAttr[i].attr_value.forEach(item => { item.check = false })
				o.check = !o.check
			},
			action () {
				return new Promise(resolove => {
					ProList({ cid: this.cid, first: this.first }).then(res => {
						this.loaded = true
						this.list = [...this.list, ...res.data]
						resolove(res.data.length)
					})					
				})
			},
			async getList () {
				this.loaded = false
				uni.showLoading({title: '加载中' })
				await this.action()
				this.loaded = true
				uni.hideLoading()
			}
		}
	}
</script>

<style lang="less" scope>
.scroll {
	position: absolute;
	width: 100%;
	left: 0;
	bottom: calc(100rpx + env(safe-area-inset-bottom) / 2);
	overflow: hidden;
}	
.list {
	display: flex;
	flex-wrap: wrap;
	padding-bottom: 120upx;
	.item {
		overflow: hidden;
		width: 47%;
		margin: 20upx 2% 0;
		box-sizing: border-box;
		border-radius: 10upx;
		&:nth-of-type(2n+1) {
			margin-right: 0
		}
		image {
			display: block;
			width: 100%;
			height: 360upx;
		}
	}
}
.attr {
	.item {
		&:nth-of-type(n+2) {
			.name {
				padding-top: 0;
			}
		}
		.name {
			text-align: left;			
			margin-left: 20upx;
			padding-top: 15upx;
			padding-bottom: 15upx;
			color: black;
		}
		.box {
			& > view {
				margin-left: 20upx;
				margin-bottom: 15upx;
				margin-right: 10upx;
				font-size: 20upx;
				padding: 8upx 30upx;
				border-radius: 6upx;
				color: black;
				white-space: nowrap;
				border: 1px solid var(--gray);
				&.act {
					background-color:var(--black);
					color:white;							
				}
			}
		}
	}
}
.myCart {
	position: fixed;
	right: 40upx;
	bottom: 200upx;
	z-index: 99
}
</style>
