<i18n>
{
   "en":{
       "indices":	    "indices",
       "time_slot": 	"time slot",
       "output_format": "Output Format",
       "search": "Search",
       "reset": "Reset",
       "license": "License"
   },
   "fr":{
        "indices":	    "indices",
        "time_slot": 	"intervalle de temps",
        "output_format": "Format de sortie",
        "search": "Rechercher",
        "reset": "Initialiser",
         "license": "Licence"
   }
}
</i18n>

<template>	
	<div class="isgi-container">
	
	<form id="isgi-form" >
		<formater-search-box header-icon-class="fa fa-bars" :title="$t('indices')" :value="index" @input="index = $event.target.value" deployed="true">
			<formater-select width="260px" name="index" multiple="true" type="associative" :options="indices"  ></formater-select>
		</formater-search-box>
		<formater-search-box header-icon-class="fa fa-calendar" :title="$t('time_slot')" deployed="true" >	
			 <isgi-temporal-search :lang="lang" ></isgi-temporal-search>
		</formater-search-box>
		  <formater-search-box header-icon-class="fa fa-legal" :title="$t('license')" deployed="false" main-class="isgi-main-license"> 
		  <span> 
            <a href="https://creativecommons.org/licenses/by-nc/4.0/" title="Creative Commons NonCommercial 4.0" target="_blank">
            <img src="https://cdn.rawgit.com/terresolide/isgi-component-vjs/0.0.4/images/license_ccbync.png" height="60"/>
            </a>
        </span>
        </formater-search-box>
		<formater-search-box header-icon-class="fa fa-file" :title="$t('output_format')" :value="format" @input="format = $event.target.value">
			<formater-select width="260px"  name="format" options="IAGA2002"></formater-select>
	    </formater-search-box>
	    <a id="download" href="#" style="display=none;" download="wsigi_data.zip"></a>
	    <div class= "isgi-buttons" >
	    <input class="isgi-reset-button" type="button" :value="$t('reset')" @click="reset"/>
	    <input class="isgi-search-button" type="button" :value="$t('search')" @click="search" :disabled="serverStatus==READY?false:true" />
	    </div>
	</form>
	</div>
</template>



<script>
//console.log("script in form");


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
		  //default: 'http://api.formater/cds/isgi/data'
          default: 'http://formater.art-sciences.fr/cds/isgi/data'
          
      },
     indices:{
    	  default:"aa,am,Kp,Dst,PC,AE,SC,SFE,Qdays"
     }
      
  },
  data(){
      return {
                 
	              aerisThemeListener:null,
	              theme:null,
	              index:null,
	              format:null,
	              serverStatus:2,
	              from:null,
	              to:null,
	              SERVER_HS:0,
	              SEARCHING:1,
	              READY:2
      }
  },
 
  methods: {
	
    reset(){
    	  var e = new CustomEvent("aerisResetEvent", { detail: {}});
          document.dispatchEvent(e);
    },
    resetCharts( msg){
    	var e = new CustomEvent("chartResetEvent", { detail: { msg: msg}});
        document.dispatchEvent(e);
    },
    search(){

		 
		  var e = new CustomEvent("aerisSearchEvent", { detail: {}});
	      document.dispatchEvent(e);
	      
	      if( e.detail.error){
	          var event = new CustomEvent('aerisErrorNotificationMessageEvent', { 'detail': {message: this.$i18n.t('error')}});
	          document.dispatchEvent(event);
	          
	          return;
	      }else{
	
	          //var event = new CustomEvent('aerisErrorNotificationMessageEvent', { 'detail': {message: this.$i18n.t('service_closed')}});
	        //  document.dispatchEvent(event);
	          var result = this.callApi(e);
	          return;
	      }
	  },
	  prepareRequest( e){
		  var query = {};
		  var now = moment();
	      
          if(e.detail.end && e.detail.end < now.format("YYYY-MM-DD")){
        		  query.end = e.detail.end;
          }else{
        	  query.end = now.format("YYYY-MM-DD");
          }
          if(e.detail.start){
              query.start = e.detail.start;
          }else{
        	  query.start =  now.subtract(7, "days").format("YYYY-MM-DD");
          }
          if( this.from != query.start || this.to != query.end){
        	  this.resetCharts("date change");
          }
        //  this.from = query.start;
        //  console.log( this.from);
    	//  this.end = query.end;
          return query;
		  
	  },
	  callApi(e){	
		  //prepare request
		  var query = this.prepareRequest( e);
		  this.from = query.start;
		  this.to = query.end;
		  
		  this.call( query, e.detail.index,0);
	  },
	  /**
	   * recursive request to api.formater
	   */
	  call( query, indexes , i){
		  this.serverStatus = this.SEARCHING;
		  if( i < indexes.length){
			  var index = isgi.name2index( indexes[i]);
			  var url = this.url +"/"+ index;
	          var data = {
	        		  start: query.start,
	        		  end: query.end
	          };
	          
	         
	          data.index = indexes[i];
	        
	          var _this = this;

	          this.$http.get( url,{params: data, withCredentials: true}).then( 
	                  response => {
	                	
	                	  //add Timeout, to not have the same timestamp
	                	  //create trouble to isgi server
	                	  //check if no server error
	                	  if( response.body.error == "SERVER_ISGI_HS"){
	                		  _this.handleError( response , data);
	                		  return;
	                	  }else{
	                		  _this.handleSuccess( response, data);
		                	  var next = function(){
		                		    _this.call( query, indexes, i+1);
		                	  }
		                	  setTimeout( next, 10);
	                  	  }
	                  },
	                  response => {
	                	  _this.handleError( response , query);
	                	 
	                	 // var next = function(){
	                	//  _this.call( detail, i+1);
	                	  
	                	 // }
	                	//  setTimeout(next, 10);
	                  });
		  }else{
			  if( this.serverStatus != this.SERVER_HS){
				  this.serverStatus = this.READY;
			  }
		  }
	  },
		
		handleSuccess: function(rep, query){
			//if rep.body.error!!! this.handleError();
			 var event = new CustomEvent("findDataIndiceEvent", {detail: {result:rep.body , query: query}});
			 document.dispatchEvent(event);
	            
		},
		handleError: function(rep, query){
			this.serverStatus = this.SERVER_HS;
			if( rep && rep.body && rep.body.error){
				var error = rep.body.error;
			}else{
				var error = "SERVER_FORMATER_HS";
			}
			this.reset();
			 var event = new CustomEvent("errorSearchIndiceEvent", {detail: {error: error}});
	            document.dispatchEvent(event);
	            
		},
		handleTheme: function(theme) {
		  		this.theme = theme.detail
				this.ensureTheme()
		},
		  	
		ensureTheme: function() {
		  	if ((this.$el) && (this.$el.querySelector)) {
		  		var nodes = this.$el.querySelectorAll(".isgi-buttons input[type='button']");
		  	  var color1 = ftTools.shadeColor( this.theme.primary, 0.1); //lightcolor
              var color2 = ftTools.shadeColor( this.theme.primary, -.1); //dark color
              var theme = this.theme;
              [].forEach.call( nodes, function(node){
		  			node.style.background= theme.primary;
		  			node.style.borderColor= color1 + ' '+ color2 + ' ' + color2;
		  		})
		  	
		  		//this.$el.querySelector(".isgi-search-button").style.borderColor= color1 + ' '+ color2 + ' ' + color2;
		  	}
		 },
	  	 
	},
	
  created: function(){
      this.$i18n.locale = this.lang;
      //search user used for request
    
      this.aerisThemeListener = this.handleTheme.bind(this) 
      document.addEventListener('aerisTheme', this.aerisThemeListener);
 
  },
  mounted: function(){
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
	height:auto;
}
.isgi-container #isgi-form .isgi-main-license{
	text-align: center;
}
.isgi-container #isgi-form img{
  max-height:60px;
  width: auto;
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

.isgi-container input[type="button"]:disabled{
    opacity:0.5;
	cursor:not-allowed;
}

</style>
