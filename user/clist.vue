<template>
	<view class="clist">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">优惠券</block>
		</cu-custom>
		<view class="head">
			<image src="/static/c_c.jpg"></image>
		</view>
		<view class="list">
			<view class="item shadow-lg" v-for="(item, index) in list" :key="index">
				<view class="top flex justify-between align-center">
					<view class="flex">
						<image class="bg-white cu-avatar xl radius margin-right" :src="item.image"></image>
						<view>
							<view class="text-white" style="font-size:22rpx">{{ item.coupon_title }}</view>
							<view class="text-white text-xl">{{ item.coupon_price }}元代金券</view>
							<view class="text-white margin-tb-xs">满{{ item.use_min_price }}元使用</view>
							<view class="text-white text-xl">剩余有效次数：{{item.frequency}}次</view>
						</view>

					</view>
				    <view class="btn" v-if="item.status==0" @tap="useCoupon(item.id,index)">点击使用</view>
			        <view class="btn" v-if="item.status==1">已使用</view>
					<view class="btn" v-if="item.status==2">已过期</view>
				</view>
				
				<view class="bottom" v-if="item.status==0||item.status==2">
					<uni-count-down :day="item.days" :hour="item.hours" :minute="item.minutes" :second="item.seconds" color="#fff" background-color="#0096ff" border-color="#ebebeb" />
				</view>
				<view class="bottom" v-if="item.status==1">
					使用时间:{{ item.use_time }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getUserCoupon } from '@/api'
	import { useCoupon } from '@/api'
	import uniCountDown from '@/components/uni-count-down'
	export default {
		name: 'coupon',
		data () {
			return {
				list: [],
				params: {
					first: 1,
					limit: 20,
					id:'',
				}
			}
		},
		created () {
			this.getList()
		},
		components: { uniCountDown },
		methods: {
			getList () {
				uni.showLoading({ title: '载入中' })
				getUserCoupon(this.params).then(res => {
					uni.hideLoading()
					this.list = res.data.map(item => {
						let time = this.getYMDHMS(item._end_time)
						item.days = time.days
						item.hours = time.hours
						item.minutes = time.minutes
						item.seconds = time.seconds
						return item
					})
				})
			},
			useCoupon (id,index) {
                uni.showModal({
                    content: '请让老板点击确定按钮，该优惠券才可使用？',
                    success: rst => {
                        if (rst.confirm) {
                            uni.showLoading({ title: '载入中' })
                            this.params.id=id
                            useCoupon(this.params).then(res => {
								if(this.list[index]['frequency']==1){
                                    this.list[index]['status']=1;
                                    this.list[index]['frequency']=0;
                                    uni.hideLoading()
                                    uni.showToast({
                                        title: '保存成功'
                                    })
                                }else{
                                    this.list[index]['frequency']=this.list[index]['frequency']-1;
                                    uni.hideLoading()
                                    uni.showToast({
                                        title: '保存成功'
                                    })
                                }
                            })
                        }
                    }
                })
			},
            getYMDHMS(endTime) {
				let difftime = (new Date(endTime) - new Date()) / 1000
				let days = parseInt(difftime / 86400)
				let hours = parseInt(difftime / 3600) - 24 * days
				let minutes = parseInt(difftime % 3600 / 60)
				let seconds = parseInt(difftime % 60)	
				return ({days, hours, minutes, seconds})
            }			
		}
	}
</script>

<style lang="less">
.clist {
	.head {
		image {
			width: 100%;
			display: block
		}
	}
	.list {
		padding-bottom: 25rpx;
		.item {
			background-color: #0096ff;
			border-radius: 15rpx;
			margin: 25rpx 30rpx 0;
			overflow: hidden;
			.top {
				padding: 20rpx 20rpx 40rpx;
				.btn {
					background-color:#0096ff;
					color: white;
					box-shadow:0px 0px 10rpx var(--white);
					padding: 10rpx 15rpx;
					border-radius: 10rpx;
				}
			}
			.bottom {
				background-color:#ebebeb;
				position: relative;
				padding: 38rpx 20rpx;				
				&::after {
					content: '';
					position: absolute;
					left: 0;
					height: 40upx;
					width: 100%;
					background-image: radial-gradient(#ebebeb 0, #ebebeb 20upx, transparent 0upx);
					background-size: 40upx 40upx;
					background-position: 0 0;
					background-repeat: repeat-x;
					z-index: 1;
					}
				&::after {
					top: -12upx;
				}					
			}
		}
	}
}	
</style>
