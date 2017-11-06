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
  <input id="StartTime" v-model="StartTime">
</div>
<aeris-datepicker for="input#StartTime" format="YYYY-MM-DD"></aeris-datepicker>
	<div class="isgi-input-group">
		<span class="right">{{$t('to')}}</span>
  <input id="EndTime" v-model="EndTime">
  </div>
  <aeris-datepicker for="input#EndTime" format="YYYY-MM-DD"></aeris-datepicker> 
<span class="error-message" v-if="errorMessage">{{errorMessage}}</span>

</span>
</template>

<script>
export default {
	 
  props: {
  	lang:  {
      type: String,
      default: 'fr'
    }
  },
  
  watch: {
    lang (value) {
	      this.$i18n.locale = value
    }
  },
  
  destroyed: function() {
	  document.removeEventListener('aerisCatalogueResetEvent', this.catalogueResetListener);
	  this.catalogueResetListener = null;
	  document.removeEventListener('aerisCatalogueSearchEvent', this.aerisCatalogueSearchEventListener);
	  this.aerisCatalogueSearchEventListener = null;
  },
  
  created: function () {
   this.$i18n.locale = this.lang
   this.catalogueResetListener = this.handleCatalogueReset.bind(this) 
   document.addEventListener('aerisCatalogueResetEvent', this.catalogueResetListener);
   this.aerisCatalogueSearchEventListener = this.handleSearch.bind(this) 
   document.addEventListener('aerisCatalogueSearchEvent', this.aerisCatalogueSearchEventListener);
  },

  mounted: function() {
  },
  
  computed: {
  	
  },

   data () {
    return {
    	aerisCatalogueSearchEventListener: null,
    	catalogueResetListener: null,
    	from:null,
    	to:null,
    	errorMessage: null
    	
    }
  },
  
  updated: function() {
  },
  
  methods: {
	  handleCatalogueReset: function() {
		  this.from=""
		  this.to=""
		  
	  },
	  
	  handleSearch: function(e) {
		var temporal = {};
	    var from = moment(this.from, this.format);
	    var to = moment(this.to, this.format);

	        temporal.from = from.isValid() ? from.format('YYYY-MM-DD') : '';
	        temporal.to = to.isValid() ? to.format('YYYY-MM-DD') : '';

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
    background-color: rgba(172,220,238,0.3);
}

.isgi-temporal-search .isgi-input-group input {
	border: none;
	background-color: transparent;
	padding: 0 5px;
	outline: none;
}
	
.isgi-temporal-search .isgi-input-group aeris-datepicker {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 999;
}

.isgi-temporal-search .isgi-input-group aeris-datepicker2 {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 999;
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