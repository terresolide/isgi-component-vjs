require("exports-loader?!./l.min.js")

import Vue from 'vue';

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);

//pour la traduction 
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

import VueResource from 'vue-resource';
Vue.use(VueResource);



import IsgiSelect from './isgi-select.vue';
import IsgiForm from './isgi-form.vue';
import IsgiSearchBox from './isgi-search-box.vue';
import IsgiTemporalSearch from './isgi-temporal-search.vue';

ljs.addAliases({
	dep: [//'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
	    'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js',
	   'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js',
	    'https://cdnjs.cloudflare.com/ajax/libs/moment-range/3.0.3/moment-range.min.js',
	    'https://cdn.rawgit.com/aeris-data/aeris-commons-components-vjs/0.1.23/dist/aeris-commons-components-vjs_0.1.23.js'
	
	    ]
})
ljs.load('dep', function() {
	
	window.moment = moment
	window['moment-range'].extendMoment(moment);
	
	// le tableau des composants Aeris
	if (!window.registredAerisElements) {
		window.registredAerisElements = [];
	}

	Vue.customElement('isgi-search-box',IsgiSearchBox);
	window.registredAerisElements.push('isgi-search-box');
	Vue.customElement('isgi-temporal-search',IsgiTemporalSearch);
    window.registredAerisElements.push('isgi-temporal-search');
	Vue.customElement('isgi-select', IsgiSelect);
	window.registredAerisElements.push('isgi-select');
	Vue.customElement('isgi-form', IsgiForm);
    window.registredAerisElements.push('isgi-form');
	
})

