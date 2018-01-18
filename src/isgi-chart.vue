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
<span class="isgi-chart" >
  <header><h2 style="color:#000;margin-top:0;">Indice {{indice}}</h2></header>
  <main>
  <div class="chart-container"></div>
  </main>
</span>
</template>

<script>
function kp_to_value( kp ){
	var num = parseInt( kp.substring(0,1));
	if(kp.length>1){
		switch( kp.substring(1,1)){
			case "+": 
				num += 0.333;
				break;
			case "-":
				num -= 0.333;
				break;
		}
	}
	return num;
}
function get_Kp_name( obj ){
    for(var key in obj){
    	console.log(key);
    	if( /^Kp[a-z]{1}$/.test( key)){
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
   	
   		
    	
    }
  },
 
  
  
  methods: {
	
      createChart(evt){
         if( evt.detail.query.index != this.indice ){
        	 return;
         }
         var id = this.id;
         var data0 = evt.detail.result;
         var container = this.$el.querySelector(".chart-container");
       
      //   var dataType = data0.meta.get("Data Type");
       //  var interval = this.intervalType(data0.meta.get("Data Interval Type"), dataType);
        
         //this.createChartTitle( dataType, data0.collection[0].DATE, data0.collection[ data0.collection.length-1].DATE);
         
                
                 var data = new Array();
                 data["indice"] = new Array();
                
                 var coord = new Array();
               
     
                 //traitement des collections
                  var indice = this.indice;
                  var kp = get_Kp_name( data0.collection[0]);
                  console.log( "kp = " + kp)
                  var color = Highcharts.getOptions().colors[id];
                  console.log(color);
                  var color1 = this.$shadeColor( color, -.2);
                  var color2 = this.$shadeColor( color, 0.1);
                  console.log( color1);
                  console.log(color2);
                 // Primary yAxis
                  var yAxis = [{ 
			            title: {
			                useHTML: true,
			                text: '<span style="color:'+ color1+'">'+
			                '<b>'+indice+'</b></span> (nT)'
			            }
			        }] ;
                 if( kp ){
                	
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
                 console.log(Highcharts.getOptions().colors[id]);
                 data0.collection.forEach( function( item){
                	    var date = Date.parse(item.DATE+" "+item.TIME); 
                         data["indice"].push([date, item[indice]]);
                         if( kp){
                        	 data["kp"].push([date, kp_to_value( item[kp])]);
                         }

                 });
                 var series = [{
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
                 }
                    // console.log(value);
                var id = this.id;
                 var mychart = Highcharts.chart(container, {
                  
                     chart:{
                    	   height:230,
                    	   plotBorderColor: '#666666',
                           plotBorderWidth: 1
                    // marginBottom: (value==="F")? 45 : 15
                     },
                     title: {
                         text: "indice " + indice,
                         align: "left"
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
                                 s += '<br/><span style="color:'+ point.series.color +'">\u25AC</span>'+ point.series.name +': ' ;
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
    
	handleReset: function() {
		
		  
	},
	

	 
      handleTheme: function(theme) {
	  		this.theme = theme.detail;
			this.ensureTheme();
	  },
	  	
	 ensureTheme: function() {
	  	if ((this.$el) && (this.$el.querySelector)) {
	  		var color3 =  this.$shadeColor( this.theme.primary, 0.8);
	  		var nodes= this.$el.querySelectorAll(".isgi-input-group");
	  		[].forEach.call(nodes, function(node){
	  		    node.style.backgroundColor = color3;
	  		})
	  		
	  	}
	 },
  },
  destroyed: function() {
      document.removeEventListener('findDataIndiceEvent', this.findDataIndiceEventListener);
      this.findDataIndiceEventListener = null;
        document.removeEventListener('aerisResetEvent', this.resetEventListener);
        this.resetEventListener = null;

         document.removeEventListener('aerisTheme', this.aerisThemeListener);
         this.aerisThemeListener = null;
  },
  
  created: function () {
        this.$i18n.locale = this.lang;
        this.findDataIndiceEventListener = this.createChart.bind(this) ;
        document.addEventListener('findDataIndiceEvent', this.findDataIndiceEventListener);
        this.resetEventListener = this.handleReset.bind(this) 
        document.addEventListener('aerisResetEvent', this.resetEventListener);
        this.aerisThemeListener = this.handleTheme.bind(this) 
        document.addEventListener('aerisTheme', this.aerisThemeListener);
  },
 
}
</script>

<style>

.isgi-temporal-search {
    display: block
}

.isgi-temporal-search .right {
	min-width: 40px;
	border-right: 1px solid #fff;
	box-sizing: border-box;
    display: block;
    height: 100%;
    text-align: center;
}

.isgi-temporal-search .error-message {
    font-size: 12px;
    color: red
}
.isgi-temporal-search .error-message::first-letter{
	text-transform:uppercase;
}
.isgi-temporal-search .isgi-input-group {
    border: none;
     /* Default color from aeris */
    background-color: rgba(172,220,238,0.3); 
}

.isgi-temporal-search .isgi-input-group input {
	border: none;
	background-color: transparent;
	padding: 0 5px;
	outline: none;
}
	
.isgi-temporal-search .isgi-input-group span:first-letter {
   text-transform: uppercase;
}
.isgi-temporal-search .isgi-input-group{
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin: 5px 0;
    width: 100%;
    height: 25px;
    line-height: 25px;
    overflow: hidden;
}
.isgi-temporal-search .isgi-checkbox{
	padding:2px 0;
}
.isgi-temporal-search .isgi-checkbox input{
 	margin-top:0;
 	margin-right:4px;
 }
.isgi-temporal-search .isgi-checkbox label::first-letter{
	text-transform: uppercase;
}


</style>