<i18n>
{
   "en":{
       "index": 		"index"
   },
   "fr":{
       "index": 		"index"
   }
}
</i18n>

<template>
<div class="isgi-select">
	<label id="isgi-label" for="index" >{{$t('index') }}</label>
	<select name="index">
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
  			indexes: new Array('aa', 'am', 'Kp', 'Dst', 'PC', 'AE',	'SC', 'SFE', 'Qdays', 'CKdays')
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
label{
  padding-left:26px;
    width:125px;
    text-transform: uppercase;
    display:inline-block;
	min-width:200px;
}
.isgi-label{
}
.isgi-select{
 border:1px dotted black;
}
select{
  width:200px;
}
</style>
