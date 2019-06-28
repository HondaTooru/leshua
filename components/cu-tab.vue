<template>
	<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
		<view class="cu-item" :class="TabCur === item.type ? 'text-red cur':''" v-for="(item,index) in list" :key="index" @tap="tabSelect($event, item)" :data-id="index">
			{{ item.name }}
		</view>
	</scroll-view>	
</template>

<script>
	export default {
		props: {
			list: Array,
			act: {
				type: Number,
				default: -2
			}
		},
		created() {
			this.TabCur = this.act
			this.scrollLeft = (this.list.findIndex(item => item.type === this.act) - 1) * 60
		},
		data() {
			return {
				TabCur: 1,
				scrollLeft: 0
			};
		},
		methods: {
			tabSelect(e, item) {
				this.TabCur = item.type;
				this.scrollLeft = (+e.currentTarget.dataset.id - 1) * 60
				this.$emit('on-change', item.type)
			}
		}
	}	
</script>
