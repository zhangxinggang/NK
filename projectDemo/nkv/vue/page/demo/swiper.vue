<template>
	<div class="swiper-container" dir="rtl">
		<div class="swiper-wrapper">
			<div class="swiper-slide">
				<img src="../../assets/images/system/logo.png" alt="">
			</div>
			<div class="swiper-slide">
				<img src="../../../public/images/favIcon/LN.png" alt="">
			</div>
		</div>
	</div>
</template>
<script>
	import Swiper from "swiper";
	import "swiper/css/swiper.min.css";
	export default { 
		mounted() {
			var mySwiper = new Swiper('.swiper-container', {
				autoplay: true,
				loop: true,
				observer:true,
				observeParents:true,
				//分页器
				pagination:{
					el:'.swiper-pagination'
				},
				//前进和后退按钮
				navigation:{
					nextE1:'.swiper-button-next',
					prevE1:'.swiper-button-prev'
				}
			})
		}
	};
</script>

<style>

</style>
