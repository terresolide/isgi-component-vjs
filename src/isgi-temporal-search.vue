<i18n>
{
  "en": {
	  "from": "from",
	  "to": "to"
  },
  "fr": {
	  "from": "de",
	  "to": "à"
  }
}
</i18n>

<template>
<span class="isgi-temporal-search">
<div class="isgi-input-group">
   <span class="right">{{$t('from')}}</span>
  <input id="from" v-model="from"  />
</div>
<aeris-datepicker for="input#from" :format="format" ></aeris-datepicker>
<div class="isgi-input-group">
	<span class="right">{{$t('to')}}</span>
	<input id="to" v-model="to">
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
    	errorMessage: null
    	
    }
  },
  
  updated: function() {
  },
  
  methods: {
    test: function(){
 
	     console.log('input data from');
	},
	handleReset: function() {
		 this.from=""
		 this.to=""
		  
	},
	  
	handleSearch: function(e) {
		var temporal = {};
		//v-model not working??
		this.from =  this.$el.querySelector('#from').value
		this.to =  this.$el.querySelector('#to').value
		
		var from = moment(this.from, this.format);
		var to = moment(this.to, this.format);
		  
		temporal.StartTime= from.isValid() ? from.format('YYYY-MM-DD') : '';
		temporal.EndTime = to.isValid() ? to.format('YYYY-MM-DD') : '';
		
		e.detail.temporal = temporal;
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




</style>