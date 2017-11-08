<i18n>
{
  "en": {
	  "from": "from",
	  "to": "to",
	  "inconsistent_dates":	"inconsistent dates",
	  "last_7_days":	"the last 7 days"
  },
  "fr": {
	  "from": "de",
	  "to": "à",
	  "inconsistent_dates":	"dates incohérentes",
	   "last_7_days":	"les 7 derniers jours"
  }
}
</i18n>

<template>
<span class="isgi-temporal-search">
 <div class="isgi-input-group isgi-checkbox" > 
  <input type="checkbox" v-model="last" >
  <label>{{$t('last_7_days')}}</label> 
 </div>
<div class="isgi-input-group" v-if="!last">
   <span class="right">{{$t('from')}}</span>
  <input id="from" v-model="from" @click="errorMessage = null" />
</div>
<aeris-datepicker for="input#from" :format="format" ></aeris-datepicker>
<div class="isgi-input-group" v-if="!last">
	<span class="right">{{$t('to')}}</span>
	<input id="to" v-model="to" @click="errorMessage = null">
</div>
  <aeris-datepicker for="input#to" :format="format"></aeris-datepicker> 
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
		document.removeEventListener('isgiResetEvent', this.resetEventListener);
		this.resetEventListener = null;
		document.removeEventListener('isgiSearchEvent', this.searchEventListener);
		this.searchEventListener = null;
  },
  
  created: function () {
		this.$i18n.locale = this.lang
		this.resetEventListener = this.handleReset.bind(this) 
		document.addEventListener('isgiResetEvent', this.resetEventListener);
		this.searchEventListener = this.handleSearch.bind(this) 
		document.addEventListener('isgiSearchEvent', this.searchEventListener);
  },

  mounted: function() {
  },
  
  computed: {
  	
  },

   data () {
    return {
        searchEventListener: null,
   		resetEventListener: null,
    	from:null,
    	to:null,
    	errorMessage: null,
    	last:true
    	
    }
  },
  
  updated: function() {
  },
  
  methods: {

	handleReset: function() {
		 this.from=""
		 this.to=""
		  
	},
	

	  
	handleSearch: function(e) {
		if( this.last ){
		    return;
		}
		//v-model not working??
		 
		this.from =  this.$el.querySelector('#from').value
		this.to =  this.$el.querySelector('#to').value
		
		var from = moment(this.from, this.format);
		var to = moment(this.to, this.format);
		if( from > to ){
		    this.errorMessage = this.$i18n.t('inconsistent_dates');
		   	e.detail.error = true;
	    }
		   
		var str_from = from.isValid() ? from.format('YYYY-MM-DD') : '';
		var str_to = to.isValid() ? to.format('YYYY-MM-DD') : '';
		
		if(str_from && str_to){
			e.detail.StartTime= str_from;
			e.detail.EndTime = str_to;
		}
		
		
	  }
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