<template>
<div class="isgi-select">
	<select name="format">
		<option v-for="item in indexes" :value="item">{{ item}}</option>
	</select>
</div>
</template>
<script>
export default {

  data () {
		return {
  			indexes: new Array('IAGA2002')
		}
  }
}

</script>
<style>

</style>