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
    <aeris-notifier autoHide="true"></aeris-notifier>
    <formater-layout>

    
  
    <div class="formater-wrapper">
    
        <aside>
            <isgi-form :lang="lang"></isgi-form>
            
            
        </aside>
        <main>
            <isgi-chart :lang="lang" v-for="(indice, id) in indices" :indice="indice" :key="id" :id="id"></isgi-chart>
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
			indices: ['aa', 'am', 'Kp', 'Dst', 'PC', 'AE', 'SC', 'SFE', 'Qdays', 'CKdays']
		}
	},
   
    created(){
        this.$i18n.locale = this.lang;
        console.log( this.indices);
    }
}
</script>