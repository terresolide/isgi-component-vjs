/**
 * Template for isgi
 */
 <i18n>
{
   "en":{
    "SERVER_ISGI_HS": "The ISGI server is actually shut down.<br />Please try again later.",
    "SERVER_FORMATER_HS": "The ForM@Ter server is actually shut down.<br />Please try again later."
   },
   "fr":{
   "SERVER_ISGI_HS": "Le service ISGI est actuellement éteint.<br />Veuillez rééssayer ultérieurement.",
    "SERVER_FORMATER_HS": "Le serveur de ForM@Ter est actuellement éteint.<br />Veuillez rééssayer ultérieurement."
   }
}
</i18n>
<template>
<span class="isgi-error" v-show="hasError">
   <div v-html="error"></div>

   
  </div>
</span>
</template>
<script>
export default {
	 props:{
	        lang: {
	            type:String,
	            default:'fr'
	        }
    },
    data(){
        return{
        	hasError:false,
        	errorListener:null,
        	error:''
        }
    },
	computed:{
		
	},
	
	methods:{
		handleError( evt ){
			this.hasError = true;
			this.error = this.$i18n.t(evt.detail.error);
		
		}
		
    },
    created(){
        this.$i18n.locale = this.lang; 
        this.errorListener = this.handleError.bind(this);
        document.addEventListener("errorSearchIndiceEvent", this.errorListener);
    },
    destroyed(){
    	document.removeEventListener('errorSearchIndiceEvent', this.errorListener);
        this.errorListener = null;
    }
}
</script>
<style>
.isgi-error div{
	 margin : 10px;
	 padding:10px;
	 color: darkred;
	 font-size:1.5em;
	 border:3px solid;
	 background: #fff;
	 text-align:center;
}
</style>