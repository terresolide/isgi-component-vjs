/**
 * 
 */
/** useful for extract value in object type {name: "xxx", content: "zzzzz"}*/
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
// @todo pass properly this function in all componsant
function shadeColor(color, percent) {  
		 var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
		 // return "red";
		 return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
var isgi = isgi || {}

isgi.infos={
		aa: { unit: "nT", color: "#336699", url:"http://isgi.unistra.fr/indices_aa.php"},
		am: { unit: "nT", color:"#cc33cc", url:"http://isgi.unistra.fr/indices_am.php"},
		Kp: { unit: "2nT", color:"#339933",  url:"http://isgi.unistra.fr/indices_kp.php"},
		Dst: { unit: "nT", color: "#ff6633", url:"http://isgi.unistra.fr/indices_dst.php"},
		PC: { unit: "mV/m", color: "#3366ff", url:"http://isgi.unistra.fr/indices_pc.php"},
		AE: { unit: "nT", color: "#ff0000", url:"http://isgi.unistra.fr/indices_ae.php"},
		Qdays: {unit: "", color:"#ff0000", url:"http://isgi.unistra.fr/events_qdays.php"},
		SC: {unit: "", color: "#669933" , url:"http://isgi.unistra.fr/events_sc.php"},
		SFE: {unit: "", color: "#FF8000" , url:"http://isgi.unistra.fr/events_sfe.php"}
		
}

isgi.red = "#DB1702";
isgi.green = "#32CD32";
isgi.kpgreen ="#339933";
isgi.grey = "#929292";

isgi.indices = function(){
	return Object.keys( this.infos);
}


/**
 * prepare data for highcharts
 */
isgi.kp2value = function( kp ){
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

isgi.getKpName = function( obj ){
    for(var key in obj){
    	if( /^Kp[a-z]?$/.test( key)){
    		return key;
    	}
    }
    return null;
}
isgi.getUrl= function( resp ){
	return resp.result.meta.get("isgi_url");
}

isgi.Collection = function( resp, indice, id, lang){
	this.indice = indice;
	this.nameindice = indice == "Kp"? "ap":indice;
	this.id = id;
	this.kp = isgi.getKpName( resp.result.collection[0]);
	this.chart = null;
	this.error = null;
	this.colors = new Array();
    var _this = this;
    var _provisional = false;

    _initColors( id );
    this.data = _treatmentData( resp);
    
    function _initColors( id ){
    	
    	//@todo can choose my own colors
    	if( _this.indice == "Kp"){
    		_this.colors[0] = isgi.kpgreen;
    	}else{
    		_this.colors[0] = Highcharts.getOptions().colors[id];
    	}
    	_this.colors[0] = isgi.infos[ _this.indice].color;
    	_this.colors[1] = shadeColor( _this.colors[0], -.2);
    	_this.colors[2] = shadeColor( _this.colors[0], .1);
    }


	function _treatmentData( resp ){
		
		switch(_this.indice){
		case "PC":
	    	 var data = _treatmentDataPC( resp);
			break;
		case "SC":
		case "SFE":
			var data = _treatmentDataSC(resp);
			break;
		case "Qdays":
			var data = _treatmentDataQdays( resp );
			break;
	    default:
	    	var data = _treatmentDataDefault(resp );
		
		}
		return data;
		
	}
	function _treatmentDataPC(resp){
		var data = new Array();
		data.PCN = new Array();
		data.PCS = new Array();
		var data0 = resp.result;
	    data0.collection.forEach( function( item){
             var date = Date.parse(item.DATE+"T"+item.TIME+"Z"); 
             
           	 if(item.PCS){
                 data.PCS.push([date, item.PCS]);
             }
             if(item.PCN){
                 data.PCN.push([date, item.PCN]);
             }
	    });
	    return data;
		
	}
	function _treatmentDataSC(resp ){
		var data = new Array();
	
		var data0 = resp.result;
		var nodata = resp.result.meta.get("no_data");
		_provisional = resp.result.meta.get("provisional");
		data[ _this.indice ] = new Array();
		data["hidden"] = new Array();
		data["noData"] = new Array();
		if(_provisional){
			data["PROVI"] = new Array();
		}
		

		//add begin date if not Qdays or Ddays
		if(data0.collection.length == 0 ||
				data0.collection[0].DATE > resp.query.start){
			// Add 2 days with value 0 at the beginning to begin graph with the start date
			// and have same scale that others graph
			var date = Date.parse( resp.query.start + "T00:00:00.000Z");
			data["hidden"].push( [date, 0]);
			var next = Date.parse( resp.query.start + "T23:59:59.999Z");
			data["hidden"].push( [date, 0]);
		}
		
		data0.collection.forEach( function( item){
			 var date = Date.parse(item.DATE+"T"+item.TIME + "Z"); 
			 if(item.PROVI){
				 data[ "PROVI" ].push( [date, 1]);
			 }else{
				 data[ _this.indice ].push( [date, 1]);
			 }
			
			data["hidden"].push([date, 0]);
		});
		// add last date if not in response
		// add last date if not Qdays or Ddays
		if( data0.collection.length == 0 || data0.collection[ data0.collection.length -1].DATE < resp.query.end){
			if( nodata){
			
				var date = Date.parse( nodata);
				data["noData"] =  new Array();
				data["noData"].push([ date  , 1]);
				var date = Date.parse( resp.query.end + "T23:59:00.000Z") ;
				
	       	  	data["noData"].push( [date, 1]);
			}else{
				var date = Date.parse( resp.query.end + "T23:59:00.000Z");
				data["hidden"].push([date,0]);
			}
       	  	
        }
		
		return data;
	}
	function _treatmentDataQdays(resp ){
		var data = new Array();
		data.Qdays = new Array();
		data.Ddays = new Array();
		var data0 = resp.result;
		var nodata = resp.result.meta.get("no_data");
		//nodata ="2018-01-01";
		//add begin date if not Qdays or Ddays
		if( data0.collection[0].DATE > resp.query.start){
			var date = Date.parse( resp.query.start + "T12:00:00.000Z");
			data["Qdays"].push( [date, 0]);
		}
		data0.collection.forEach( function( item){
			var date = Date.parse(item.DATE + "T12:00:00.000Z"); 
			if( item.DAYS.indexOf("D") >=0){
				
				data["Ddays"].push([date, 1]);
			}else{
				data["Qdays"].push([date, 1]);
			}
		});
		// add last date if not Qdays or Ddays
		if( data0.collection[ data0.collection.length -1].DATE < resp.query.end){
			if( nodata){
			
				var date = Date.parse( nodata);
				data["noData"] =  new Array();
				data["noData"].push([ date  , 1]);
				var date = Date.parse( resp.query.end + "T23:59:00.000Z") ;
				
	       	  	data["noData"].push( [date, 1]);
			}else{
				var date = Date.parse( resp.query.end + "T23:59:00.000Z");
				data["Qdays"].push([date,0]);
			}
       	  	
        }
		
		return data;
	}
	function _treatmentDataDefault( resp ){
		
		var data = new Array();
		data["indice"] =  new Array();
		if( _this.kp ){
            data["kp"] = new Array();
        }
		var data0 = resp.result;
		data0.collection.forEach( function( item){
			var date = Date.parse(item.DATE+"T"+item.TIME +"Z"); 
		    data["indice"].push([date, item[ _this.nameindice ]]);
            if( _this.kp ){
                data["kp"].push([date, isgi.kp2value( item[ _this.kp])]);
            }
		 });
		 return data;
		
	}

	function _chart( width){
		  var chart = {
		             height:230,
		             width: width,
		             defaultSeriesType: 'areaspline',
		             plotBorderColor: '#666666',
		             plotBorderWidth: 1
		  }
		  if( ["SC", "SFE", "Qdays"].indexOf( _this.indice)>=0 ){
			  chart.type = "column";
		  }
		 /* chart.events = {
	          	load: function(e){
	        		this.renderer.rect(this.xAxis[0].series[0].data[0].clientX, 20, 50, 200)
	        		.attr({
                        fill: 'rgba(255, 0, 0, .2)'
                    })
                    .add();;
	        		
	        		
	        	},
	        	render:function(e){
	        		console.log(e);
	        	}
		  }*/
		  return chart;
		
	}
	function _yAxis(  ){
		var yAxis = new Array();
		switch( _this.indice ){
		case "PC":
			 //only one axis 
			 var html = '<span style="color:'+ _this.colors[1]+'">'+
             '<b>PCN</b></span> / <span style="color:'+
             isgi.red +';"><b>PCS</b></span> (' + isgi.infos.PC.unit+ ')';
        	 yAxis.push({ 
                     title: {
                        useHTML: true,
                        text: html
                     }
        	 });
        	 break;
		case "SC":
		case "SFE":
			var html = "";
			html += '<span style="color:'+_this.colors[1]+';">'+
            '<b>'+ _this.indice + '</b></span> ';
			
			//case provisional data
			if(_provisional){
				html += ' / <span style="color:'+isgi.grey+';">'+
            '<b>Provisional Data</b></span> ';
			}
	       	 yAxis.push({
	       		 title:{
	       			 useHTML: true,
	       			 text:html},
	       		 min:0,
	             max:1,
	             tickInterval:1
	       	 });
	       	 break;
		case "Qdays":
			var html = '<span style="color:'+isgi.red +';">'+
            '<b>Ddays</b></span> / <span style="color:'+
            isgi.green +'"><b>Qdays</b></span>';
	       	 yAxis.push({
	       		 title:{
	       			 useHTML: true,
	       			 text:html},
	       		 min:0,
	             max:1,
	             tickInterval:1
	       	 });
	       	 break;
		case "Kp":
			/*yAxis.push({ 
                title: {
                    text: indice,
                    style: {
                        color: _this.colors[2],
                        fontWeight: 'bold'
                    }
                },
                tickInterval:3,
                max: 9});
		     break;*/
		case "am":
		case "aa":
			 //@todo si moins d'un mois de données uniquement
			// 2 yAxis (left: linear indice (default), right: Kp in column)
            if( _this.kp)
            yAxis.push({ 
                title: {
                    text: _this.kp,
                    style: {
                        color: _this.colors[2],
                        fontWeight: 'bold'
                    }
                },
                minorTickInterval: 2,
                tickLength: 10,
                max: 9,
                opposite: true });
		default:
             // only 1 yAxis linear
              yAxis.unshift({ 
                   title: {
                       useHTML: true,
                       text: '<span style="color:'+ _this.colors[1]+'">'+
                       '<b>'+_this.nameindice+'</b></span> (' + isgi.infos[_this.indice].unit +')'
                   }
               });
			
		}
		return yAxis;
		
	}
	function _series( ){
		var series = new Array();
		switch( _this.indice ){
		case "PC":
			 series.push({
                 type: 'line',
                 name: 'PCN',
                 color: _this.colors[1],
                 data: _this.data["PCN"] });
			 series.push({
	                type: 'line',
	                name: 'PCS',
	                color: isgi.red,
	                data: _this.data["PCS"]});
			 break;
		case "SC":
		case "SFE":
			if(_this.data[_this.indice].length>0)
			 series.push({
        		 name: _this.indice,
        		 color: _this.colors[2],
        		 data:_this.data[ _this.indice],
        	 });
			 if( _provisional && _this.data["PROVI"].length>0){
				 series.push({
	        		 name: _this.indice + " provisional",
	        		 color: isgi.grey,
	        		 data:_this.data["PROVI"],
	        	 });
			 }
			 if( _this.data["hidden"].length)
			 series.push({
        		 name: "hidden",
        		 color: "#fff",
        		 data:_this.data["hidden"],
        	 });
			 if( _this.data["noData"].length){
	             series.push({
	            	 name: "no data",
	            	 type: "area",
	            	 color: "#cccccc",
	            	 data: _this.data["noData"]
	             })
             }
			 break;
		case "Qdays":
			 series.push({
        		 name: "Ddays",
        		 color: isgi.red,
        		 data:_this.data["Ddays"],
        		 stack: "Days"
        	 });
        	 series.push({
        		 name: "Qdays",
        		 color: isgi.green,
                 data:_this.data["Qdays"],
                 stack: "Days"
             })
             if( _this.data["noData"]){
	             series.push({
	            	 name: "no data",
	            	 type: "area",
	            	 color: "#cccccc",
	            	 data: _this.data["noData"]
	             })
             }
             break;
		case "Kp":
			/*  series.push({
	                 type: 'column',
	                 name: _this.kp,
	                 color: _this.colors[2],
	                 data: _this.data["kp"]
	                });
			  break;*/
		case "aa":
		case "am":
			//@todo only if less than 1 month
			if( _this.kp){
			 series.push({
                 type: 'column',
                 name: _this.kp,
                 color: _this.colors[2],
                 yAxis: 1,
                 zIndex: 1,
                 data: _this.data["kp"]
                });
			}
        default:
        	 series.unshift({
                 type: 'line',
                 name: _this.nameindice,
                 color: _this.colors[1],
                 zIndex: 2,
                 data: _this.data["indice"]
              });
			
			 
		}
		return series;
	}
	function _tooltip(){
		 var tooltip =  {
	             shared: true,
	             crosshairs: [true, false, false]
	         }
		 switch( _this.indice ){
		 case "Qdays":
			 tooltip.borderColor = "#ccc";
             tooltip.formatter = function() {
                 var s =  Highcharts.dateFormat('%Y-%m-%d', this.x) ;

                 this.points.forEach(function(point, i) {
                	 if(point.y>0)
                     s += '<br/><span style="color:'+ point.series.color +'">\u25AC</span> '+ point.series.name  ;
                	 
                     
                 });

                 return s;
             }
             break;
		 case "SC":
		 case "SFE":
				 tooltip.formatter = function() {
		             var s =  Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x) ;
		
		             this.points.forEach(function(point, i) {
		            	 if( point.series.name != "hidden")
		                 s += '<br/><span style="color:'+ point.series.color +'">\u25AC</span> '+ point.series.name ;
		            	 
		             });
		             return s;
	             }
			 break;
		  default:
			 tooltip.formatter = function() {
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
	         }
			  
		 }
		
		 return tooltip;
	}
	function _plotOptions(){
		var plotOptions =  {
        	
            series: {
          	  	stacking:"normal",
                pointPadding: 0,
                groupPadding: 0,
                borderWidth: 1,
               // shadow: true
            }
        }
		if( ["SC", "SFE"].indexOf(_this.indice)>= 0){
			plotOptions.column = { pointWidth:4 }
		}
		return plotOptions;
	}

	this.createChart = function( container, width){
		var events = {}
		events.load = function(){
			console.log( "load");
			console.log( this);
		}
		this.chart = Highcharts.chart(container, {
	           
            chart:_chart(width),
            title: {
                text:"",
                align: "float"
            },
            legend: {
                enabled: false
            },
            plotOptions: _plotOptions(),
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
                crosshair: true,
            },
            
            yAxis: _yAxis(),
            tooltip: _tooltip(),
            series: _series()
        });
	}
	this.resizeChart = function( width ){
		if( this.chart){
			var height = this.chart.height;
			this.chart.setSize( width, height, true);
		}
	}
	this.destroy = function(){
		this.data = null;
		this.indice = null;
		this.error = null;
		this.kp = null;
		this.colors = null;
		if( this.chart ){
			this.chart.destroy();
		    this.chart = null;
	    }
		return null;
	}
	
}


	       