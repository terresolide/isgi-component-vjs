<i18n>
{
   "en":{
       "time_slot": 	"time slot",
       "output_format": "Output Format"
   },
   "fr":{
        "time_slot": 	"intervalle de temps",
        "output_format": "Format de sortie"
   }
}
</i18n>

<template>
	
	<div class="isgi-container">
		<input type="hidden" name="user" value="user_formater" />
		<isgi-search-box header-icon-class="fa fa-bars" :title="$t('index')" >	<isgi-index-select></isgi-index-select></isgi-search-box>
	
		<isgi-search-box header-icon-class="fa fa-calendar" :title="$t('time_slot')" >	<isgi-temporal-search></isgi-temporal-search></isgi-search-box>
		<isgi-search-box header-icon-class="fa fa-file-o" :title="$t('output_format')" >	<isgi-format-select></isgi-format-select></isgi-search-box>
	
		
	</div>
</template>



<script>
export default {

  props:{
	  user:{
		  type:String,
		  default:''
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

.isgi-container input{
	min-width:200px;
}



.isgi-select select{
    font-size: inherit; /* inherit size from .custom-dropdown */
    padding: .5em; /* add some space*/
    margin: 0; /* remove default margins */
}



@supports (pointer-events: none) and
      ((-webkit-appearance: none) or
      (-moz-appearance: none) or
      (appearance: none)) {

    .isgi-select {
        position: relative;
        display: inline-block;
        vertical-align: middle;
    }

    .isgi-select select{
        padding-right: 2.5em; /* accommodate with the pseudo elements for the dropdown arrow */
        border: 0;
        border-radius: 1px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;  
        width:260px;  
    }

    .isgi-select::before,
    .isgi-select::after {
        content: "";
        position: absolute;
        pointer-events: none;
    }

    .isgi-select::after { /*  Custom dropdown arrow */
        content: "\25BC";
        height: 1em;
        font-size: .625em;
        line-height: 1;
        right: 1.2em;
        top: 50%; margin-top: -.5em;
    }

    .isgi-select::before { /*  Custom dropdown arrow cover */
        width: 2em;
        right: 0; top: 0; bottom: 0;
        border-radius: 0 3px 3px 0;
    }

    .isgi-select select[disabled] {
        color: rgba(0,0,0,.3);
    }

    .isgi-select select[disabled]::after {
        color: rgba(0,0,0,.1);
    }


    /* FF only temp fix */
    @-moz-document url-prefix() {
        .isgi-select select             { padding-right: .9em }
        .isgi-select--large select { padding-right: 1.3em }
        .isgi-select--small select { padding-right: .5em }
    }
}
/*.isgi-container .isgi-select select{
	min-width:200px;
}

.isgi-select {
   background: url(http://i62.tinypic.com/15xvbd5.png) no-repeat 96% 0;
   height: 29px;
   overflow: hidden;
   width: 260px;
}
.isgi-select::after{
font-family:FontAwesome;
content:"\f0d7";
}
.isgi-container .isgi-select select {
   background: transparent;
   border: none;
   font-size: 14px;
   height: 29px;
   padding: 5px; 
   width: 260px;
}

.isgi-select{
   background: url(http://i62.tinypic.com/2e3ybe1.jpg) no-repeat right center;
   height: 34px;
   width: 260px;
}

.isgi-container .isgi-select select {
   border: 1px solid #ccc;
   font-size: 16px;
   height: 34px;
   width: 260px;
}*/
</style>