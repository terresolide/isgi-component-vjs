<template>
<div class="isgi-select">
	<select :id="parent+ '_' + name" :name="name" v-model="value">
		<option v-for="item in indexes" :value="item" :selected="item === value">{{ item}}</option>
	</select>
</div>
</template>
<script>

export default {
    props:{
        options:{
            type:String
        },
        name:{
            type:String,
            default:"select"
        },
        parent:{
            type:String,
            default:''
        }
    },
  
    data(){
        return {
            value:'', 
            indexes: [], 
            resetEventListener: null, 
            searchEventListener:null,
            aerisThemeListener:null
            
        }
    },
    watch:{
        value:function(ev){
            console.log( "emit   " + this.value);
            this.$emit( 'input', this.value);
        }
    },
    
    created: function(){
        var options = JSON.parse( this.options.replace(/'/g, '"'))
        this.value = options[0];
       
        this.indexes = options;
        this.$emit( 'input', this.value);
        this.resetEventListener = this.handleReset.bind(this) 
        document.addEventListener('isgiResetEvent', this.resetEventListener);
        this.searchEventListener = this.handleSearch.bind(this) 
        document.addEventListener('isgiSearchEvent', this.searchEventListener);
        this.aerisThemeListener = this.handleTheme.bind(this) 
        document.addEventListener('aerisTheme', this.aerisThemeListener);
        
    },
    destroyed: function() {
    	document.removeEventListener('isgiResetEvent', this.resetEventListener);
    	this.resetEventListener = null;
    	document.removeEventListener('isgiSearchEvent', this.searchEventListener);
    	this.searchEventListener = null;
    	 document.removeEventListener('aerisTheme', this.aerisThemeListener);
         this.aerisThemeListener = null;
      },
      
      methods:{
          handleReset: function(evt){
              this.value = indexes[0];
      	  },
          handleSearch: function(evt){
              evt.detail[this.name] = this.value;
          },
          handleTheme: function(theme) {
		  		this.theme = theme.detail
				this.ensureTheme()
		},
		  	
		 ensureTheme: function() {
		  	if ((this.$el) && (this.$el.querySelector)) {
		  	    console.log('ensureTheme select');
		  		var color3 =  this.$shadeColor( this.theme.primary, 0.8);
		  		this.$el.querySelector(".isgi-select select").style.backgroundColor = color3;
		  	}
		 },
      }

}

</script>
<style>
.isgi-select select{
    font-size: inherit; /* inherit size from .custom-dropdown */
    padding: .5em; /* add some space*/
    margin: 0; /* remove default margins */
}

@supports (pointer-events: none) and
      ((-webkit-appearance: none) or
      (-moz-appearance: none) or
      (appearance: none)) {

    .isgi-select {
        position: relative;
        display: inline-block;
        vertical-align: middle;
    }

    .isgi-select select{
        padding-right: 2.5em; /* accommodate with the pseudo elements for the dropdown arrow */
        border: 0;
        border-radius: 1px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none; 
        /* Default color from aeris */
         background-color: rgba(172,220,238,0.3); 
        width:260px;  
    }

    .isgi-select::before,
    .isgi-select::after {
        content: "";
        position: absolute;
        pointer-events: none;
    }

    .isgi-select::after { /*  Custom dropdown arrow */
        content: "\25BC";
        height: 1em;
        font-size: .625em;
        line-height: 1;
        right: 1.2em;
        top: 50%; margin-top: -.5em;
    }

    .isgi-select::before { /*  Custom dropdown arrow cover */
        width: 2em;
        right: 0; top: 0; bottom: 0;
        border-radius: 0 3px 3px 0;
    }

    .isgi-select select[disabled] {
        color: rgba(0,0,0,.3);
    }

    .isgi-select select[disabled]::after {
        color: rgba(0,0,0,.1);
    }


    /* FF only temp fix */
    @-moz-document url-prefix() {
        .isgi-select select{ padding-right: .9em }
    }
}
</style>