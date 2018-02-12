/**
 * Template for isgi
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
    <a href="http://isgi.unistra.fr" :title="$t('isgi')">
    <img class="isgi-logo" src="http://isgi.unistra.fr/Images/logo_ISGI.gif" alt="ISGI"/>
    </a>
    </div>
    <div class="isgi-description" v-html="$t('description')">
    
    </div>
    </header>
    <formater-layout>
    
    <div class="formater-wrapper">
        <aside>
            <isgi-form :lang="lang" :indices="indices"></isgi-form>   
        </aside>
        <main>
            <isgi-chart :lang="lang" v-for="(indice, id) in indices" :indice="indice" :key="id" :width="mainWidth"  :id="id" ></isgi-chart>
        </main>
         </div>
        
     <footer>
    </footer>
    </formater-layout>

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
			indices: ['aa', 'am', 'Kp', 'Dst', 'PC', 'AE', 'Qdays', 'SC', 'SFE'/*, 'Qdays', 'CKdays'*/],
			windowResizeListener: null,
			windowScrollListener: null,
			aerisThemeListener:null,
			mainWidth:300
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
		
				var maxHeight = Math.round( wh - 60 ) +"px";

				this.$el.querySelector("aside").style.maxHeight = maxHeight;
				this.$el.querySelector("main").style.maxHeight = maxHeight;
				
			}
		},
		addWidth( evt){
			evt.detail.mainWidth = this.computeMainWidth();
			
		}
	},
//     computed:{
//     	mainWidth(){
//     		var left = this.$el.querySelector("aside").offsetWidth;
//     		return "width: 300px;";
//     	}
//     },
    created(){
        this.$i18n.locale = this.lang;
        this.windowScrollListener = this.computeMaxHeight.bind( this);
        window.addEventListener('scroll', this.windowScrollListener);
        this.windowResizeListener = this.resize.bind( this);
        window.addEventListener('resize', this.windowResizeListener);
        this.aerisThemeListener = this.addWidth.bind( this);
        document.addEventListener('aerisTheme', this.aerisThemeListener);
        if( isgi ) this.indices = isgi.indices();
    
        
    },
    mounted(){
    	this.computeMainWidth();
    	this.computeMaxHeight();
    	
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
    background-color:#fff;
    display: block;
	-webkit-box-flex: 1;
	-ms-flex: 1 1 auto;
	flex: 1 1 auto;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-orient: horizontal;
	-webkit-box-direction: normal;
	-ms-flex-direction: row;
	flex-direction: row;
	vertical-align:bottom;
	box-shadow: 0 2px 5px rgba(0,0,0,.2);
	 margin-bottom: 3px;
}
.isgi-layout > header img.isgi-logo{
    width:200px;
}
.isgi-layout > header div{
    display: block;
    vertical-align: bottom;
}
.isgi-layout > header div.isgi-description{
    margin-top:80px;
    margin-left:20px;
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
    }
</style>