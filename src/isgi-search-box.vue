<template>
<span class="isgi-search-box-container" v-bind:class="{ showBody: deployed }">
<div id="main" class="box noselect">
<header class="box-heading" v-on:click="deployed = !deployed">
  <div class="box-title">
      <i  :class="headerIconClass" id="icon" v-show="headerIconClass"></i>
    <h4 no-label-float>{{title}}</h4>
  </div>
  <div class="box-heading-buttons">
    <i class="chevron" :class="openIconClass"></i>
  </div>
</header>
 <div id="collapse" class="box-collapsable-part">
  <main class="box-body">
    <div class="content">
      <slot></slot>
    </div>
  </main>
</div>
</div>
</span>
</template>

<script>
export default {
  props: {
    headerIconClass:  {
      type: String,
      default: 'fa fa-search'
    },
    deployed:  {
        type: Boolean,
        default: false
      },
    openIconClass:  {
        type: String,
        default: 'fa fa-chevron-down'
      },
      title:  {
          type: String,
          default: ''
        }  
    
    
  },
  
  watch: {
  },
  
  destroyed: function() {
  	document.removeEventListener('aerisTheme', this.aerisThemeListener);
  	this.aerisThemeListener = null;
  },
  
  created: function () {
  console.log("aeris-keyword-search-criteria - Creating");
   this.aerisThemeListener = this.handleTheme.bind(this) 
   document.addEventListener('aerisTheme', this.aerisThemeListener);
  },

  mounted: function() {
  	var event = new CustomEvent('aerisThemeRequest', {});
  	document.dispatchEvent(event);
  },
  
  computed: {
  },

   data () {
    return {
    	theme: null,
    	aerisThemeListener: null,
    	hasToolbar: false,
    }
  },
  
  updated: function() {
  	this.ensureTheme()
  },
  
  methods: {
  
	  handleChevronClick: function() {
       
    },
  	
  	handleTheme: function(theme) {
  		this.theme = theme.detail
		this.ensureTheme()
  	},
  	
  	ensureTheme: function() {
  	if (this.theme) {
  		if (this.$el) { 
  			this.$el.querySelector("header").style.background=this.theme.primary
  		}
  	}
  	}
  	
  	
  }
}
</script>

<style>

.isgi-search-box-container .box-collapsable-part {
    display: none;
    transition: 0.3s
}

.isgi-search-box-container.showBody .box-collapsable-part {
    display: block;
    transition: 0.3s
}
.isgi-search-box-container.showBody .chevron {
    transform: rotate(180deg)
}
.isgi-search-box-container .chevron {
    transition: 0.3s
}


.isgi-search-box-container {
    box-sizing: border-box;
    position: relative;
    display: block;
    width: 280px;
    margin: var(--catalog-box-margin, 5px);
    transition: transform 4s ease-out;
    box-shadow:  0 2px 5px rgba(0, 0, 0, 0.2)
}
.isgi-search-box-container:hover {
    cursor: default
}
.isgi-search-box-container .box {
    box-sizing: border-box;
    width: 100%;
    color: var(--catalog-box-color, #333);
    background-color: var(--catalog-box-background-color, #fff)
}
.isgi-search-box-container .box-title {
    display: flex;
    font-size: 16px;
    line-height: 1.2
}
.isgi-search-box-container .box-title .plateform-icon,
.isgi-search-box-container .box-title .fa {
    margin-right: 10px
}

.isgi-search-box-container header {
	color:#fff;
}

.isgi-search-box-container .box-title h4 {
    margin: 0;
    font-size: 16px;
}
.isgi-search-box-container .box-title h4:first-letter {
    text-transform:uppercase;
}
.isgi-search-box-container .box-body {
    font-size: 14px;
    word-wrap: break-word
}
.isgi-search-box-container .box-body .content {
    padding: 10px;
    text-align: justify
}
.isgi-search-box-container .box-toolbar {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: 5px 10px;
    border-bottom: 1px solid #ccc;
    border: var(--catalog-box-toolbar-border);
    background-color: var(--catalog-box-toolbar-background-color, #fafafa)
}
.isgi-search-box-container .box-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: var(--catalog-box-header-background-color, #f5f5f5);
    border: var(--catalog-box-header-border, none);
    cursor: pointer
}
.isgi-search-box-container .box-heading .box-heading-buttons {
    display: flex;
    flex-flow: row nowrap
}
.isgi-search-box-container .box-heading .box-heading-buttons .fa {
    margin-left: 5px
}

.isgi-search-box-container .box-collapsable-part {
    border: var(--catalog-box-main-border, none)
}
.isgi-search-box-container .box-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px
}
.isgi-search-box-container .expandButton {
    font-size: 14px;
    padding: 6px 13px;
    margin: 0 5px;
    color: var(--expand-button-text-color, #fff);
    border: 1px solid;
    background-color: var(--expand-button-main-color, #4765A0);
    opacity: var(--expand-button-opacity, 1);
    outline: none
}
.isgi-search-box-container .expandButton:hover {
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    color: var(--expand-button-hover-text-color, #fff);
    background-color: var(--expand-button-secondary-color, #d35400);
    opacity: var(--expand-button-hover-opacity, 1)
}
.isgi-search-box-container .metadata-datalevel .cartouche {
    display: inline-block;
    padding: 3px 5px;
    border-radius: 5px;
    color: #fff;
    font-size: 12px;
    background-color: #f0ad4e
}
.isgi-search-box-container .metadata-datalevel .cartouche .fa {
    margin-right: 5px
}
 </style>