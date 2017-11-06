<template>
<div class="isgi-select">
	<select name="format">
		<option v-for="item in indexes" :value="item">{{ item}}</option>
	</select>
</div>
</template>
<script>
export default {

  data () {
		return {
  			indexes: new Array('IAGA2002')
		}
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
        .isgi-select select             { padding-right: .9em }
    }
}
</style>