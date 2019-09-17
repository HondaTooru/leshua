<template>
	<view :class="['alertRich', { show: show }]">
		<view class="statusbar"></view>
		<view class="dailog" :style="{ top: height }">
			<scroll-view scroll-y>
				<rich-text :nodes="source"></rich-text>
			</scroll-view>
			<view class="close" @click="$emit('on-close')">
				<image src="/static/close_w.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			source: String,
			show: Boolean
		},
		computed: {
			height () {
				return `${this.CustomBar + uni.upx2px(40)}px`
			}
		}
	}
</script>

<style lang="less">
.alertRich {
	visibility: hidden;
	opacity: 0;
	will-change: opacity;
	transition-duration: .4s;
	&.show {
		visibility: visible;
		opacity: 1;
	}
}
.alertRich, .alertRich > view.statusbar {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
    
}	
.alertRich{
	z-index: 666;
	& > view {
		&.statusbar {
			background:rgba(0,0,0,.5);
		}
		&.dailog {
			background:white;
			position: absolute;
			border-radius: 20upx;
			padding: 15upx;
			left: 40upx;
			bottom: 240upx;
			right: 40upx;
			& > scroll-view {
				height: 100%;
			}
			& > .close {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: -80upx;
				width: 60upx;
				height: 60upx;
				image {
					display: block;
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}

</style>
