<template>
<span class="isgi-select">
	<select name="index">
		<option v-for="item in indexes" :value="item">{{ item}}</option>
	</select>
</span>
</template>
<script>
export default {

  props:{
      lang: {
          type: String,
          default: 'fr'
      }
      
  },
  data () {
		return {
  			indexes: new Array('aa', 'am', 'Kp', 'Dst', 'PC', 'AE',	'SC', 'SFE', 'Qdays', 'CKdays')
		}
  },
 
}
</script>
<style>
.isgi-select select{
min-width:150px;
}

</style>
