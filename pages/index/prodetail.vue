<template>
	<view>
		<cu-custom bgColor="bg-gradual-red" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">商品详情</block>
		</cu-custom>
		<view class="detail bg-white">
			<view class="swiper-box">
				<swiper :circular="true" :autoplay="true" @change="swiperChange">
					<swiper-item v-for="(item, index) in swiperList" :key="index">
						<image :src="item"></image>
					</swiper-item>
				</swiper>
				<view class="indicator">{{currentSwiper+1}}/{{swiperList.length}}</view>				
			</view>
			<view class="info padding-top-sm padding-bottom-sm padding-right-sm flex solid-bottom margin-left-sm">
				<view class="flex-sub">
					<view class="title text-black padding-bottom-xs">{{ PRO.store_name }}</view>
 					<view class="text-price text-bold text-red text-xl">{{ PRO.price }}</view>
					<view class="text-price text-gray text-xs margin-top-xs" style="text-decoration: line-through;">{{ PRO.ot_price }}</view>
				</view>
				<view @tap="action = true" class="share flex flex-direction align-center justify-start">
					<image src="/static/share.png" style="width: 40upx;height: 40upx;display: block;"></image>
					<view class="text-xs text-lgrey padding-top-xs">分享</view>
				</view>
			</view>
			<view class="cu-list menu">
				<view class="cu-item spt">
					<view class="content text-gray">
						<text class="text-xs">运费</text>
					</view>
					<view class="action text-xs text-gray">剩余{{ _is ? selected.stock : PRO.stock }}</view>
				</view>
			</view>
		</view>
		<view class="props margin-top-sm">
			<view class="cu-list menu">
				<view class="cu-item arrow" @tap="showAttrs" :data-type="2">
					<view class="content text-left">
						选择
					</view>
				</view>				
<!-- 				<view class="cu-item arrow" @tap="post = true">
					<view class="content">
						<text class="text-df">配送</text>
					</view>
				</view>	 -->			
			</view>
		</view>
		<view class="title desc bg-white margin-top-sm solid-bottom">
			<view>商品详情</view>
		</view>
		<view class="content">
			<rich-text :nodes="PRO.description"></rich-text>
		</view>
		<view class="tool_wrap">
			<view class="tool">
				<view class="cu-bar bg-white tabbar border shop">
					<button class="action" open-type="contact">
						<view class="cuIcon-service text-green">
							<view class="cu-tag badge"></view>
						</view>
						客服
					</button>
					<view class="bg-cyan submit" @tap="linkCart">
						<!-- <view class="cuIcon-cart">
							<!-- <view class="cu-tag badge">99</view> 
						</view> -->
					  进入购物车
					</view>
					<!-- <view class="action" @tap="linkCart"  style="width:140px;">
						<view class="cuIcon-cart">
							<!-- <view class="cu-tag badge">99</view> 
						</view>
						
					</view> -->
					<view class="bg-black submit" @tap="showAttrs" :data-type="1">加入购物车</view>
					<!-- <view class="bg-black submit" @tap="showAttrs" :data-type="0">立即订购</view> -->
				</view>			
			</view>			
		</view>
		
		
		<!-- 弹窗 -->
		
		
		<!-- 产品属性 -->
		<view :class="['props', { show: Attrs }]">
			<view class="mask" @touchmove.stop.prevent="noEvent" @tap="Attrs = false"></view>
			<view class="contain bg-white" @touchmove.stop.prevent="noEvent">
				<view class="pro flex margin-right-sm margin-left-sm solid-bottom">
					<image :src="PRO.image"></image>
					<view class="flex-sub margin-left-sm" style="overflow: hidden;">
						<view class="title text-cut text-sm padding-top-xs padding-bottom-sm">{{ PRO.store_name }}</view>
						<!-- <view class="text-price text-bold text-df">{{ PRO.price }}</view> -->
					</view>
					<view @tap="Attrs = false" class="close round flex solid justify-center align-center line-black margin-tb-sm">
						<text class="cuIcon-close"></text>
					</view>
				</view>
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
						<view class="text-xs text-gray">剩余{{ _is ? selected.stock : PRO.stock }}件</view>
					</view>
					<uni-number-box
					    disabled
						:min="1"
						:max="1"
						:value="count"
						@change="count = $event"
					></uni-number-box>					
				</view>
				<view class="control flex justify-between">
					<view v-if="type === 1 || type === 2"  @tap="f" class="flex-sub flex align-center justify-center padding-top-sm padding-bottom-sm bg-red">
						{{ type === 1 ? '确认' : '加入购物车' }}
					</view>
<!-- 					<view v-if="type === 0 || type === 2" @tap="toBuy" class="flex-sub flex align-center justify-center padding-top-sm padding-bottom-sm bg-black">
						{{ !type ? '下一步' : '立即购买' }}
					</view> -->
				</view>
			</view>
		</view>
		<!-- 快递 -->
<!-- 		<view :class="['showPost', { show: post }]">
			<view class="mask" @touchmove.stop.prevent="noEvent" @tap="post = false"></view>
			<view class="contain bg-white flex flex-direction" @touchmove.stop.prevent="noEvent">
				<view class="title flex align-center justify-center solid-bottom text-df text-black">配送方式</view>
				<view class="list flex-sub">
					<scroll-view scroll-y style="height: 100%;">
						<block>
							<view class=" solid-bottom item text-black flex align-center padding-left-sm padding-right-sm">快递发货(<text class="text-price">0.00 ~ 999.00</text>)</view>
						</block>
					</scroll-view>
				</view>
				<button hover-class="none" class="cu-btn bg-black no-round lg" @tap="post = false">我知道了</button>
			</view>
		</view> -->
		<!-- 海报 -->
		<view :class="['canvas', { show: show }]">
			<view class="mask" @touchmove.stop.prevent="noEvent" @tap="show = false"></view>
			<view class="contain" @touchmove.stop.prevent="noEvent">
				<block v-if="show">
					<canvas canvas-id="testCanvas" class="radius" :style="{ width: w + 'px', height: h + 'rpx' }"></canvas>
					<view v-if="isBtn" class="savePhoto radius bg-red" @tap="clickMe" :style="{ width: w + 'px' }">保存到相册</view>						
				</block>
			</view>
		</view>
		<!-- 分享 -->
		<view :class="['uni-action-sheet', { action: action }]">
			<view class="mask" @tap="action = false" @touchmove.stop.prevent="noEvent"></view>
			<view class="itemlist">
				<block v-for="(item, index) in itemList" :key="index">
					<view
					:class="{ cancel: !item, 'solid-bottom': item && index !== itemList.length -2 }"
					class="item text-black solid-top padding-bottom-sm padding-top-sm solid-bottom bg-white"
					v-if="item !== '发送给朋友'" @tap="actionSheet" :data-index="index">
					{{ item ? item : '取消' }}
					</view>
					<button open-type="share" class="cu-btn bg-white block text-black" v-else-if="item === '发送给朋友'">{{ item }}</button>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
import uniNumberBox from '@/components/uni-number-box';
import { ProDetails, addCart } from '@/api'
import { mapGetters } from 'vuex'
export default {
	name:'proInfo',
	components: {
		uniNumberBox
	},
	onShareAppMessage() {
		return {
			title: this.PRO.store_name, // 自定义分享标题
			imageUrl: this.swiperList[0], //自定义分享封面
			path: `/pages/index/index?scene=${this.userInfo.uid}`, // 之定义分享入口
			success: () => {
				//接口调用成功的回调函数
			},
			fail: () => {
				//接口调用失败的回调函数
			}
		}
	},
	watch: {
		_is (val, oldval) {
			if (val) {
				if (this.selected.stock < this.count) {
					this.count = this.selected.stock
				}
			}
		}
	},	
	data () {
		return {
			PRO: {},
			pAttr: [],
			count: 1,
			pValue: [],
			type: 0, // 显示属性的方式
			Attrs: false, // 显示属性
			post:false, //显示快递
			show: false, //显示海报
			action: false, // 显示分享
			screenImg: 'https://admin.sinlu.net/public/img/test.jpg', // 海报大图
			imgScan: 'https://admin.sinlu.net/public/img/qrcode.png', // 小程序二维码
			imgScanW: 140,
			imgType: 'png',
			price: '',
			padding: 65,
			bottomH: 900,
			srcImg: '',
			w: '',
			h: '',
			isBtn: false, // 是否显示保存海报按钮
			//轮播主图数据
			swiperList: [ // 商品轮播图
			],
			//轮播图下标
			currentSwiper: 0, // 轮播位置
			itemList: ['发送给朋友', '生成海报', ''],
			params: {
				id: ''
			}
		}
	},
	onLoad (options) {
		this.params.id = options.id
		this.getDetails()
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
		getDetails () {
			uni.showLoading({ title: '加载中', mask: true })
			ProDetails(this.params).then(res => {
				uni.hideLoading()				
				const pro = res.data.storeInfo
				const reg = /\<img/gi
				const str = '<img style="max-width:100%;height:auto;display:block;"'				
				this.PRO = pro
				this.PRO.description = this.PRO.description.replace(reg, str)
				this.pAttr = res.data.productAttr
				this.swiperList = pro.slider_image.map(item => {
					item = item.replace('http', 'https')
					return item
				})
				this.pValue = []
				for (let x in res.data.productValue) this.pValue.push(res.data.productValue[x])	
			})
		},
		f () {
			if (this.pAttr.length) {
				if (!this.needSelect.length) {
					const productId = this.selected.product_id
					const uniqueId = this.selected.unique
					uni.showLoading({ title: '加载中' })
					addCart({ productId, uniqueId, cartNum: this.count }).then(res => {
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
		toBuy () { // 去购买
			uni.navigateTo({
				url: '/pages/order/create'
			})
		},
		selectPro (o, i) {
			this.pAttr[i].attr_value.forEach(item => { item.check = false })
			o.check = !o.check
		},
		showAttrs (e) {
			 this.type = +e.currentTarget.dataset.type
			 this.Attrs = true
		},
		actionSheet (e) {
			switch(+e.currentTarget.dataset.index) {
				case 1:
				uni.showLoading({ title: '正在生成中' })
			    this.action = false				
				this.drawImage()
				break;
				case 2:
				this.action = false
				break;
			}
		},
		swiperChange(event) {
			this.currentSwiper = event.detail.current;
		},
		linkCart () {
			uni.navigateTo({
				url: '/user/myCart'
			})
		},
		clickMe() {
			let _this = this;
			uni.showLoading({
				title: '正在保存中'
			});
			uni.canvasToTempFilePath({
				canvasId: 'testCanvas',
				fileType: _this.imgType,
				success: function(res) {
					uni.hideLoading();
					_this.srcImg = res.tempFilePath;
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success(res1) {
							_this.$emit('clickMe', true, res.tempFilePath);
							uni.showToast({
								title: '保存成功'
							});
						},
						fail(err) {
							_this.$emit('clickMe', false, res.tempFilePath);
							uni.showToast({
								icon: 'none',
								title: '保存失败'
							});
							uni.hideLoading();
						},
						complete() {
							_this.isBtn = false;
						}
					});
				},
				fail(err) {
					uni.hideLoading();
				}
			});
		},
		async drawImage() {
			let _this = this;
			let imgInfo =  await _this.getImageInfo({ imgSrc: _this.swiperList[0] });
			let r = [imgInfo.width, imgInfo.height];
			let path = imgInfo.path;

			//canvas宽度和高度
			let canvasW = _this.padding + _this.padding, //计算canvas宽 左右空白
				canvasH = _this.padding + _this.padding + _this.padding + _this.padding + _this.bottomH; //计算canvas高 上中下空白区域 + 下部分文本区域

			let rect_w_padding = _this.padding,
				rect_h_padding = _this.padding; //矩形横向，纵向边距

			if (r[0] < 370) {
				rect_w_padding = rect_w_padding + Math.floor((370 - r[0]) / 2); // 横向需要补的留白区域  有空白区域时，绘制图片的左侧间距需要重新计算
				canvasW = canvasW + 370;
			} else if (r[0] > 500) {
				// 大于500px的图片等比例缩放
				r[1] = 370 / (r[0] / r[1]);
				r[0] = 370;
				canvasW = canvasW + 370;
			} else {
				canvasW = canvasW + r[0];
			}
			if (r[1] < 410) {
				rect_h_padding = rect_h_padding + Math.floor((410 - r[1]) / 2);
				canvasH = canvasH + 410;
			} else if (r[1] > 600) {
				r[0] = 600 * (r[0] / r[1]);
				r[1] = 600;
				rect_w_padding = _this.padding + Math.floor((370 - r[0]) / 2); // 横向需要补的留白区域  有空白区域时，绘制图片的左侧间距需要重新计算
				canvasH = canvasH + 800;
			} else {
				canvasH = canvasH + r[1];
			}
			let textPadding = rect_w_padding;
			let bottomPositionY = rect_h_padding + r[1] + _this.padding; //下半部分距离图片高度
			let scanPositionX = r[0] + rect_w_padding - _this.imgScanW; //计算二维码距离左侧位置
			if (r[1] === 600) {
				textPadding = textPadding - _this.padding;
				scanPositionX = scanPositionX + _this.padding;
			}

			const ctx = uni.createCanvasContext('testCanvas');

			_this.w = uni.upx2px(canvasW);
			_this.h = uni.upx2px(canvasH);
			
			//绘制白色矩形背景
			ctx.setFillStyle('white');
			ctx.fillRect(0, 0, _this.w, _this.h);
			//绘制第一张图片
			ctx.drawImage(path, 0, 0, _this.w, uni.upx2px(r[1] + 100));

			// 绘制下半部分
			//设置图片描述/图片标题
			let temp = ''
			let row = []
			ctx.setFontSize(uni.upx2px(26));
			ctx.setFillStyle('#31303B');
			for (let a = 0; a < _this.PRO.store_name.length; a++) {
				if (ctx.measureText(temp).width < _this.w - uni.upx2px(25) * 2) {
					temp+= _this.PRO.store_name[a]
				} else {
					a--
					row.push(temp)
					temp = ''
				}
			}
			row.push(temp)
			for (let b = 0; b < row.length; b++) {
			   ctx.fillText(row[b], uni.upx2px(15), uni.upx2px(bottomPositionY)+ 20 * b); //32为字体大小	
			}
			//绘制作者名称
			let qrcode = await _this.getImageInfo({imgSrc: _this.swiperList[0]})
			ctx.setFontSize(uni.upx2px(28));
			ctx.setFillStyle('#e54d42');
			ctx.fillText(`￥${this.PRO.price} - ${this.PRO.ot_price}`, uni.upx2px(10), uni.upx2px(bottomPositionY + 130));
			ctx.drawImage(qrcode.path, uni.upx2px(scanPositionX + 30), uni.upx2px(bottomPositionY + 60), uni.upx2px(_this.swiperList[0]), uni.upx2px(_this.swiperList[0]));

			setTimeout(function() {
				ctx.draw();
				_this.isBtn = true;
				_this.show = true;
				uni.hideLoading();
			}, 2000);
		},
		async getImageInfo({ imgSrc }) {
			return new Promise((resolve, reject) => {
				uni.getImageInfo({
					src: imgSrc,
					success: function(image) {
						resolve(image);
					},
					fail(err) {
						reject(err);
					}
				});
			});
		},
		noEvent () { // 废弃 
		}		
	}
};
</script>

<style lang="less">
.mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0);
	transition-duration: .5s;
	will-change: background-color;
	z-index: 66;
	visibility: hidden;
}
.desc {
	height: 80upx;
	display: flex;
	align-items: center;
	padding: 0 15upx;
	& > view {
		border-left: 5px solid var(--red);
		padding: 0 0 0 15upx;
	}
}
.cu-item.spt {
	min-height: 60upx !important;
}
.canvas {
	visibility: hidden;
	&.show {
		visibility: visible;
		.mask {
			visibility: visible;
			background-color: rgba(0, 0, 0, .5)
		}
	}
	.contain {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 99;
		.close {
			position: absolute;
			top: -20upx;
			right: -20upx;
			width: 50upx;
			height: 50upx;
			z-index: 999;
			border-radius: 100%;
		}
		.savePhoto {
			margin-top: 20upx;
			display: flex;
			justify-content: center;
			padding: 20upx 0;
			position: fixed;
			z-index: 99
		}
		
	}
}
.swiper-box {
	position: relative;
	width: 100%;
	height: 100vw;
	swiper {
		width: 100%;
		height: 100vw;
		swiper-item {
			image {
				width: 100%;
				height: 100vw;
			}
		}
	}
	.indicator{
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 25upx;
		height: 40upx;
		border-radius: 40upx;
		font-size: 22upx;
		position: absolute;
		bottom: 20upx;
		right: 20upx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.2);
	}
}
.tool_wrap {
	height: 100upx;
	.tool {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 55;
	}	
}
.props .cu-item {
	min-height: 80upx !important;
}
.uni-action-sheet {
	&.action {
		visibility: visible;
		.mask {
			visibility: visible;
			background-color: rgba(0, 0, 0, .5)
		}
		.itemlist {
			transform: translate3d(0, 0, 0);
		}
	}
	.itemlist {
		transform: translate3d(0, 100%, 0);
		transition-duration: .2s;
		will-change: transform;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color:#f5f5f5;
		z-index: 99;
		text-align: center;
		.cu-btn {
			height: 78upx;
		}
		.item {
			&.cancel {
				margin-top: 15upx;
			}
		}
	}
}
.showPost {
	&.show {
		.mask {
			visibility: visible;
			background-color: rgba(0, 0, 0, .5);
		}
		.contain {
			transform: translate3d(0, 0, 0);
		}
	}
	.contain {
		position: fixed;
		width: 100%;
		height: 55%;
		bottom: 0;
		left: 0;
		z-index: 99;
		transform: translate3d(0, 100%, 0);
		transition-duration: .2s;
		will-change: transform;
		.title {
			height: 80upx;
		}
		.list {
			overflow: hidden;
			.item {
				height: 70upx;
			}
		}
		.cu-btn {
			&.no-round {
				border-radius: 0;
			}
		}
	}
}
.props {
	.mask {
		visibility: hidden;
		background-color: rgba(0,0,0,0)
	}
	&.show {
		.mask {
			visibility: visible;
			background-color: rgba(0,0,0, .5);
		}
		.contain {
			transform: translate3d(0, 0, 0);
		}
	}
	.contain {
		position: fixed;
		z-index: 99;
		left: 0;
		bottom: 0;
		width: 100%;
		transform: translate3d(0, 110%, 0);
		transition-duration: .2s;
		will-change: transform;
		.pro {
			image {
				width: 150upx;
				height: 150upx;
				display: block;
				position: relative;
				transform: translateY(-10%);
				border-radius: 15upx;
			}
			.close {
				width: 50upx;
				height: 50upx;
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
		.control {
			
		}
	}
}
</style>
