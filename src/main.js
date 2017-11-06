require("exports-loader?!./l.min.js")

import Vue from 'vue';

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);

//pour la traduction 
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

//import VueResource from 'vue-resource';
//Vue.use(VueResource);



import Isgindex from './isgi-index-select.vue';
//import IsgiFormat from './isgi-format-select.vue';
//import IsgiDate from './isgi-input-date.vue';
//import IsgiForm from './isgi-form.vue';



ljs.addAliases({
	dep: [//'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
	    'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js',
	    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js',
	    'https://cdnjs.cloudflare.com/ajax/libs/moment-range/3.0.3/moment-range.min.js',
	  //  'https://cdn.rawgit.com/aeris-data/aeris-commons-components-vjs/0.1.23/dist/aeris-commons-components-vjs_0.1.23.js'
	    ]
})
ljs.load('dep', function() {
	
	window.moment = moment
	window['moment-range'].extendMoment(moment);
	
	// le tableau des composants Aeris
	if (!window.registredAerisElements) {
		window.registredAerisElements = [];
	}
	
	
	Vue.customElement('isgi-index-select', Isgindex);
	window.registredAerisElements.push('isgi-index-select');
	/*Vue.customElement('isgi-input-date', IsgiDate);
	window.registredAerisElements.push('isgi-input-date');
	Vue.customElement('isgi-format-select', IsgiFormat);
	window.registredAerisElements.push('isgi-format-select');
	Vue.customElement('isgi-form', IsgiForm);
    window.registredAerisElements.push('isgi-form');*/
	
})

