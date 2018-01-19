<i18n>
{
  "en": {
	  "from": "from",
	  "to": "to",
	  "inconsistent_dates":	"inconsistent dates",
	  "last_7_days":	"the last 7 days",
	  "equal_dates": "The end date should be greater than the start date",
	  "one_year":	"Download is limited to one year of data per request"
  },
  "fr": {
	  "from": "de",
	  "to": "à",
	  "inconsistent_dates":	"dates incohérentes",
	   "last_7_days":	"les 7 derniers jours",
	   "equal_dates": "la date finale doit être supérieure à la date initiale",
	   "one_year":	"Le téléchargement est limité à une année de données"
  }
}
</i18n>

<template>
<div class="isgi-chart" :class="{hidden: !data}">
   <header class="box-heading">
    <h4>{{$t("indice")}} {{indice}}</h4>
   </header>
  <main>
  <div v-if="error">{{error}}</div>
  <div class="chart-container"></div>
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
    	console.log(key);
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
    }
    
  }, 


  methods:{
	 
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
   		error:null
    }
  },
 
  
  
  methods: {
	  treatmentData( evt){
		  
	         var id = this.id;
	         if(evt.detail.error){
	        	 this.error = event.detail.error;
	        	 this.data = event.detail.error;
	        	 return null;
	         }
	         var data0 = evt.detail.result;
	         var data = new Array();
             data["indice"] = new Array();
            
             var coord = new Array();
           
 
             //traitement des collections
              var indice = this.indice;
              var kp = get_Kp_name( data0.collection[0]);
              if(kp){
                  data.kp = new Array();
              }
              data0.collection.forEach( function( item){
                  var date = Date.parse(item.DATE+" "+item.TIME); 
                   data["indice"].push([date, item[indice]]);
                   if( kp){
                       data["kp"].push([date, kp_to_value( item[kp])]);
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
        // var id = this.id;
         //var data0 = evt.detail.result;
         
       
        
         
                
//                  var data = new Array();
//                  data["indice"] = new Array();
                
//                  var coord = new Array();
               
     
//                  //traitement des collections
//                   var indice = this.indice;
//                   var kp = get_Kp_name( data0.collection[0]);
//                   if(kp){
//                 	  data.kp = new Array();
//                   }
//                   data0.collection.forEach( function( item){
//                       var date = Date.parse(item.DATE+" "+item.TIME); 
//                        data["indice"].push([date, item[indice]]);
//                        if( kp){
//                            data["kp"].push([date, kp_to_value( item[kp])]);
//                        }

//                   });
//                 
                  var data = this.data;
                  var indice = this.indice;
                  var id = this.id;
                  
                  var color = Highcharts.getOptions().colors[id];
  
                  var color1 = this.$shadeColor( color, -.2);
                  var color2 = this.$shadeColor( color, 0.1);
                  
                  var yAxis = new Array();
                  var series = new Array();
                  switch( indice){
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
                 // Primary yAxis
                 
                  /*var yAxis = [{ 
			            title: {
			                useHTML: true,
			                text: '<span style="color:'+ color1+'">'+
			                '<b>'+indice+'</b></span> (nT)'
			            }
			        }] ;*/
               /*  if( kp ){
                	
                	 data["kp"] = new Array();
                	 // add opposite secondary yAxis
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
				            opposite: true })
      
                 }
                 
                 data0.collection.forEach( function( item){
                	    var date = Date.parse(item.DATE+" "+item.TIME); 
                         data["indice"].push([date, item[indice]]);
                         if( kp){
                        	 data["kp"].push([date, kp_to_value( item[kp])]);
                         }

                 });*/
                 /*var series = [{
                	 type: 'line',
                     name: indice,
                     color: color1,
                     zIndex: 2,
                     data: data["indice"]
                 }]
                 if(kp){
                	 series.push({
                		    type: 'column',
             		        name: kp,
             		        color: color2,
             		        yAxis: 1,
             		        zIndex: 1,
             		        data: data["kp"]
             		       });
                 }*/
                    // console.log(value);
                var id = this.id;
                var container = this.$el.querySelector(".chart-container");
                console.log("draw chart w=" + this.width);
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
                       //  text: "indice " + indice,
                         text:"",
                       //  align: "left"
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
                     yAxis: yAxis,/*[{
                         title: {
                             text: "",
                             margin:10,
                             lineColor:'#666'
                         },
                         labels:{
                             style:{
                                 color:'#333',
                                 fontSize:'10px'
                             }
                         }}
                      
                     ],*/
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
                     series: series/* [{
                         name: indice,
                         showInLegend:false,
                         color: Highcharts.getOptions().colors[id],
                         data: data["indice"] //[1, 0, 4]
                     }]*/
                 });
              
          
      },
    resize( evt){
    	  
    	  console.log( "resize");
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

        // document.removeEventListener('aerisTheme', this.aerisThemeListener);
       //  this.aerisThemeListener = null;
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
       // document.addEventListener('aerisTheme', this.aerisThemeListener);
       // this.windowResizeListener = this.resize.bind( this);
        document.addEventListener('isgiResize', this.windowResizeListener);
  },
 
}
</script>

<style>
.isgi-chart.hidden{
    display:none;
}
.isgi-chart{
    margin-left:15px;
    margin-bottom:10px;
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
    margin:0;
}
.isgi-chart header h4{
 color: #666;
 padding:0;
    text-shadow: 1px 1px 1px rgba(26, 20, 20, 1);
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

</style>