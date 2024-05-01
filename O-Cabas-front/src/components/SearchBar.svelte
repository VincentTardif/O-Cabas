<script>
	export let searchTerm;
</script>

<div id="search-input-cont">
	<input type="text" 
		id="search-field" 
		placeholder="Entrez votre recherche ici" 
		autocomplete="off"
		bind:value={searchTerm}
		on:input />
</div> 

<style>
</style>