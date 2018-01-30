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
<span class="isgi-temporal-search">
 <div class="isgi-input-group isgi-checkbox" > 
  <input type="checkbox" v-model="last" >
  <label>{{$t('last_7_days')}}</label> 
 </div>
<div class="isgi-input-group" v-show="!last">
   <span class="right">{{$t('from')}}</span>
  <input id="from" v-model="from" @click="errorMessage = null" @change="dateChange"/>
</div>
<aeris-datepicker for="input#from" :format="format" @change="dateChange"></aeris-datepicker>
<div class="isgi-input-group" v-show="!last">
	<span class="right">{{$t('to')}}</span>
	<input id="to" v-model="to" @click="errorMessage = null" @change="dateChange">
</div>
  <aeris-datepicker for="input#to" :format="format" @change="dateChange"></aeris-datepicker> 
<span class="error-message" v-if="errorMessage">{{errorMessage}}</span>

</span>
</template>

<script>
export default {
	 
  props: {
  	lang:  {
      type: String,
      default: 'fr'
    },
    format:{
        type: String,
        default:'DD/MM/YYYY'
    }
  }, 
  destroyed: function() {
		document.removeEventListener('aerisResetEvent', this.resetEventListener);
		this.resetEventListener = null;
		document.removeEventListener('aerisSearchEvent', this.searchEventListener);
		this.searchEventListener = null;
		 document.removeEventListener('aerisTheme', this.aerisThemeListener);
         this.aerisThemeListener = null;
  },
  
  created: function () {
		this.$i18n.locale = this.lang
		this.resetEventListener = this.handleReset.bind(this) 
		document.addEventListener('aerisResetEvent', this.resetEventListener);
		this.searchEventListener = this.handleSearch.bind(this) 
		document.addEventListener('aerisSearchEvent', this.searchEventListener);
		this.aerisThemeListener = this.handleTheme.bind(this) 
	    document.addEventListener('aerisTheme', this.aerisThemeListener);
  },


  
  computed: {
  	
  },

   data () {
    return {
        searchEventListener: null,
   		resetEventListener: null,
   		aerisThemeListener:null,
    	from:null,
    	to:null,
    	errorMessage: null,
    	last:true
    	
    }
  },
 
  updated: function() {
  },
  
  methods: {
      test: function(){
          console.log("value changed");
      },
	handleReset: function() {
		 this.from=""
		 this.to=""
		  
	},
	dateChange: function(evt){
		this.$emit("input");
	},
	  
	handleSearch: function(e) {
		if( this.last ){
		    return;
		}
		//v-model not working??
		var from_old = this.from;
		var to_old = this.to;
		
		this.from =  this.$el.querySelector('#from').value;
		this.to =  this.$el.querySelector('#to').value;
		
		
		
		var from = moment(this.from, this.format);
		var to = moment(this.to, this.format);
		if( from > to ){
		    this.errorMessage = this.$i18n.t('inconsistent_dates');
		   	e.detail.error = true;
	    }
		
		if( from == to ){
		    this.errorMessage = this.$i18n.t('equal_dates');
		   	e.detail.error = true;
	    }
		   
		var diff = to.diff( from )/ 31536000000;
		
		
		if( diff >=1){
		    this.errorMessage = this.$i18n.t('one_year');
		   	e.detail.error = true;
		}
		var str_from = from.isValid() ? from.format('YYYY-MM-DD') : '';
		var str_to = to.isValid() ? to.format('YYYY-MM-DD') : '';
		
		if(str_from && str_to){
			if( this.from != from_old || this.to != to_old){
	            var event = new CustomEvent( "chartResetEvent",{ detail: {}});
	            document.dispatchEvent(event);
	        }
			e.detail.start = str_from;
			e.detail.end = str_to;
		}	
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