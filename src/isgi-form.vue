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
	<div class="isgi-container">
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
	</div>
</template>



<script>

// @see https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
// @todo mettre ailleurs
function shadeColor2(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

// trouver une autre fonction
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
  
//end see and todo
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
		search(){
		    if( ! this.user ){
		        
		    }
		    var e = new CustomEvent("isgiSearchEvent", { detail: {user: this.reverse() }});
			document.dispatchEvent(e);

		   if(e.detail.error){
		       return;
		   }
		   console.log( build_query( e.detail ));
		   var url = this.url + '?' + build_query( e.detail );
		  
		   this.$el.querySelector('#download').href = url;
		 
		  
		   this.$el.querySelector('#download').click();
		   e.stopPropagation();
		    
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
		  		this.$el.querySelector(".isgi-search-button").style.background= this.theme.primary;
		  		var color1 = shadeColor2( this.theme.primary, 0.1); //lightcolor
		  		var color2 = shadeColor2( this.theme.primary, -.1); //dark color
		  		this.$el.querySelector(".isgi-search-button").style.borderColor= color1 + ' '+ color2 + ' ' + color2;
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
.isgi-container h1,
.isgi-container h2,
.isgi-container h3,
.isgi-container h4,
.isgi-container h5,
.isgi-container h6{
    color: #fff;
}
.isgi-container #isgi-form{
	width:280px;
	height:700px;
}

.isgi-container .isgi-buttons{
    margin-top:10px;
	text-align:right;
}
.isgi-container .isgi-buttons input[type="button"]{
/*	font-family:  "Dejavu serif";*/
	margin: 0px 0px 3px 7px;
  padding: 3px 12px;
  /*white-space: normal;*/
  text-align: center;
/*  background: #DD9946;*/
  border-width: 1px;
  border-style: solid;
  border-radius: 1px;
  font-size: 16px;
 /* font-weight:bold;*/
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