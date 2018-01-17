<i18n>
{
  "en": {
	  "from": "from",
	  "to": "to",
	  "inconsistent_dates":	"inconsistent dates",
	  "last_7_days":	"the last 7 days",
	  "equal_dates": "The end date should be greater than the start date",
	  "one_year":	"Download is limited to one year of data per request"
  },
  "fr": {
	  "from": "de",
	  "to": "à",
	  "inconsistent_dates":	"dates incohérentes",
	   "last_7_days":	"les 7 derniers jours",
	   "equal_dates": "la date finale doit être supérieure à la date initiale",
	   "one_year":	"Le téléchargement est limité à une année de données"
  }
}
</i18n>

<template>
<span class="isgi-chart" :class="index==null? 'hidden':''">
  <header><h2>Indice {{index}}</h2></header>
</span>
</template>

<script>
export default {
	 
  props: {
  	lang:  {
      type: String,
      default: 'fr'
    },
    index:{
    	type: String,
    	default:null
    }
    
  }, 
  destroyed: function() {
	  document.removeEventListener('findIndiceEvent', this.findIndiceEventListener);
      this.findIndiceEventListener = null;
		document.removeEventListener('aerisResetEvent', this.resetEventListener);
		this.resetEventListener = null;

		 document.removeEventListener('aerisTheme', this.aerisThemeListener);
         this.aerisThemeListener = null;
  },
  
  created: function () {
		this.$i18n.locale = this.lang;
		this.findIndiceEventListener = this.buildChart.bind(this) 
        document.addEventListener('findIndiceEvent', this.findIndiceEventListener);
		this.resetEventListener = this.handleReset.bind(this) 
		document.addEventListener('aerisResetEvent', this.resetEventListener);
		this.aerisThemeListener = this.handleTheme.bind(this) 
	    document.addEventListener('aerisTheme', this.aerisThemeListener);
  },


  
  computed: {
  	
  },

   data () {
    return {
   		resetEventListener: null,
   		aerisThemeListener:null,
   		findIndiceEventListener:null,
   		
    	
    }
  },
 
  updated: function() {
  },
  
  methods: {
	  buildChart: function(){
		  
	  },
    
	handleReset: function() {
		
		  
	},
	

	 
      handleTheme: function(theme) {
	  		this.theme = theme.detail;
			this.ensureTheme();
	  },
	  	
	 ensureTheme: function() {
	  	if ((this.$el) && (this.$el.querySelector)) {
	  		var color3 =  this.$shadeColor( this.theme.primary, 0.8);
	  		var nodes= this.$el.querySelectorAll(".isgi-input-group");
	  		[].forEach.call(nodes, function(node){
	  		    node.style.backgroundColor = color3;
	  		})
	  		
	  	}
	 },
  }
 
}
</script>

<style>

.isgi-temporal-search {
    display: block
}

.isgi-temporal-search .right {
	min-width: 40px;
	border-right: 1px solid #fff;
	box-sizing: border-box;
    display: block;
    height: 100%;
    text-align: center;
}

.isgi-temporal-search .error-message {
    font-size: 12px;
    color: red
}
.isgi-temporal-search .error-message::first-letter{
	text-transform:uppercase;
}
.isgi-temporal-search .isgi-input-group {
    border: none;
     /* Default color from aeris */
    background-color: rgba(172,220,238,0.3); 
}

.isgi-temporal-search .isgi-input-group input {
	border: none;
	background-color: transparent;
	padding: 0 5px;
	outline: none;
}
	
.isgi-temporal-search .isgi-input-group span:first-letter {
   text-transform: uppercase;
}
.isgi-temporal-search .isgi-input-group{
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin: 5px 0;
    width: 100%;
    height: 25px;
    line-height: 25px;
    overflow: hidden;
}
.isgi-temporal-search .isgi-checkbox{
	padding:2px 0;
}
.isgi-temporal-search .isgi-checkbox input{
 	margin-top:0;
 	margin-right:4px;
 }
.isgi-temporal-search .isgi-checkbox label::first-letter{
	text-transform: uppercase;
}


</style>