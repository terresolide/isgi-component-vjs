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
export default {
	 
  props: {
  	lang:  {
      type: String,
      default: 'fr'
    },
    indice:{
    	type: String,
    	default:null
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
         console.log( evt.detail.result);
         var data0 = evt.detail.result;
         var container = this.$el.querySelector(".chart-container");
       
      //   var dataType = data0.meta.get("Data Type");
       //  var interval = this.intervalType(data0.meta.get("Data Interval Type"), dataType);
        
         //this.createChartTitle( dataType, data0.collection[0].DATE, data0.collection[ data0.collection.length-1].DATE);
         
                
                 var data = new Array();
                 var coord = new Array();
               
     
                 //traitement des collections
                  var indice = this.indice;
                 data0.collection.forEach( function( item){
                	    var date = Date.parse(item.DATE+" "+item.TIME);
                	    console.log(date);
                         data.push([date, item[indice]]);
                   

                 });
    
               
                    // console.log(value);
                
                 var mychart = Highcharts.chart(container, {
                  
                     chart:{
                     height:130,
                    // marginBottom: (value==="F")? 45 : 15
                     },
                     title: {
                         text: '<div style="background:#fff;padding:5px;font-size:10px"><div style="background:'+Highcharts.getOptions().colors[0]+';width:10px;height:10px;display:inline-block;margin:0 3px;"></div>'+indice+'</div>',
                         align: 'right',
                         margin: 10,
                         useHTML: true,
                       //  x: 70,
                         floating:true
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
                     yAxis: [{
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
                      
                     ],
                     tooltip: {
                         headerFormat: '<b>{series.name}</b><br>',
                         pointFormat: '{point.x:%e. %b %Y}: {point.y:,.0f}'
                         //pointFormat: '{point.x:'+interval+'} | {point.y:,.0f}'
                     },
                     series: [{
                         name: indice,
                         showInLegend:false,
                         color: Highcharts.getOptions().colors[0],
                         data: data //[1, 0, 4]
                     }]
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