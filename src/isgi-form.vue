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
	<form id="isgi_form" >
		<isgi-search-box header-icon-class="fa fa-bars" :title="$t('index')" :value="index" @input="index = $event.target.value">
			<isgi-select parent="isgi" name="index" options="['aa', 'am', 'Kp', 'Dst', 'PC', 'AE', 'SC', 'SFE', 'Qdays', 'CKdays']"  ></isgi-select>
		</isgi-search-box>
		<isgi-search-box header-icon-class="fa fa-calendar" :title="$t('time_slot')" deployed="true">	
			 <isgi-temporal-search></isgi-temporal-search>
		</isgi-search-box>
		<isgi-search-box header-icon-class="fa fa-file" :title="$t('output_format')" :value="format" @input="format = $event.target.value">
			<isgi-select parent="isgi" name="format" options="['IAGA2002']"></isgi-select>
	    </isgi-search-box>
	    <a id="download" href="#" style="display=none;" download="wsigi_data.zip"></a>
	    <input class="isgi-search-button" type="button" :value="$t('search')" @click="search"/>
	</form>
	</span>
</template>



<script>
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
	              user:null
          
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
		  	/*if ((this.$el) && (this.$el.querySelector)) {
		  		this.$el.querySelector(".dp-header").style.background=this.theme.primary
		  		this.$el.querySelector(".dp-day.day-selected").style.borderColor=this.theme.primary
		  		this.$el.querySelector(".dp-footer .today-button").style.color=this.theme.primary
		  		this.$el.querySelector(".dp-selectors #monthSelect").style.color=this.theme.primary
		  		this.$el.querySelector(".dp-selectors #yearSelect").style.color=this.theme.primary
		  	}*/
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
      if(this.info != null){
      	this.user = this.info;
      }else{
         
          this.$http.get('/user.txt', {}).then(response=>{ this.saveUser(response)},response=>{console.log("no user")});
      }
 
  },
  mounted: function(){
      console.log(this.index);
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