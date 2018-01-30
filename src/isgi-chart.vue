<i18n> { 
    "en": { 
        "indice":"indice", 
        "about_indice": "About this indice", 
        "download": "Download", 
        "delete": "Remove", 
        "reduce": "Reduce",
        "extend": "Extend" }, 
     "fr": { 
        "indice": "indice", 
        "about_indice": "A propos de cet indice", 
        "download": "Télécharger", 
        "delete": "Supprimer",
        "reduce": "Réduire", 
        "extend": "Déployer" } 
        } 
</i18n>

<template> <span class="isgi-chart"
	:class="{hidden: !data && !error, showBody: isdeployed}"> <header
		class="box-heading">
		<div class="box-title">
			<h4>{{$t("indice")}} {{indice}}</h4>
		</div>
		<div class="box-heading-buttons">
			<a :href="isgi_url" v-if="isgi_url" :title="$t('download')"> <i
				class="fa fa-download isgi-white"></i>
			</a> <a :href="infos[indice].url" :title="$t('about_indice')"
				target="_blank"> <i class="fa fa-question isgi-white"></i>
			</a> <span :title="isdeployed? $t('reduce'):$t('extend')"
				@click="isdeployed = !isdeployed"> <i class="chevron"
				:class="openIconClass"></i>
			</span> <span :title="$t('delete')" @click="handleReset"> <i
				class="fa fa-close"></i>
			</span>
		</div>
	</header> <main class="box-collapsable-part">
	<div class="error" v-if="error">{{error}}</div>
	<div class="chart-container" v-else></div>
	</main>
</span> </template>

<script>

export default {
	 
  props: {
  	lang:  {
      type: String,
      default: 'fr'
    },
    indice:{
    	type: String,
    	default:null
    },
    id:{
    	type: Number,
    	default:0
    },
    openIconClass:  {
        type: String,
        default: 'fa fa-chevron-down'
      },
     deployed:{
    	 type: Boolean,
    	 default: true
     }
  }, 
 

  data () {
    return {
   		resetEventListener: null,
   		chartResetEventListener: null,
   		aerisThemeListener:null,
   		findDataIndiceEventListener:null,
   		windowResizeListener:null,
   		chart:null,
   		data: null,
   		mainWidth:null,
   		infos:null,
   		collection:null,
   		width:null,
   		error:null,
   		isgi_url:null,
   		isdeployed:true,
    }
  },
  methods: {
	  treatmentData( evt){
	         var id = this.id;
	         
	         if( evt.detail.result.error ){
	        	 this.error = evt.detail.result.error;

	        	 return false;
	         }
	         if(isgi){
		         this.isgi_url = isgi.getUrl(evt.detail);
	             this.collection = new isgi.Collection( evt.detail, this.indice, this.id);
	             if( this.collection){
	            	   this.data = this.collection.data;
		         }
	         }
	  },
      createChart(evt){
         if( evt.detail.query.index != this.indice ){
        	 return;
         }
         this.treatmentData(evt);
         if(this.collection && !this.error && this.collection.error){
        	 this.error = this.collection.error;
        	 return;
         }
       
         if( this.collection && !this.collection.error){
        	  var container = this.$el.querySelector(".chart-container");
        	   this.collection.createChart( container, this.width);
        	   this.resize();
         }
         return;
      },

      resize( evt){
    	   switch( this.indice){
           case "aa":
           case "am":
        	   if( this.collection && this.collection.kp ){
        		   var margin = 15;
        	   }else{
        		   var margin = 65;
        	   }
               break;
           default:
               var margin = 65;
           }
    	   if( evt){
    		    this.mainWidth = evt.detail.mainWidth;
    	   }
           this.width = this.mainWidth -margin;
    	 
           if(this.collection){
           
    	    this.collection.resizeChart( this.width);
    	   }
      },
      handleTheme(theme) {
	  		this.theme = theme.detail;
			this.ensureTheme();
			if( theme.detail.mainWidth){
				this.resize( theme);
			}
	  },
	  	
	  ensureTheme() {
			if ((this.$el) && (this.$el.querySelector)) {
			    this.$el.querySelector(".box-heading").style.backgroundColor = this.theme.primary;	  		
			}
	  	
	  },
	  handleReset() {
		    this.data = null;
		    this.error = null,
		    this.isgi_url = null;
		    this.isdeployed = true;
		    if( this.collection){
				this.collection.destroy();
		    }
	  },
  },
  destroyed() {
			document.removeEventListener('findDataIndiceEvent', this.findDataIndiceEventListener);
			this.findDataIndiceEventListener = null;
			document.removeEventListener('aerisResetEvent', this.resetEventListener);
			this.resetEventListener = null;
			document.removeEventListener('chartResetEvent', this.chartResetEventListener);
			this.chartResetEventListener = null;
			
			document.removeEventListener('aerisTheme', this.aerisThemeListener);
			this.aerisThemeListener = null;
			window.removeEventListener( 'isgiResize', this.windowResizeListener);
			this.windowResizeListener = null;
			// load isgi script if not exists
// 			 var recaptchaScript = document.createElement('script')
//     recaptchaScript.setAttribute('src', 'https://code.highcharts.com/highcharts.src.js');
//     document.head.appendChild(recaptchaScript);
//     var recaptchaScript = document.createElement('script')
//     recaptchaScript.setAttribute('src', '/src/isgi-indice.js');
//     document.head.appendChild(recaptchaScript);
  },
  
  created() {
	        this.$i18n.locale = this.lang;
	        this.infos = isgi.infos;
	        this.findDataIndiceEventListener = this.createChart.bind(this) ;
	        document.addEventListener('findDataIndiceEvent', this.findDataIndiceEventListener);
	        this.resetEventListener = this.handleReset.bind(this) 
	        document.addEventListener('aerisResetEvent', this.resetEventListener);
	        this.chartResetEventListener = this.handleReset.bind(this) 
	        document.addEventListener('chartResetEvent', this.chartResetEventListener);
	        this.aerisThemeListener = this.handleTheme.bind(this) 
	        document.addEventListener('aerisTheme', this.aerisThemeListener);
	        this.windowResizeListener = this.resize.bind( this);
	        document.addEventListener('isgiResize', this.windowResizeListener);
  },
  mounted(){
			var event = new CustomEvent('aerisThemeRequest', {});
			document.dispatchEvent(event);
  }
 
}
</script>

<style>
.isgi-chart.hidden {
	display: none;
}

.isgi-chart {
	margin-left: 15px;
	margin: 5px 5px 5px 10px;
	box-sizing: border-box;
	position: relative;
	display: block;
	transition: transform 4s ease-out;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.isgi-chart .chart-container {
	width: 100%;
	max-width: 100%;
}

.isgi-chart .error {
	padding: 10px;
	color: red;
}

.isgi-chart header {
	margin: 0 0 10px 0;
}

.isgi-chart header h4 {
	color: #fff !important;
	padding: 0;
	margin: 0;
	text-shadow: 0px 0px 1px rgba(26, 20, 20, 1);
}

.isgi-chart header h4::first-letter {
	text-transform: uppercase;
}

.isgi-chart .box-heading {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	color: #fff !important;
	background-color: #f5f5f5;
	border: none;
}

.isgi-chart .box-collapsable-part {
	max-height: 0;
	height: 0;
	display: none;
	transition: 0.3s
}
/* .isgi-chart .box-collapsable-part .chart-container{
        display:none;
    }
    .isgi-chart.showBody .box-collapsable-part .chart-container{
        display:block;
    }*/
.isgi-chart.showBody .box-collapsable-part {
	max-height: 300px;
	height: auto;
	display: block;
	transition: 0.3s
}

.isgi-chart.showBody .chevron {
	transform: rotate(180deg);
}

.isgi-chart .chevron {
	transition: 0.3s
}

.isgi-chart .box-heading-buttons a i.isgi-white {
	color: #fff;
}

.isgi-chart .box-heading-buttons span {
	width: 20px;
	text-align: center;
	padding-left: 3px;
}

.isgi-chart .box-title {
	cursor: pointer;
}

.isgi-chart .box-heading-buttons i {
	text-align: left;
	cursor: pointer;
}

.isgi-chart .box-heading-buttons i:hover {
	margin-top: 1px;
	font-size: 1.1rem;
}
</style>