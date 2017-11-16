require("exports-loader?!./l.min.js");

import Vue from 'vue';

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);

//pour la traduction 
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import IsgiTools from './isgi-tools.js';
Vue.use(IsgiTools);


import IsgiForm from './isgi-form.vue';
import IsgiTemporalSearch from './isgi-temporal-search.vue';

import IsgiSearchBox from './isgi-search-box.vue';





ljs.addAliases({
	dep: [//'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
	   
	 //  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js',
	//    'https://cdnjs.cloudflare.com/ajax/libs/moment-range/3.0.3/moment-range.min.js',
	  //  'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js',
	    'https://cdn.rawgit.com/aeris-data/aeris-commons-components-vjs/0.1.28/dist/aeris-commons-components-vjs_0.1.28.js', 
	    //dev version for formater-commons-components-vjs
	    'https://rawgit.com/terresolide/formater-commons-components-vjs/master/dist0/formater-commons-components-vjs.js' 
	
	    ]
})
ljs.load('dep', function() {
	

	// le tableau des composants Aeris
	if (!window.registredAerisElements) {
		window.registredAerisElements = [];
	}
	
	function registerElement(name, component) {
       
        if (window.registredAerisElements.indexOf(name) < 0) {
            Vue.customElement(name, component);
            window.registredAerisElements.push(name)
        }
	}
	var componentUsed = new Array('formater-select', 'aeris-datepicker');
	var loaded = setInterval(function() {
	    var result = componentUsed.filter( function( cpt){
	        return window.registredAerisElements.indexOf(cpt)>-1;
	    })
	    if ( result.length == componentUsed.length) {
	       console.log("Isgi : used components loaded");
	       load();
	       clearInterval(loaded);
	    }
	 }, 100);
     function load(){
        registerElement('isgi-search-box',IsgiSearchBox);
        //window.registredAerisElements.push('isgi-search-box');
        registerElement('isgi-temporal-search',IsgiTemporalSearch);
       // window.registredAerisElements.push('isgi-temporal-search');
    /*  registerElement('isgi-select', IsgiSelect);
        window.registredAerisElements.push('isgi-select');*/
        registerElement('isgi-form', IsgiForm);
     //   window.registredAerisElements.push('isgi-form');
  //  })
	
	}

	
})

