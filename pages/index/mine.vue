<template>
	<view>
		<cu-head>
			<userAuth v-if="!userInfo"></userAuth>
			<view class="cu-avatar round xl bg-white" :style="{ backgroundImage: 'url('+avatar+')' }">
				<text class="avatar-text" v-if="!userInfo">LOGIN</text>
			</view>
			<view class="text-df padding-top-xl padding-bottom-sm flex justify-center flex-direction">
				<block v-if="userInfo">
					<view class="text-center">{{ userInfo.nickname }}</view>
					<view class="margin-top-sm">ID:{{ userInfo.uid }}</view>
					<view class="margin-top-sm" v-if="userInfo.superior">上级:{{userInfo.superior}}</view>
					<view class="margin-top-sm cu-tag bg-white">{{ userInfo.member_card }}</view>
					
				</block>
				<block v-else>
					<text class="text-xl text-bold">点击显示微信头像</text>
				</block>
			</view>		
		</cu-head>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				账户余额
				<text class="text-xl text-red text-bold padding-left-sm">{{ userInfo.now_money }}</text>
			</view>
			<view class="action">
				<button class="cu-btn bg-red shadow sm" @tap="toCash">去提现</button>
			</view>
		</view>
		<view class="list">
			<view class="item order">
				<navigator hover-class="none" url="/user/order/list?type=-2">
					<view><text class="cuIcon-text text-red padding-right-xs"></text>我的订单</view>
					<view>查看全部订单</view>
				</navigator>
				<view>
					<navigator hover-class="none" url="/user/order/list?type=0">
						<image src="/static/waitPay.png" class="icon"></image>
						<view class="text">待付款</view>
					</navigator>
					<navigator hover-class="none" url="/user/order/list?type=1">
						<image src="/static/waitSend.png" class="icon"></image>
						<view class="text">待发货</view>
					</navigator>
					<navigator hover-class="none" url="/user/order/list?type=2">
						<image src="/static/waitRecive.png" class="icon"></image>
						<view class="text">待收货</view>
					</navigator>
					<navigator hover-class="none" url="/user/order/list?type=3">
						<image src="/static/orderCom.png" class="icon"></image>
						<view class="text">已签收</view>
					</navigator>
					<!-- <navigator hover-class="none" url="/user/order/list?type=4">
						<image src="/static/orderCom.png" class="icon"></image>
						<view class="text">评论</view>
					</navigator> -->
				</view>
			</view>
			<view class="item">
				<navigator hover-class="none" url="/user/money"><view><text class="cuIcon-moneybagfill text-cyan padding-right-xs"></text>我的钱包</view></navigator>
			</view>
			<view class="item">
				<navigator hover-class="none" url="/user/address"><view><text class="cuIcon-location text-black padding-right-xs"></text>我的地址</view></navigator>
			</view>		
			<view @tap="showRule" class="flex flex-direction margin-left-sm margin-right-sm margin-top-xl">
				<button class="cu-btn lg bg-red"><text class="cuIcon-forwardfill"></text>派送员激活说明</button>
			</view>
		</view>
		<view class="cu-modal" :class="{ show: show }">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">派送员激活说明</view>
					<view class="action" @tap="show = false">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl"  style="text-align: left;">
					<rich-text :nodes="rule"></rich-text>
				</view>
			</view>
		</view>		
	</view>
</template>

<script>
	import cuHead from '@/components/head.vue'
	import { mapGetters, mapActions } from 'vuex'
	import {rulesd} from '@/api'
	export default {

		data () {
			return {
				show: false,
				params: {
					extract_type: 'weixin',
					money: 'money',
					name: '',
					weixin: ''
				},
				rule:'',
			}
		},
		components: {
			cuHead
		},
		created() {
			if (this.userInfo) this.getUserInfo()
			
		},
		computed: {
			...mapGetters(['userInfo']),
			avatar () {
				let AVATAR = this.userInfo ? this.userInfo.avatar : ''
				return AVATAR
			}
		},		
		methods: {
			...mapActions(['getUserInfo']),
			toCash () {
				uni.navigateTo({
					url: '/pages/index/cash'
				})
			},
			toList (item) {
				if (item.act) {
					uni.navigateTo({
						url: `/user/order/list?act=${item.act}`
					})					
				}
			},
			showRule () {
				rulesd().then(res => {
					this.rule = res.data.rule
					this.show = true
				})
			},
		}
	}
</script>

<style lang="less">
.list {
	padding-bottom: 120upx;
	.item {
			& > navigator {
				padding: 0 30upx;
				display: flex;
				justify-content: space-between;
				background-color:var(--white);
				height: 80upx;
				align-items: center;
				position: relative;
				& > view {
					&:nth-of-type(1) {
						display: flex;
						align-items: center;
						text {
							font-size: 50upx;
						}
					}
					&:nth-of-type(2) {
						padding-right:30upx;
						color: var(--gray)
					}
				}
				&:after {
					position: absolute;
					top: 0;
					right: 30upx;
					bottom: 0;
					display: block;
					margin: auto;
					width: 30upx;
					height: 30upx;
					color: #666;
					content: "\E6A3";
					text-align: center;
					font-size: 34upx;
					font-family: cuIcon;
					line-height: 30upx;				
				}
				&::before {
					position: absolute;
					content: '';
					left: 0;
					bottom: 0;
					width: 100%;
					height: 1px;
					-webkit-transform: scaleY(0.5);
					-ms-transform: scaleY(0.5);
					transform: scaleY(0.5);
					background-color: #f1f1f1;					
				}				
			}		
		& > view {
			display: flex;
			align-items: center;
			justify-content:center;
			padding: 20upx 0;
			overflow:hidden;
			background-color:var(--white);
			& > navigator{
				flex: 1;
				display: flex;
				align-items: center;
				justify-content:center;
				flex-direction: column;
				flex-flow: column;
				& > .icon {
					width: 50upx;
					height: 50upx;
				}
				& .text {
					font-size: 20upx;
					
				}
			}			
		}
		&.order {
			margin-bottom: 20upx;
		}
	}
}
</style>
