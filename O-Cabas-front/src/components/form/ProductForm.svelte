<script>
  import toast from 'svelte-french-toast'
  import { CirclePlus } from 'lucide-svelte';

  const webp = ".webp"
  let producers_id, categories_id, name, description, unit_type, price, picture, quantity, status, createdat, updatedat;

  // Fonction pour ajouter un produit
async function addProduct(event) {
        // Demande de confirmation avant d'ajouter le produit
        const confirmation = window.confirm("Ajouter ce produit ?");
    if (!confirmation) {
        return;
    }
  event.preventDefault();
  const productEndpoint = import.meta.env.VITE_API_BASE_URL  + "product/"
  const response = await fetch (productEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("USER_TOKEN"),
    },
      body: JSON.stringify(
        {
          producers_id: producers_id,
          categories_id: categories_id,
          name: name,
          description: description,
          unit_type: unit_type,
          price: price,
          status: true,
          picture: picture + webp
        }
      )
    })

    
    if (response.ok ) {
    const json = await response.json()
  } else {
    console.log(
      "Erreur : " + response.status + ", Message : " + response.statusText
      );
    }
    toast.success("Produit ajouté",
    {
      position: "top-right"
    })
    location.reload();
}

  // fonction pour récupérer les producteurs
  async function getProducers() {
  try {
    const producersEndpoint = import.meta.env.VITE_API_BASE_URL + "producers";
    const response = await fetch(producersEndpoint)
    if (response.ok) {
      const producersData = await response.json();
      return producersData;
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
    const response = await fetch(categoriesEndpoint)
    if (response.ok) {
      const categoriesData = await response.json();
      // console.log(categoriesData);
      return categoriesData;
    } else {
        throw new Error('Erreur BDD');
    }
  } catch (error) {
      console.error(error);
  }
  }
</script>

<!-- addProduct form -->
<form class="" action="">
  <!-- name -->
    <div class="">
      <label class="" for="name">Nom</label>
      <input bind:value={name}
        class="input-field"
        type="text"
        id="name"
        name="name"
        placeholder="Nom du produit"
        aria-label="nom"
      >
    </div>

  <!-- Producer -->
    <div class="">
      <label class="" for="producer">Producteur</label>
      <select 
      name="producer"
      class="input-select"
      id="producer"      
      aria-label="Producteur"
      bind:value={producers_id}>
      <option value="">--- choisissez un producteur</option>
      {#await getProducers()}
      <p>Chargement en cours. Patientez...</p>
      {:then producers}
      {#each producers as producer}
      <option value="{producer.id}">{producer.company}</option>
      {/each}
      {/await}
    </select>
      
    </div>


  <!-- description -->
    <div class="">
    <label class="label-text-area" for="description">Description</label>
    <textarea
      class="input-text-area"
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
      class="input-select"
      id="category"      
      aria-label="Catégorie"
      placeholder=""
      bind:value={categories_id}>
      <option value="">--- choisissez une catégorie</option>
      {#await getCategories()}
      <p>Chargement en cours. Patientez...</p>
      {:then categories}
      {#each categories as category}
      <option value="{category.id}">{category.name}</option>
      {/each}
      {/await}
    </select>
    </div>

  <!-- unit_type -->
    <div class="">
    <label class="" for="unit_type">Unité de valeur</label>
    <select 
      name="unit_type"
      class="input-select"
      id="unit_type"      
      aria-label="unité de valeur"
      placeholder="Pièce"
      bind:value={unit_type}>
      <option value="Pièce">Pièce</option>
      <option value="kg">Kilogrammes</option>
      <option value="g">Grammes</option>
      <option value="L">Litre</option>

    </select>
    </div>

  <!-- price -->
    <div class="">
    <label class="" for="price">Prix</label>
    <input
      class="input-field"
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
      class="input-field"
      type="txt"
      id="picture"
      name="picture"
      aria-label="image"
      placeholder="Nom de la photo"
      bind:value={picture}      
    >
    </div>

  <!-- pour l'accessibilité, on ajoute on:keypress l'input submit. Cel permet de valider avec le clavier -->  
  <!-- send form button -->
  <button
  on:click={addProduct}
  on:keypress={addProduct}        
  class="button admin-button green-button"
  aria-label="Ajouter le produit">
    <div class="button-content">
      <div class="button-text">Ajouter le produit</div>
      <CirclePlus class="button-icon"/>
    </div>
  </button>

</form>

<style>
  .input-field {
    border-radius:5px;
    height: 30px;
    margin: 0 0 10px 5px;
    padding-left: 5px;
  }

  .input-select {
    margin: 0 0 10px 5px;
    height: 30px;
    padding-left: 5px;
  }

  .input-text-area {
  border-radius:5px;
  margin: 0 0 10px 5px;
  padding-left: 5px;
  font-size: 14px;
  }

  .label-text-area {
    position: relative;
    top: -35px;
  }

  .green-button {
    background-color: #BFB749;
    border: 1px solid #000;
    border-radius: 20px;
    font-weight: 700;
  }
</style>