<script>
  export let selectedProduct = { id: 0, name: '', price: 0 }; // Prop pour recevoir les données du produit sélectionné

</script>

<form>
  <label>
    Nom du produit :
    <input type="text" bind:value={selectedProduct.name} />
  </label>
  <label>
    Prix du produit :
    <input type="number" step="0.01" bind:value={selectedProduct.price} />
  </label>
  <button type="submit">Mettre à jour le produit</button>
</form>
