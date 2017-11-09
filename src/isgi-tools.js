const isgiToolsPlugin = {
		install(Vue, options) {
		    Vue.prototype.$myAddedProperty = 'Example Property'
		    Vue.prototype.$myAddedMethod = function() {
		   	  return Vue.myAddedProperty
		    }
		    Vue.prototype.$shadeColor= function(color, percent) {  
		            console.log("passage dans shade color");
           			 var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
           			 //return "red";
            		return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
           }
		}
};

export default isgiToolsPlugin;
