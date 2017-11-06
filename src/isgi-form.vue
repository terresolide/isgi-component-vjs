<i18n>
{
   "en":{
       "time_slot": 	"time slot",
       "output_format": "Output Format",
       "search": "search"
   },
   "fr":{
        "time_slot": 	"intervalle de temps",
        "output_format": "Format de sortie",
        "search": "rechercher"
   }
}
</i18n>

<template>
	
	<span class="isgi-container">
		<input type="hidden" name="user" value="cnrs-formater610" />
		<isgi-search-box header-icon-class="fa fa-bars" :title="$t('index')" >
			<isgi-index-select></isgi-index-select>
		</isgi-search-box>
		<isgi-search-box header-icon-class="fa fa-calendar" :title="$t('time_slot')" deployed="true">	
		 <isgi-temporal-search></isgi-temporal-search>
		</isgi-search-box>
		<isgi-search-box header-icon-class="fa fa-file" :title="$t('output_format')" >	<isgi-format-select></isgi-format-select></isgi-search-box>
	    <input class="isgi-search-button" type="button" :value="$t('search')" @click="search"/>
		
	</span>
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
		search:function(){
		    console.log("search");
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


.isgi-container .isgi-search-button{
 background-color: #ff0000;
}

.isgi-container input[type="button"]{
	margin: 0px 7px 3px 0;
  padding: 3px 12px;
  white-space: normal;
  text-align: center;
  background: #DD9946;
  border-width: 1px;
  border-style: solid;
  border-radius: 1px;
  font-size: 16px;
  line-height:1.7;
  border-color: #e5b171 #cb8025 #cb8025;
  color: #fff;
  text-decoration: none;
  text-shadow: 0 -1px 1px #a0651d, 1px 0 1px #cb8025, 0 1px 1px #cb8025, -1px 0 1px #a0651d;
  vertical-align: top;
  cursor: pointer;
  pointer-events: auto;
  box-sizing: border-box;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
}
.isgi-container input[type="button"]:first-letter{
	text-transform: uppercase;
}

.isgi-container .isgi-select select,
.isgi-container .isgi-temporal-search .isgi-input-group{
    background-color: rgba(221,153,70,0.2); 
}

</style>