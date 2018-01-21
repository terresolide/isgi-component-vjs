<i18n>
{
  "en": {
	  "indice":"indice"
  },
  "fr": {
	  "indice": "indice"
  }
}
</i18n>

<template>
<div class="isgi-chart" :class="{hidden: !data && !error, showBody: isdeployed}">
   <header class="box-heading"  @click="isdeployed = !isdeployed">
   <div class="box-title">
    <h4>{{$t("indice")}} {{indice}}</h4>
    </div>
     <div class="box-heading-buttons">
    <i class="chevron" :class="openIconClass"></i>
  </div>
   </header>
  <main>
  <div v-if="error">{{error}}</div>
  <div class="chart-container" v-else></div>
  </main>
</div>
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
      }
    
  }, 
 

   data () {
    return {
   		resetEventListener: null,
   		aerisThemeListener:null,
   		findDataIndiceEventListener:null,
   		windowResizeListener:null,
   		chart:null,
   		data:null,
   		width:null,
   		error:null,
   		colors: [],
   		infos:{
   			aa: { unit: "nT", description:{'fr':"", 'en':""}, url:"http://isgi.unistra.fr/aa.php"}
   		}
    }
  },

  
  
  methods: {
	  treatmentData( evt){
		  
	         var id = this.id;
	       
	         if( evt.detail.result.error ){
	        	 this.error = evt.detail.result.error;
	        	 this.data = null;
	        	 return null;
	         }
	         var data0 = evt.detail.result;
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
              return kp;
	  },
      createChart(evt){
         if( evt.detail.query.index != this.indice ){
        	 return;
         }
         var kp = this.treatmentData(evt);
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
             color3+';"><b>PCS</b></span>';
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
                 name: kp,
                 color: color2,
                 data: data["kp"]
                });
       
   
       	  break;
         case "aa":
         case "am":
             // 2 yAxis (left: linear indice (default), right: Kp in column)
            
             yAxis.push({ 
                 title: {
                     text: kp,
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
                 name: kp,
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
                       '<b>'+indice+'</b></span> (nT)'
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
		this.error = null;
		this.data = null;
		  
	},
	

  },
  destroyed() {
      document.removeEventListener('findDataIndiceEvent', this.findDataIndiceEventListener);
      this.findDataIndiceEventListener = null;
        document.removeEventListener('aerisResetEvent', this.resetEventListener);
       this.resetEventListener = null;

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
.isgi-chart header{
    margin:0 0 10px 0;
}
.isgi-chart header h4{
 color: #fff;
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
    background-color: var(--catalog-box-header-background-color, #f5f5f5);
    border: var(--catalog-box-header-border, none);
    cursor: pointer;
    }
    
    .isgi-chart.showBody .box-collapsable-part {
    display: block;
    transition: 0.3s
}
.isgi-chart.showBody .chevron {
    transform: rotate(180deg)
}
.isgi-chart .chevron {
    transition: 0.3s
}
    

</style>