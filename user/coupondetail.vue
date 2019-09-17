<template>
	<view>
		<cu-custom bgColor="bg-gradual-red" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">优惠券详情</block>
		</cu-custom>		
		<block v-if="nodes">
			<view class="padding-sm bg-white">
				<rich-text :nodes="nodes"></rich-text>
			</view>			
		</block>
		<view class="bg-white">
			<empty-data></empty-data>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		name: 'conpuondetail',
		computed: {
			...mapGetters(['cdetail']),
			nodes () {
				const reg = /\<img/gi
				const str = '<img width="100%"'
				return this.cdetail.replace(reg, str)
			},
		},
		created() {
			console.log(this.cdetail)
		}
	}
</script>

<style>
</style>
