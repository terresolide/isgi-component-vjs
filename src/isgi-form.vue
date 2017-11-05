<i18n>
{
   "en":{
       "start_time": 	"Start time",
       "end_time":  	"End time"
   },
   "fr":{
        "start_time": 	"Date de début",
        "end_time": 	"Date de fin"
   }
}
</i18n>

<template>
	
	<div class="isgi-container">
		<input type="hidden" name="user" value="user_formater" />
		<isgi-index-select></isgi-index-select>
		<isgi-input-date :label="$t('start_time')" name="StartTime" :lang="lang"></isgi-input-date>
		<isgi-input-date :label="$t('end_time')" name="EndTime" :lang="lang"></isgi-input-date>
		<isgi-format-select></isgi-format-select>
	</div>
</template>



<script>
export default {

  props:{
	  user:{
		  type:String,
		  default:''
	  },
      name: {
          type: String,
          default:'nobody'
      },
      lang: {
          type: String,
          default: 'fr'
      }
      
  },
  data () {
		return {
  			pseudo: 'Truc'
		}
  },
 
  methods: {
		message: function() {

			alert( this.$i18n.t('mynameis')+ " " +  this.$i18n.t(this.name) );
		},
		 handleTheme: function(theme) {
		  		this.theme = theme.detail
				this.ensureTheme()
		  	},
		  	
		  	ensureTheme: function() {
		  	/*if ((this.$el) && (this.$el.querySelector)) {
		  		this.$el.querySelector(".dp-header").style.background=this.theme.primary
		  		this.$el.querySelector(".dp-day.day-selected").style.borderColor=this.theme.primary
		  		this.$el.querySelector(".dp-footer .today-button").style.color=this.theme.primary
		  		this.$el.querySelector(".dp-selectors #monthSelect").style.color=this.theme.primary
		  		this.$el.querySelector(".dp-selectors #yearSelect").style.color=this.theme.primary
		  	}*/
		  	}
	},
	
  created: function(){
      this.$i18n.locale = this.lang;
    //  this.aerisThemeListener = this.handleTheme.bind(this) 
	 // document.addEventListener('aerisTheme', this.aerisThemeListener);
  },
  mounted: function(){
      
  }
}

</script>
<style>
.isgi-container label{
	min-width:200px;
}
.isgi-container input{
	min-width:200px;
}
isgi-form .isgi-container selet{
	min-width:200px;
}
</style>