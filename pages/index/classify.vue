<template>
<view>
	<cu-custom bgColor="bg-gradual-red">
		<block slot="content">产品列表</block>
	</cu-custom>	
	<view class="list bg-white" v-if="loaded">
		<view class="item shadow-warp solid bg-white" v-for="(i, k) in list" :key="k">
			<userAuth v-if="!userInfo"></userAuth>
			<navigator :url="'/pages/index/prodetail?id='+i.id"><image :src="i.image"></image></navigator>
			<view>
				<view class="padding-sm">{{ i.store_name }}</view>
				<view class="padding-left-sm padding-right-sm padding-bottom-sm flex align-center">
					<text class="text-red text-bold text-df flex-sub text-price">{{ i.price }}</text>
					<button class="cu-btn icon bg-red sm" @tap="End" :data-item='i'>
						<text class="cuIcon-cartfill"></text>
					</button>
				</view>
			</view>
		</view>
		<view class="myCart">
			<userAuth v-if="!userInfo"></userAuth>
			<view class="cu-avatar lg round shadow-blur bg-gradual-red" @tap="linkCart">
				<!-- <view class="cu-tag badge"></view> -->
				<text class="cuIcon-cartfill"></text>
			</view>
		</view>		
	</view>
	<empty-data v-else></empty-data>
	<view @touchmove.stop.prevent="" :class="['cu-modal', {show: showAttr}]" @tap="showAttr = false">
		<view class="cu-dialog bg-white" @tap.stop="">
			<view class="attr solid-bottom">
				<view class="item" v-for="(item, index) in pAttr" :key="index">
					<view class="name">{{ item.attr_name }}：</view>
					<view class="box flex flex-wrap">
						<block v-for= "(son, idx) in item.attr_value" :key="idx">
							<view :class="{act: son.check}" @tap="selectPro(son, index)">{{ son.attr }}</view>
						</block>
					</view>
				</view>		
			</view>
			<view class="count flex justify-between align-center padding-sm">
				<view>
					<view class="text-black">购买数量：</view>
					<view class="text-xs text-gray text-left">剩余{{ _is ? selected.stock : PRO.stock }}件</view>
				</view>
				<uni-number-box
					:min="1"
					:max="1"
					disabled
					:value="cartNum"
					@change="buyNums"
				></uni-number-box>					
			</view>
			<view class="padding-sm solid-top flex justify-end">
				<button class="cu-btn bg-red round shadow-blur sm" @tap="f">加入购物车</button>
			</view>
		</view>
	</view>
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
				list: [],
				loaded: false,
				showAttr: false,
				pAttr: [],
				pValue: [],
				cartNum: 1,
				PRO: {}
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
			...mapGetters(['userInfo']),
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
			getList () {
				this.loaded = false
				uni.showLoading({title: '加载中' })
				ProList().then(res => {
					uni.hideLoading()
					this.loaded = true
					this.list = res.data
				})
			}
		}
	}
</script>

<style lang="less">
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
