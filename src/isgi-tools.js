const isgiToolsPlugin = {
		install(Vue, options) {
		    
		  //cette fonction est déjà dans formaterPlugin
		      Vue.prototype.$shadeColor= function(color, percent) {  
           			 var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
           			 // return "red";
           			 return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
		    }
		    Vue.prototype.$buildQuery  = function (obj, num_prefix, temp_key) {

		       var output_string = []

		       Object.keys(obj).forEach(function (val) {

		         var key = val;

		         num_prefix && !isNaN(key) ? key = num_prefix + key : ''

		         var key = encodeURIComponent(key.replace(/[!'()*]/g, escape));
		         temp_key ? key = temp_key + '[' + key + ']' : ''

		         if (typeof obj[val] === 'object') {
		           var query = build_query(obj[val], null, key)
		           output_string.push(query)
		         }

		         else {
		           var value = encodeURIComponent(obj[val].replace(/[!'()*]/g, escape));
		           output_string.push(key + '=' + value)
		         }

		       })

		       return output_string.join('&')

		     }

		    Vue.prototype.$dispatch = function(component, event, target, once) {
		      const parent = component.$parent;

		      if (parent) {
		        if (isTarget(target, parent.$options.name)) {
		          parent.$emit.apply(parent, ...event);

		          if (once) return;
		        }
		        dispatch(parent, event, target, once);
		      }
		    }
		}
};

export default isgiToolsPlugin;
