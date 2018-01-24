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
<span class="isgi-qdays">
  <div v-for="month in months">
    <header>
    <h5>{{month.title}}</h5>
    </header>
  </div>
</span>
</template>
<script>
export default {
	 props:{
	        lang: {
	            type:String,
	            default:'fr'
	        },
	        start:{
	        	type:String,
	        	default:null
	        },
	        end:{
	        	type:String,
	        	default:null
	        }
    },
    data(){
        return{
        }
    },
	computed:{
		months(){
			return [{ title: "janvier"},{ title:"février"}]
		}
	},
	
	methods:{
		
    },
    created(){
        this.$i18n.locale = this.lang;   
    },
    destroyed(){

    }
}
</script>