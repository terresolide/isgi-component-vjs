<i18n>
{
  "en": {
	  "indice":"indice",
	  "about_indice": "About this indice",
	  "download": "Download",
	  "delete": "Remove",
	  "reduce": "Reduce",
	  "extend": "Extend"
  },
  "fr": {
	  "indice": "indice",
	   "about_indice": "A propos de cet indice",
      "download": "Télécharger",
      "delete": "Supprimer",
      "reduce": "Réduire",
      "extend": "Déployer"
  }
}
</i18n>

<template>
<span class="isgi-chart" :class="{hidden: !data && !error, showBody: isdeployed}">
   <header class="box-heading" >
   <div class="box-title">
    <h4>{{$t("indice")}} {{indice}}</h4>
    </div>
     <div class="box-heading-buttons">
	    <a :href="isgi_url" v-if="isgi_url" :title="$t('download')"> 
	           <i class="fa fa-download isgi-white"></i>
	    </a>
	     <a :href="infos[indice].url"  :title="$t('about_indice')" target="_blank"> 
               <i class="fa fa-question isgi-white"></i>
        </a>
	    <span :title="isdeployed? $t('reduce'):$t('extend')"  @click="isdeployed = !isdeployed">
	           <i class="chevron" :class="openIconClass"  ></i>
	    </span>
	    <span :title="$t('delete')" @click="handleReset">
	           <i class="fa fa-close" ></i>
	    </span>
  </div>
   </header>
  <main class="box-collapsable-part">
  <div class="error" v-if="error">{{error}}</div>
  <div class="chart-container" v-else></div>
  </main>
</span>
</template>

<script>
function kp_to_value( kp ){
	if(typeof kp != "string"){
		return 0;
	}
	var num = parseInt( kp.charAt(0));
     
	switch( kp.charAt(1)){
		case "+": 
			num += 0.333;
			break;
		case "-":
			num -= 0.333;
			break;
	}
	
	return num;
}
function get_Kp_name( obj ){
    for(var key in obj){
    	if( /^Kp[a-z]?$/.test( key)){
    		return key;
    	}
    }
    return null;
}
Array.prototype.get= function( name ){
    var i=0;
    find = false;
    while( !find && i< this.length){
        if( this[i].name == name){
            find = this[i].content;
        }
        i++;
    }
    return find;
}

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
   		data:null,
   		width:null,
   		error:null,
   		isgi_url:null,
   		kp:null,
   		colors: [],
   		isdeployed:true,
   		infos:{
   			aa: { unit: "nT", url:"http://isgi.unistra.fr/indices_aa.php"},
   			am: { unit: "nT", url:"http://isgi.unistra.fr/indices_am.php"},
   			Kp: { unit: "", url:"http://isgi.unistra.fr/indices_kp.php"},
   			Dst: { unit: "nT", url:"http://isgi.unistra.fr/indices_dst.php"},
   			Dst: { unit: "nT", url:"http://isgi.unistra.fr/indices_dst.php"},
   			PC: { unit: "mV/m", url:"http://isgi.unistra.fr/indices_pc.php"},
   			AE: { unit: "nT", url:"http://isgi.unistra.fr/indices_ae.php"},
   			Qdays: {unit: "", url:"http://isgi.unistra.fr/events_qdays.php"}
   			
   			
   		}
    }
  },

  
  
  methods: {
	  treatmentData( evt){
		  
	         var id = this.id;
	       
	         if( evt.detail.result.error ){
	        	 this.error = evt.detail.result.error;
	        	 this.data = null;
	        	 return false;
	         }
	         var data0 = evt.detail.result;
	         this.isgi_url = data0.meta.get("isgi_url");
	         var data = new Array();
	         if( this.indice == "PC"){
	        	 data["PCN"] = new Array();
	        	 data["PCS"] = new Array();
	         }else{
             	data["indice"] = new Array();
	         }
 
             //traitement des collections
              var indice = this.indice;
              var kp = get_Kp_name( data0.collection[0]);
              if(kp){
                  data.kp = new Array();
              }
             
              data0.collection.forEach( function( item){
                  var date = Date.parse(item.DATE+" "+item.TIME); 
                  if( indice == "PC"){
                	  if(item.PCS){
                		  data["PCS"].push([date, item.PCS]);
                	  }
                	  if(item.PCN){
                		  data["PCN"].push([date, item.PCN]);
                	  }
                  }else{
	                   data["indice"].push([date, item[indice]]);
	                   if( kp){
	                       data["kp"].push([date, kp_to_value( item[kp])]);
	                   }
                  }

              });
              this.data = data;
              this.kp = kp;
              return true;

	  },
      createChart(evt){
         if( evt.detail.query.index != this.indice ){
        	 return;
         }
         this.treatmentData(evt);
      	if( this.data == null){
      		return;
      	}
         var data = this.data;
         
         var indice = this.indice;
         var id = this.id;
         
         var color = Highcharts.getOptions().colors[id];

         var color1 = this.$shadeColor( color, -.2);
         var color2 = this.$shadeColor( color, 0.1);
         var color3 = "#ff0000";
         var yAxis = new Array();
         var series = new Array();
         switch( indice){
         case "PC":
        	 var html = '<span style="color:'+ color1+'">'+
             '<b>PCN</b></span> / <span style="color:'+
             color3+';"><b>PCS</b></span> (' + this.infos.PC.unit+ ')';
        	 yAxis.push({ 
                     title: {
                        useHTML: true,
                        text: html
                         
                     }/*,
                     tickInterval:3,
                     max: 9*/});
           	  series.push({
                     type: 'line',
                     name: 'PCN',
                     color: color1,
                     data: data["PCN"]
                    });
//            	yAxis.push({ 
//                 title: {
//                     text: 'PCS',
//                     style: {
//                         color: color3,
//                         fontWeight: 'bold'
//                     }
//                 },
//                opposite: true
//                /* tickInterval:3,
//                 max: 9*/});
      	  series.push({
                type: 'line',
                name: 'PCS',
                color: color3,
                data: data["PCS"]
               });
        	 
        	 break;
         case "Kp":
       	  // only 1 yAxis in column
       	  yAxis.push({ 
                 title: {
                     text: indice,
                     style: {
                         color: color2,
                         fontWeight: 'bold'
                     }
                 },
                 tickInterval:3,
                 max: 9});
       	  series.push({
                 type: 'column',
                 name: this.kp,
                 color: color2,
                 data: data["kp"]
                });
       
   
       	  break;
         case "aa":
         case "am":
             // 2 yAxis (left: linear indice (default), right: Kp in column)
            
             yAxis.push({ 
                 title: {
                     text: this.kp,
                     style: {
                         color: color2,
                         fontWeight: 'bold'
                     }
                 },
                 minorTickInterval: 2,
                 tickLength: 10,
                 max: 9,
                 opposite: true });
             series.push({
                 type: 'column',
                 name: this.kp,
                 color: color2,
                 yAxis: 1,
                 zIndex: 1,
                 data: data["kp"]
                });
            
         default:
             // only 1 yAxis linear
              yAxis.unshift({ 
                   title: {
                       useHTML: true,
                       text: '<span style="color:'+ color1+'">'+
                       '<b>'+indice+'</b></span> (' + this.infos[indice].unit +')'
                   }
               });
            series.unshift({
              type: 'line',
              name: indice,
              color: color1,
              zIndex: 2,
              data: data["indice"]
           });
         
         }
        
         var id = this.id;
         var container = this.$el.querySelector(".chart-container");
         
          this.chart = Highcharts.chart(container, {
           
              chart:{
             	   height:230,
             	   width: this.width,
             	   defaultSeriesType: 'areaspline',
             	   plotBorderColor: '#666666',
                    plotBorderWidth: 1
             // marginBottom: (value==="F")? 45 : 15
              },
              title: {
                  text:"",
                  align: "float"
              },
              legend: {
                  enabled: false
              },
              plotOptions: {
                  series: {
                      pointPadding: 0,
                      groupPadding: 0,
                      borderWidth: 1,
                      shadow: true
                  }
              },
              xAxis: {
                  type: 'datetime',
                  lineColor:'#666',
                  tickLength: 5,
                  dateTimeLabelFormats: { // don't display the dummy year
                     millisecond: '%H:%M:%S.%L',
                      second: '%H:%M:%S',
                      minute: '%H:%M',
                      hour: '%H:%M',
                      day: '%e %b %Y',
                      week: '%e. %b',
                      month: '%b %y',
                      year: '%Y'
                  },
                  
                  events: {
                      //setExtremes: syncExtremes
                  },
                  crosshair: true,
                  labels:{
                     // enabled:value==="F"
                  }
              },
              yAxis: yAxis,
              tooltip: {
                  formatter: function() {
                      var s =  Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x) ;

                      this.points.forEach(function(point, i) {
                          s += '<br/><span style="color:'+ point.series.color +'">\u25AC</span> '+ point.series.name +': ' ;
                          if (point.series.type=='column') {
                              if ((point.y - Math.floor(point.y))==0) { s+= Math.floor(point.y) +'o'; }
                              if (((point.y - Math.floor(point.y))>0) && ((point.y - Math.floor(point.y))<0.4)) { s+= Math.floor(point.y) +'+'; }
                              if ((point.y - Math.floor(point.y))>0.6) { s+= Math.round(point.y) +'-'; }
                          } else {
                              s += point.y ;
                          }
                      });

                      return s;
                  },
                  shared: true,
                  crosshairs: [true, false, false]
              },
              series: series
          });
             
          //var height = this.chart.height
         // this.chart.setSize( this.width, height)
          
      },
    resize( evt){
    	   switch( this.indice){
           case "aa":
           case "am":
               var margin = 15;
               break;
           default:
               var margin = 65;
           }
           this.width = evt.detail.mainWidth -margin;
    	  if(!this.chart){
    		  return;
    	  }
    	  var height = this.chart.height
    
    	    this.chart.setSize( this.width, height, true);
      },
      handleTheme: function(theme) {
	  		this.theme = theme.detail;
			this.ensureTheme();
			if( theme.detail.mainWidth){
				this.resize( theme);
			}
	},
	  	
	ensureTheme: function() {
	  	if ((this.$el) && (this.$el.querySelector)) {
	  		//this.$el.querySelector(".box-heading h4").style.color = this.theme.primary;
	  		this.$el.querySelector(".box-heading").style.backgroundColor = this.theme.primary;
	  		
	  			}
	  	
	 },
	handleReset() {
	    this.data = null;
	    this.error = null,
	    this.isgi_url = null;
	    this.isdeployed = true;
	    if( this.chart ){
			this.chart.destroy();
		    this.chart = null;
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
  },
  
  created: function () {
        this.$i18n.locale = this.lang;
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
.isgi-chart.hidden{
    display:none;
}
.isgi-chart{
    margin-left:15px;
    margin:5px 5px 5px 10px;
    box-sizing: border-box;
position: relative;
display: block;


transition: transform 4s ease-out;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.isgi-chart .chart-container{
    width:100%;
    max-width:100%;
}
.isgi-chart .error{
    padding:10px;
    color:red;
}
.isgi-chart header{
    margin:0 0 10px 0;
}
.isgi-chart header h4{
 color: #fff !important;
 padding:0;
 margin:0;
    text-shadow: 0px 0px 1px rgba(26, 20, 20, 1);
}
.isgi-chart header h4::first-letter{
    text-transform:uppercase;
 
}
.isgi-chart .box-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
     color: #fff !important;
    background-color:  #f5f5f5;
    border:  none;
   
    }
    .isgi-chart .box-collapsable-part {
    max-height:0;
    height:0;
    display:none;
    transition: 0.3s
    }
   /* .isgi-chart .box-collapsable-part .chart-container{
        display:none;
    }
    .isgi-chart.showBody .box-collapsable-part .chart-container{
        display:block;
    }*/
    .isgi-chart.showBody .box-collapsable-part {
    max-height:300px;
    height:auto;
    display: block;
    transition: 0.3s
}
.isgi-chart.showBody .chevron {
    transform: rotate(180deg);
}
.isgi-chart .chevron {
    transition: 0.3s
}
.isgi-chart .box-heading-buttons a i.isgi-white{
    color:#fff;
}
.isgi-chart .box-heading-buttons span{
    width: 20px;
    text-align:center;
    padding-left:3px;
}
.isgi-chart .box-title{
    cursor:pointer;
}
.isgi-chart .box-heading-buttons i{
  
    text-align:left;
     cursor: pointer;
}
.isgi-chart .box-heading-buttons i:hover {
margin-top:1px;
font-size:1.1rem;
}


</style>