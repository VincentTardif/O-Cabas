<script>
  // on definit comme masquée la sidebar
  export let showSidebar = false;
  export let selectedProduct = { id: 0, name: '', price: 0, producers_id:'', description:'', categories_id:'', unit_type:'', picture:'', status }

  // fonction pour récupérer les producteurs
  async function getProducers() {
  try {
    const producersEndpoint = import.meta.env.VITE_API_BASE_URL + "producers";
    const response = await fetch(producersEndpoint)
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
        throw new Error('Erreur BDD');
    }
  } catch (error) {
      console.error(error);
  }
  }

  // fonction pour récupérer les catégories
  async function getCategories() {
    try {
      const categoriesEndpoint = import.meta.env.VITE_API_BASE_URL + "categories";
      const response = await fetch(categoriesEndpoint, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
      },
      })
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
          throw new Error('Erreur BDD');
      }
    } catch (error) {
        console.error(error);
    }
  }

</script>



{#if showSidebar}
<nav>
  <!-- Contenu de la sidebar -->
  <div>
    <h2>Modifier le produit</h2>
    <form>
      <!-- name -->
      <div class="">
    <label class="" for="name">Nom</label>
    <input
      class=""
      type="text"
      id="name"
      name="name"
      aria-label="nom"
      bind:value={selectedProduct.name}
      required
    >
      </div>
    
      <!-- Producer -->
      <div class="">
    <label class="" for="producer">Producteur</label>
    <select 
      name="producer"
      class=""
      id="producer"      
      aria-label="Producteur"
      bind:value={selectedProduct.producers_id}>
      <option value="">--- choisissez un producteur</option>
      <option value={selectedProduct.producers_id}>{selectedProduct.producers_id}</option>
      {#await getProducers()}
        <p>Chargement en cours. Patientez...</p>
      {:then producers}
      {#each producers as producer}
        <option value={producer.id}>{producer.company}</option>
      {/each}
      {:catch error}
        <p>erreur : {error.message}</p>
      {/await}
    </select>    
      </div>
    
      <!-- description -->
      <div class="">
    <label class="" for="description">Description</label>
    <textarea
      class=""
      id="description"
      name="description"
      aria-label="description"
      placeholder="Description"
      bind:value={selectedProduct.description}
      ></textarea>
        </div>  
      
      <!-- category -->
      <div class="">
    <label class="" for="category">Catégorie</label>
    <select 
      name="category"
      class=""
      id="category"      
      aria-label="Catégorie"
      placeholder=""
      bind:value={selectedProduct.categories_id}>
      <option value="">--- choisissez une catégorie</option>
      <option value={selectedProduct.categories_id}>{selectedProduct.categories_id}</option>

      {#await getCategories()}
        <p>Chargement en cours. Patientez...</p>
      {:then categories}
      {#each categories as category}
      <option value="{category.name}">{category.name}</option>
      {/each}
      {:catch error}
        <p>erreur : {error.message}</p>
      {/await}      
    </select>
        </div>
      
      <!-- unit_type -->
      <div class="">
    <label class="" for="unit_type">Unité de valeur</label>
    <select 
      name="unit_type"
      class=""
      id="unit_type"      
      aria-label="unité de valeur"
      placeholder="Pièce"
      bind:value={selectedProduct.unit_type}>
      <option value="unit">Pièce</option>
      <option value="kg">Kilogrammes</option>
      <option value="g">Grammes</option>
      <option value="L">Litre</option>
    </select>
        </div>
      
      <!-- price -->
      <div class="">
    <label class="" for="price">Prix</label>
    <input
      class=""
      type="number"
      step="0.01"
      id="price"
      name="price"      
      aria-label="prix"
      placeholder="Prix"
      bind:value={selectedProduct.price}>
        </div>
      
      <!-- picture -->
      <div class="">
    <label class="" for="picture">Photo</label>
    <input
      class=""
      type="file"
      id="picture"
      name="picture"
      aria-label="image"
      accept="image/png, image/jpeg"
      bind:value={selectedProduct.picture}      
    >
      </div>
    
      <!-- status -->
      <div class="">
    <label class="" for="status">Disponible</label>
    <input
      class=""
      type="checkbox"
      id="status"
      name="status"
      aria-label="image"
      bind:value={selectedProduct.status}      
    >
      </div>      
    </form>
  </div>
  
  <!-- pour l'accessibilité, on ajoute on:keypress l'input submit. Cel permet de valider avec le clavier -->  
  <!-- send form button -->
  <button
    type="submit"
    class=""
    value="Enregister le formulaire"
    aria-label="ajouter le produit"
    >Enregistrer
  </button>

    <!-- masquer la sidebar -->
    <!-- au clic, la constante showSidebar repasse en non visible -->
    <button on:click={() => {showSidebar = false;}}>Annuler</button>
  </nav>
{/if}


<style>
nav {
  position: fixed;
  margin-top:80px;
	width: 500px;
  top: 0;
  right: 0;
  height: 100%;
  padding: 10px;
  border-left: 1px solid #aaa;
  background: #fff;
  overflow-y: auto;
}
</style>