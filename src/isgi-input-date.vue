

<template>
<div>
	<label>{{ label }}</label>
	<aeris-datepicker :for="'input#'+ name" format="YYYY-MM-DD" :lang="lang"></aeris-datepicker>
	<input :id="name" :name="name" />
		
</div>
</template>



<script>
export default {

  props:{
      lang: {
          type: String,
          default: 'fr'
      },
      label:{
    	  type: String,
    	  default: 'Date'
      },
      name:{
    	  type: String
      }
      
  },
  data () {
		return {
  			
		}
  },
 
  methods: {
		
	},
	
  created: function(){
     
  },
  mounted: function(){
      
  }
}

</script>
<style>

</style>