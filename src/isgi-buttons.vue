<template>
<div class="formater-buttons-container">
	<div class="formater-button">
		<button type="button">
			<i  class="fa fa-reset" aria-hidden="true"></i>
			{{$t("reset")}}
		</button>
	</div>
	<div class="formater-button">
		<button type="button">
			<i  class="fa fa-search" aria-hidden="true"></i>
			{{$t("search")}}
		</button>
	</div>
	<div class="formater-button">
		<button type="button">
			<i  class="fa fa-question" aria-hidden="true"></i>
			{{$t("search")}}
		</button>
	</div>
</div>
</template>

<script>
export default{
	props:{
		
	}
}
</script>
<style>
[formater-button] button {
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  border-radius: 0.3rem;
  padding: 16px;
  background: #ddd;
  color: #444;
  font-size: 1rem;
  cursor: pointer;
}
[formater] button i {
  margin-right: 10px;
}
[formater-button] .accent {
  background: #333;
  color: #FFF;
}
[formater-button] button::-moz-focus-inner {
  border: 0;
}
[formater-button] button:hover {
  filter: brightness(80%);
}
</style>