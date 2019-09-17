<template>
<view class="attrlist" :style="{ zIndex }" :class="{ show }" @touchmove.stop.prevent="" @tap.stop="$emit('on-close')">
	<view class="model flex flex-direction" @tap.stop=''>
		<view class="title solid-bottom shadow-lg">{{ title }}
		<view class="close text-black cuIcon-roundclosefill" @tap.stop="$emit('on-close')"></view>
		</view>
		<view class="contain flex-sub" :style="{ backgroundColor: bgColor }">
			<scroll-view scroll-y class="o" @scrolltolower="$emit('LoadMore')">
				<block v-if="hasList">
					<slot></slot>
				</block>
				<empty-data v-else></empty-data>
			</scroll-view>					
		</view>
	</view>
</view>	
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: ''
			},
			zIndex: {
				type: String,
				default: '996'
			},
			hasList: {
				type: Number,
				default: 0
			},
			bgColor: {
				type: String,
				default: '#fff'
			}
		}
	}
</script>

<style lang="less" scoped>
	.attrlist {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		top: 0;
		background-color: rgba(0,0,0,.6);
		z-index: 999;
		pointer-events: none;
		opacity: 0;
		transition-duration: .3s;
		will-change: opacity;
		.model {
			position: fixed;
			min-height: 70%;
			height: 70%;
			bottom: 0;
			left: 0;
			width: 100%;
			background-color: white;
			transform: translate3d(0, 100%, 0);
			will-change: transform;
			transition-duration: .3s;
			.title {
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				position: relative;
				.close {
					position: absolute;
					top: 0;
					right: 20upx;
					font-size: 44upx;
					margin:auto 0;
				}
			}
			.contain {
				overflow: hidden;
				.o {
					height: 100%;
				}
			}
		}
		&.show {
			opacity: 1;
			pointer-events: auto;
			.model {
				transform: translate3d(0, 0, 0);
			}
		}
	}	
</style>
