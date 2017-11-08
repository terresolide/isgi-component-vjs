<i18n>
{
   "en":{
       "time_slot": 	"time slot",
       "output_format": "Output Format",
       "search": "Search"
   },
   "fr":{
        "time_slot": 	"intervalle de temps",
        "output_format": "Format de sortie",
        "search": "Rechercher"
   }
}
</i18n>

<template>	
	<span class="isgi-container">
	<form id="isgi-form" >
		<isgi-search-box header-icon-class="fa fa-bars" :title="$t('index')" :value="index" @input="index = $event.target.value">
			<isgi-select parent="isgi" name="index" options="['aa', 'am', 'Kp', 'Dst', 'PC', 'AE', 'SC', 'SFE', 'Qdays', 'CKdays']"  ></isgi-select>
		</isgi-search-box>
		<isgi-search-box header-icon-class="fa fa-calendar" :title="$t('time_slot')" deployed="true">	
			 <isgi-temporal-search :lang="lang"></isgi-temporal-search>
		</isgi-search-box>
		<isgi-search-box header-icon-class="fa fa-file" :title="$t('output_format')" :value="format" @input="format = $event.target.value">
			<isgi-select parent="isgi" name="format" options="['IAGA2002']"></isgi-select>
	    </isgi-search-box>
	    <a id="download" href="#" style="display=none;" download="wsigi_data.zip"></a>
	    <div class= "isgi-buttons" >
	    <input class="isgi-search-button" type="button" :value="$t('search')" @click="search"/>
	    </div>
	</form>
	</span>
</template>



<script>

var lightenDarkenColor =  function(col,amt) {
    col = parseInt(col,16);
    return (((col & 0x0000FF) + amt) | ((((col>> 8) & 0x00FF) + amt) << 8) | (((col >> 16) + amt) << 16)).toString(16);
}
var build_query = function (obj, num_prefix, temp_key) {

    var output_string = []

    Object.keys(obj).forEach(function (val) {

      var key = val;

      num_prefix && !isNaN(key) ? key = num_prefix + key : ''

      var key = encodeURIComponent(key.replace(/[!'()*]/g, escape));
      temp_key ? key = temp_key + '[' + key + ']' : ''

      if (typeof obj[val] === 'object') {
        var query = build_query(obj[val], null, key)
        output_string.push(query)
      }

      else {
        var value = encodeURIComponent(obj[val].replace(/[!'()*]/g, escape));
        output_string.push(key + '=' + value)
      }

    })

    return output_string.join('&')

  }
export default {

  props:{
	  info:{
	      type:String,
	      default:null
	  },
      lang: {
          type: String,
          default: 'fr'
      },
      url:{
          type: String,
          default: 'http://service.test/isgi.php'
      }
      
  },
  data(){
      return {
                  index:'aa',
	              format:'IAGA2002',
	              test:'rein' ,
	              user:null,
	              aerisThemeListener:null,
	              theme:null
      }
  },
  methods: {
		search:function(){
		    if( ! this.user ){
		        
		    }
		    var e = new CustomEvent("isgiSearchEvent", { detail: {user: this.reverse() }});
			document.dispatchEvent(e);

		   if(e.detail.error){
		       return;
		   }
		   console.log( build_query( e.detail ));
		   var url = this.url + '?' + build_query( e.detail );
		  // var url = "http://isgi.unistra.fr/ws?user=cnrs-formater610&index=aa&format=IAGA2002";
		  
		   this.$el.querySelector('#download').href = url;
		 
		   this.$el.querySelector('#download').click();
		   e.stopPropagation();
		   // this.$http.get( url, e.detail).then(
		   //        response=>{ this.handelSuccess(response)},
		   //        response=>{ this.handleError(response)}); 
		},
		isValid: function (query){
		    
		},
		handelSuccess: function(rep){
		    
		},
		handleError: function(rep){
		    
		},
		handleTheme: function(theme) {
		  		this.theme = theme.detail
				this.ensureTheme()
		},
		  	
		 ensureTheme: function() {
		  	if ((this.$el) && (this.$el.querySelector)) {
		  		this.$el.querySelector(".isgi-search-button").style.background=this.theme.primary;
		  		//this.$el.querySelector(".isgi-search-button").style.borderColor= 
		  	}
		 },
	  	 reverse: function(){
	  	      var n= '';
	  	      for( var i=this.user.length-5; i >= 0; i--){
	  	          n       +=     this.user.charAt(i);
	  	      }
	  	  	  return n;
	  	  },
	  	  saveUser: function(rep){
	  	      this.user = rep.body;
	  	  }
	},
	
  created: function(){
      this.$i18n.locale = this.lang;
      //search user used for request
      if(this.info != null){
      	this.user = this.info;
      }else{
         
          this.$http.get('/user.txt', {}).then(response=>{ this.saveUser(response)},response=>{console.log("no user")});
      }
      this.aerisThemeListener = this.handleTheme.bind(this) 
      document.addEventListener('aerisTheme', this.aerisThemeListener);
 
  },
  mounted: function(){
      console.log(this.index);
      var event = new CustomEvent('aerisThemeRequest', {});
    	document.dispatchEvent(event);
  },
  destroyed: function(){
      document.removeEventListener('aerisTheme', this.aerisThemeListener);
     this.aerisThemeListener = null;
  }
}

</script>

<style>
.isgi-container #isgi-form{
	width:280px;
}

.isgi-container .isgi-buttons{
    margin-top:10px;
	text-align:right;
}
.isgi-container .isgi-buttons input[type="button"]{
	font-family:  "Dejavu serif";
	margin: 0px 0px 3px 7px;
  padding: 3px 12px;
  /*white-space: normal;*/
  text-align: center;
/*  background: #DD9946;*/
  border-width: 1px;
  border-style: solid;
  border-radius: 1px;
  font-size: 16px;
  font-weight:bold;
  line-height:1.7;
  border-color: #e5b171 #cb8025 #cb8025;
  color: #fff;
  text-decoration: none;
 /* text-shadow: 0 -1px 1px #a0651d, 1px 0 1px #cb8025, 0 1px 1px #cb8025, -1px 0 1px #a0651d;*/
  vertical-align: top;
  cursor: pointer;
  pointer-events: auto;
  box-sizing: border-box;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
}
.isgi-container input[type="button"]::first-letter{
	text-transform: uppercase;
}

.isgi-container .isgi-select select,
.isgi-container .isgi-temporal-search .isgi-input-group{
    background-color: rgba(221,153,70,0.2); 
}

</style>