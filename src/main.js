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
import IsgiChart from './isgi-chart.vue';
import IsgiLayout from './isgi-layout.vue';




ljs.addAliases({
	dep: [
		// lib for highchart
		//------------------
		'https://code.highcharts.com/highcharts.src.js',
		// isgi function
		//---------------
		//'/src/isgi-indice.js',
		'https://cdn.rawgit.com/terresolide/isgi-component-vjs/0.1.0/src/isgi-indice.js',
	    //dev version for formater-commons-components-vjs
		//----------------------------------------------
		//'http://localhost:8080/dist/build.js',
		//pre prod 
	    //'https://rawgit.com/terresolide/formater-commons-components-vjs/master/dist0/formater-commons-components-vjs.js' ,
		//prod
		'https://cdn.rawgit.com/terresolide/formater-commons-components-vjs/0.1.2/dist/formater-commons-components-vjs.js' ,
	
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
	var componentUsed = new Array('formater-select' , 'formater-search-box', 'aeris-datepicker');
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
       // registerElement('isgi-qdays',IsgiQdays);
        registerElement('isgi-temporal-search',IsgiTemporalSearch);
        registerElement('isgi-form', IsgiForm);
        registerElement('isgi-chart', IsgiChart);
        registerElement('isgi-layout',IsgiLayout);
	
	}

	
})

