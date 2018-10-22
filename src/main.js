require("exports-loader?!./l.min.js");
//var pjson = require("../package.json")

import Vue from 'vue';
//import isgi from './isgi-indice_module.js';

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);

//pour la traduction 
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import {VueTools} from 'formater-commons-components-vjs'
Vue.use(VueTools)

import AerisTheme from 'aeris-commons-components-vjs/src/aeris-theme/aeris-theme.vue';


//import IsgiError from './isgi-error.vue';
//import IsgiForm from './isgi-form.vue';
//import IsgiTemporalSearch from './isgi-temporal-search.vue';
//import IsgiButtons from './isgi-buttons.vue';
//import IsgiChart from './isgi-chart.vue';
import IsgiComponent from './isgi-component.vue';


/**
 * ajoute withCredentials: true pour "identifier", suivre l'utilisateur 
 * au cours de ses différentes requêtes
 */
//Vue.http.options.xhr = { withCredentials: true };
//Vue.http.options.emulateJSON = true;

ljs.addAliases({
	dep: [
	  'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
    'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js',
    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js',
		//'https://cdn.rawgit.com/terresolide/formater-commons-components-vjs/0.1.5/dist/formater-commons-components-vjs.js' ,
		// "https://api.poleterresolide.fr/webcomponents/formater-commons-components-vjs_0.6.0.js" 
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
	var componentUsed = new Array() //new Array('formater-select' , 'formater-search-box', 'aeris-datepicker');
	var loaded = setInterval(function() {
	    var result = componentUsed.filter( function( cpt){
	        return window.registredAerisElements.indexOf(cpt)>-1;
	    })
	     console.log("wait loading");
	    if ( result.length == componentUsed.length && window.ftTools != "undefined") {
	       console.log("Isgi : used components loaded");
	       load();
	       clearInterval(loaded);
	    }
	 }, 100);
     function load(){
       registerElement('aeris-theme', AerisTheme);
//    	registerElement('isgi-error',IsgiError);
//        registerElement('isgi-temporal-search',IsgiTemporalSearch);
//        registerElement('isgi-buttons', IsgiButtons);
//        registerElement('isgi-form', IsgiForm);
//        registerElement('isgi-chart', IsgiChart);
        registerElement('isgi-component',IsgiComponent);
	}
	
})

