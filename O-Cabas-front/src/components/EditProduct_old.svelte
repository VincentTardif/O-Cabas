<script>
  import { onMount } from 'svelte';

  let productData = {
      name: "",
      producer: "", 
      description: "", 
      category: "", 
      unit_type: "", 
      price: "", 
      picture: "", 
      status: ""
  };

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

  // fonction pour récupérer les produits
  async function fetchDataProduct(productId) {
    try {
      const productsEndpoint = import.meta.env.VITE_API_BASE_URL + "products" + productId;
      const response = await fetch(productsEndpoint)
      if (response.ok) {
        const data = await response.json();
        productData = data;
        // console.log(data);
        return data;
      } else {
          throw new Error('Erreur BDD');
      }
    } catch (error) {
        console.error(error);
    }
  }
  let name, producer, description, category, unit_type, price, picture, status;

    // Editer un produit
    async function editProduct() {
      try {
        const productsEndpoint = import.meta.env.VITE_API_BASE_URL + "products";
        const response = await fetch(productsEndpoint, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
        },
        body: JSON.stringify(productData)
      })
      } catch (error) {
          console.error(error);
      }
  }

  // Charger le produit lors du chargement du composant
  onMount(() => {
    const productId = 1; // ID du produit à charger (remplacer par la méthode appropriée pour obtenir l'ID)
    fetchDataProduct();
  });
</script>

<!-- editProduct form -->
<form class="" on:submit|preventDefault={editProduct}>
  <!-- name -->
    <div class="">
      <label class="" for="name">Nom</label>
      <input
        class=""
        type="text"
        id="name"
        name="name"
        aria-label="nom"
        bind:value={productData.name}
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
      bind:value={producer}>
      <option value="">--- choisissez un producteur</option>
      {#await getProducers()}
      <p>Chargement en cours. Patientez...</p>
      {:then producers}
      {#each producers as producer}
      <option value="{producer.company}">{producer.company}</option>
      {/each}
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
      bind:value={description}
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
      bind:value={category}>
      <option value="">--- choisissez une catégorie</option>
      {#await getCategories()}
      <p>Chargement en cours. Patientez...</p>
      {:then categories}
      {#each categories as category}
      <option value="{category.name}">{category.name}</option>
      {/each}
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
      bind:value={unit_type}>
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
      type="text"
      id="price"
      name="price"      
      aria-label="prix"
      placeholder="Prix"
      bind:value={price}>
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
      bind:value={picture}      
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
      bind:value={status}      
    >
    </div>    
  <!-- pour l'accessibilité, on ajoute on:keypress l'input submit. Cel permet de valider avec le clavier -->  
  <!-- send form button -->
  <button
    type="submit"
    class=""
    value="Enregister le formulaire"
    aria-label="ajouter le produit"
    on:keypress={editProduct}
    >Enregistrer
  </button>

</form>