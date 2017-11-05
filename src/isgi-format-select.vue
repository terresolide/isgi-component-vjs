<i18n>
{
   "en":{
       "output_format": "Output Format"
   },
   "fr":{
      "output_format": "Format de sortie"
   }
}
</i18n>

<template>
<div>
	<label>{{$t('output_format') }}</label>
	<select name="format">
		<option v-for="item in indexes" :value="item">{{ item}}</option>
	</select>
</div>
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
  			indexes: new Array('IAGA2002')
		}
  },
 
  methods: {
		message: function() {

			alert( this.$i18n.t('mynameis')+ " " +  this.$i18n.t(this.name) );
		}
	},
	
  created: function(){
      this.$i18n.locale = this.lang;
  },
  mounted: function(){
      
  }
}

</script>
<style>

</style>