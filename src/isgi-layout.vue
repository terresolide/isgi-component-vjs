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
    <header></header>
    
  
    <div class="isgi-wrapper">
    
        <aside>
            <isgi-form :lang="lang"></isgi-form>
            
            
        </aside>
        <main>
            <isgi-chart :lang="lang" v-for="indice in indices"></isgi-chart>
        </main>
    </div>
    <footer>
    </footer>
  
    
    </span>
</template>
<script>
export default {
	data(){
		return{
			indices: ['aa', 'am', 'Kp', 'Dst', 'PC', 'AE', 'SC', 'SFE', 'Qdays', 'CKdays']
		}
	},
    props:{
        lang: {
            type:String,
            default:'fr'
        }
    },
    created(){
        this.$i18n.locale = this.lang;
    }
}
</script>