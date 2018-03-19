/**
 * Template for Isgi
 */
 <i18n>
{
   "en":{
        "isgi": "International Service of Geomagnetic Indices",
        "description":"<b>ISGI</b> is the Reference service of the International Association of Geomagnetism and Aeronomy (IAGA) for validation, dissemination and stewardship of geomagnetic indices (with the help of 6 ISGI-Collaborating-Institutes internationally spread) through its official Web portal. <br /><br /><b>ISGI</b> is an official French National Service of <b>CNRS-INSU</b> which is getting a double label, both in &laquo;Solid Earth&raquo; <b>TS‑ANO4</b> (National Observation in Magnetism) and in &laquo;Astronomy-Astrophysics&raquo; <b>AA‑ANO6</b> (Surveillance of the Sun and the Earth's Space Environment)."
      
   },
   "fr":{
         "isgi": "Service International des Indices Géomagnétiques",
          "description":"<b>ISGI</b> est le service de référence de l'Association Internationale de Géomagnétisme et Aéronomie (IAGA) pour la validation, la diffusion et la gestion des indices géomagnétiques (avec la collaboration de 6 Instituts Internationaux) à travers leur portail web. <br /><br /><b>ISGI</b> est le service officiel français du <b>CNRS-INSU</b> disposant d'une double étiquette, à la fois présent dans  &laquo;Terre Solide&raquo; <b>TS‑ANO4</b> (Observation National en Magnétisme) et dans  &laquo;Astronomie-Astrophysiques&raquo; <b>AA‑ANO6</b> (Surveillance du Soleil et de l'Espace Environnant la Terre)."
      
   }
}
</i18n>
<template>
<span class="isgi-layout">
  <header>
    <div>
    <a href="http://isgi.unistra.fr" :title="$t('isgi')" target="_blank">
    <img class="isgi-logo" src="https://rawgit.com/terresolide/isgi-component-vjs/master/images/logo_ISGI.gif" alt="ISGI"/>
    </a>
    </div>
    <div class="isgi-description" v-html="$t('description')">
    
    </div>
    </header>
    <formater-layout>
    
    <div class="formater-wrapper">
        <aside>
            <isgi-form :lang="lang" :indices="JSON.stringify(indices)" :url="url"></isgi-form>   
        </aside>
        <main>
        	
        	<isgi-error :lang="lang" :width="mainWidth"></isgi-error>
            <isgi-chart :lang="lang" v-for="(indice, id) in indices" :indice="indice" :key="id" :width="mainWidth"  :id="id" ></isgi-chart>
        </main>
         </div>
        
     <footer>
    </footer>
    </formater-layout>

    </span>
</template>
<script>


var Highcharts = require('highcharts');

import Isgi from './isgi-indice-module.js';
window.isgi = new Isgi(Highcharts);

export default {
	 props:{
	        lang: {
	            type:String,
	            default:'fr'
	        },
	        url:{
	        	type:String
	        }
	},
	data(){
		return{
			indices: ['aa', 'am', 'Kp', 'Dst', 'PC', 'AE', 'Qdays', 'SC', 'SFE'/*, 'Qdays', 'CKdays'*/],
			windowResizeListener: null,
			windowScrollListener: null,
			aerisThemeListener:null,
			mainWidth:300,
			theme:null
		}
	},
	methods:{
		resize(){
			
			this.computeMainWidth();
	         this.computeMaxHeight();
			var event = new CustomEvent('isgiResize', { detail:{mainWidth:this.mainWidth}});

			document.dispatchEvent(event);
		},
		computeMainWidth(){
			var width = this.$el.querySelector(".formater-wrapper").offsetWidth;
	    	width -= this.$el.querySelector("aside").offsetWidth;

	        this.mainWidth = width;
			
			 return width;
		},
		computeMaxHeight(){
			if( this.$el && this.$el.querySelector){
				//window height
				var wh = window.innerHeight;
				//position top
				//var position = this.$el.querySelector("formater-layout").getBoundingClientRect();
				//scroll
				//var scroll = document.body.scrollTop;
		
				var maxHeight = Math.round( wh -60 ) +"px";

				this.$el.querySelector(".formater-wrapper > aside").style.maxHeight = maxHeight;
				this.$el.querySelector(".formater-wrapper > main").style.maxHeight = maxHeight;
				
			}
		},
		addWidth( evt){
			evt.detail.mainWidth = this.computeMainWidth();
			this.styleMain(evt);
           
			
		},
		  	
		styleMain(evt) {
			if ((this.$el) && (this.$el.querySelector) ){
				var color =  ftTools.shadeColor( evt.detail.primary, 0.8);
				this.$el.querySelector(".formater-wrapper > main").style.background = color;	  		
			}
		  	
		},
	},

    created(){
        this.$i18n.locale = this.lang;
        this.windowScrollListener = this.computeMaxHeight.bind( this);
        window.addEventListener('scroll', this.windowScrollListener);
        this.windowResizeListener = this.resize.bind( this);
        window.addEventListener('resize', this.windowResizeListener);
        this.aerisThemeListener = this.addWidth.bind( this);
        document.addEventListener('aerisTheme', this.aerisThemeListener);
       if( isgi ) {
        	this.indices = isgi.indices();
        	isgi.setLang( this.lang);
        }
     
       
    
        
    },
    mounted(){
    	var event = new CustomEvent('aerisThemeRequest', {});
		document.dispatchEvent(event);
    	
    },
    destroyed(){
    	window.removeEventListener( 'scroll', this.windowScrollListener);
        this.windowScrollListener = null;
    	 window.removeEventListener( 'resize', this.windowResizeListener);
         this.windowResizeListener = null;
         document.removeEventListener('aerisTheme', this.aerisThemeListener);
         this.aerisThemeListener =null
    }
}
</script>
<style>
.isgi-layout > header{
position:relative;
    background-color:#fff;
    display: block;

	box-shadow: 0 2px 5px rgba(0,0,0,.2);
	 margin-bottom: 3px;
}
.isgi-layout > header img.isgi-logo{
   
    max-height:180px;
}
.isgi-layout > header div{
    display: block;
    vertical-align: bottom;
}
.isgi-layout > header div.isgi-description{
	position:absolute;
    bottom:5px;
    left:200px;
    padding-right: 20px;
	line-height: 1.1;
	padding-bottom: 20px;
    }
    .isgi-layout .formater-wrapper > aside{
    min-height:400px;
    overflow-y:auto;
    width:300px;
    overflow-x:hidden;
    }
    .isgi-layout .formater-wrapper > main{
    min-height:400px;
    overflow-y:auto;
    overflow-x:hidden;
    margin-bottom:20px;
    background:rgba(0,0,0,0.1);
    }
    @media screen and (max-width:850px){
    	.isgi-layout > header{
    		height: 250px;
    		max-height: 250px;
    	}
    }
</style>