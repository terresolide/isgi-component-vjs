/**
 * Template for isgi
 */
 <i18n>
{
   "en":{
   },
   "fr":{
   }
}
</i18n>
<template>
<span class="isgi-layout">
  
    <formater-layout>

    
  
    <div class="formater-wrapper">
        <aside>
            <isgi-form :lang="lang" :indices="indices"></isgi-form>   
        </aside>
        <main>
            <isgi-chart :lang="lang" v-for="(indice, id) in indices" :indice="indice" :key="id" :width="mainWidth"  :id="id" ></isgi-chart>
        </main>
         </div>
        
     <footer>
    </footer>
    </formater-layout>
   
  
  
    
    </span>
</template>
<script>
export default {
	 props:{
	        lang: {
	            type:String,
	            default:'fr'
	        },
	       // indices:{
	       // 	type: Array,
	       // 	default:['aa', 'am', 'Kp', 'Dst', 'PC', 'AE', 'SC', 'SFE', 'Qdays', 'CKdays']
	       // }
	    },
	data(){
		return{
			indices: ['aa', 'am', 'Kp', 'Dst', 'PC', 'AE', /*'SC', 'SFE', 'Qdays', 'CKdays'*/],
			windowResizeListener: null,
			aerisThemeListener:null,
			mainWidth:300
		}
	},
	methods:{
		emitMainWidth(){
			this.computeMainWidth();
			var event = new CustomEvent('isgiResize', { detail:{mainWidth:this.mainWidth}});
			document.dispatchEvent(event);
		},
		computeMainWidth(){
			var width = this.$el.querySelector(".formater-wrapper").offsetWidth;
	    	width -= this.$el.querySelector("aside").offsetWidth;

	        this.mainWidth = width;
			
			 return width;
		},
		addWidth( evt){
			evt.detail.mainWidth = this.computeMainWidth();
			
		}
	},
//     computed:{
//     	mainWidth(){
//     		var left = this.$el.querySelector("aside").offsetWidth;
//     		return "width: 300px;";
//     	}
//     },
    created(){
        this.$i18n.locale = this.lang;
        this.windowResizeListener = this.emitMainWidth.bind( this);
        window.addEventListener('resize', this.windowResizeListener);
        this.aerisThemeListener = this.addWidth.bind( this);
        document.addEventListener('aerisTheme', this.aerisThemeListener);
        
    },
    mounted(){
    	this.computeMainWidth();
    },
    destroyed(){
    	 window.removeEventListener( 'resize', this.windowResizeListener);
         this.windowResizeListener = null;
         document.removeAerisThemeListener('aerisTheme', this.aerisThemeListener);
         this.aerisThemeListener =null
    }
}
</script>