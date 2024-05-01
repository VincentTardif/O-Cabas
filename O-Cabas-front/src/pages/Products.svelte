<script>
  import { products, cart } from '../components/cart.js'

  // Modules Svelte
  import { onMount } from 'svelte';
  import { CirclePlus } from 'lucide-svelte';
  import { CircleMinus } from 'lucide-svelte';

  import { CircleDot } from 'lucide-svelte';
  import { CircleX } from 'lucide-svelte';
  import { CircleCheckBig } from 'lucide-svelte';
  import { CircleSlash2 } from 'lucide-svelte';

  // Stores Svelte
  import { tokenStore } from "../store";
  import { isAdminStore } from "../store";

  import NoResults from '../components/NoResults.svelte';
  import ProductNotAvailable from "../components/ProductNotAvailable.svelte";

  // Admin 
  import AddProductSidebar from '../components/sidebar/AddProductSidebar.svelte';
  import EditProductSidebar from '../components/sidebar/EditProductSidebar.svelte';

  let showAddSidebar = false;
  let showEditSidebar = false;
  let searchTerm = "";
  let productData = [];
  let filteredProducts = [];
  let errorMessage = "";

  // fonction pour récupérer les produits
  async function getProducts() {
  try {
    const productsEndpoint = import.meta.env.VITE_API_BASE_URL + "products";
    const response = await fetch(productsEndpoint)
    if (response.ok) {
      const productsData = await response.json();
      // console.log(productsData);
      return productsData;
    } else {
        throw new Error('Erreur BDD');
    }
  } catch (error) {
    console.error(error);
    errorMessage = "Problème de connexion à la base de données";
  }
  }

  // fonction pour récupérer un produit
  async function getProduct(productId) {
  const productEndpoint = import.meta.env.VITE_API_BASE_URL  + "product/" + productId
  const response = await fetch(productEndpoint, {
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
      },
  })
  // on gère les erreurs
  // si notre réponse est OK
    if (response.ok) {
    const product = await response.json();
    return product
  } else {
    console.log("Erreur : " + response.status + ". Message : " + response.statusText);
  }
  };

  // Supprimer un produit
  async function deleteProduct(productId) {
  // Demande de confirmation avant de supprimer un produit
  const confirmation = window.confirm("Supprimer ce produit ?");
  if (!confirmation) {
      return;
  }    
    const productEndpoint = import.meta.env.VITE_API_BASE_URL  + "product/" + productId
    const response = await fetch (productEndpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
      },

    })
    if (response.ok ) {
    const json = await response.json()
  }
  // on recharge la page après la suppression
  setTimeout(function(){location.reload()} , 250);
  }

  // Activer/désactiver un produit
  async function activeProduct(productId) {
  const product = await getProduct(productId)
    let productStatus = product.status;
    const productEndpoint = import.meta.env.VITE_API_BASE_URL  + "product/" + productId;
    if (product.status) {
      productStatus = false;
    } else if (!product.status) {
      productStatus = true;
    }
    const response = await fetch(productEndpoint, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
        },
        body: JSON.stringify({ 
            status: productStatus
        })
    });

    if (response.ok) {
        const json = await response.json();
    }
  // on recharge la page après la suppression
  location.reload();
  }

  // Fonction qui normalise du texte en supprimant les accents
  // source : https://www.30secondsofcode.org/js/s/remove-accents/
  // NFD est le normalisation Unicode utilisée et /[\u0300-\u036f]/g, '' la regex qui va enlever les accents aux caractères accentués
  const removeAccents = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Fonction qui filtre les produits en fonction de la recherche, en ignorant les accents et les majuscules
  async function filterProducts() {
  // Normalisation de la recherche en retirant les accents et en le convertissant en minuscules
  const sanitizedFilter = removeAccents(searchTerm).toLowerCase();
  // Filtrage des produits en vérifiant si le nom du produit contient la recherche normalisée
  return filteredProducts = await productData.filter(product => 
  removeAccents(product.name.toLowerCase())
  .includes(sanitizedFilter));
  }

  // Utilisation de onMount pour exécuter le code une fois le DOM est monté
  onMount(async () => {
  // Attendre que les données utilisateur soient récupérées depuis le serveur
  productData = await getProducts();
  // Filtrer les utilisateurs une fois que les données sont récupérées
  filterProducts();
  });

  // $ devant cart appelle le store cart
  // fonction pour retirer un produit du panier
  const decreaseCart = (product) => {
    // À chaque itération de la boucle, elle vérifie si l'identifiant (id) de l'élément actuel du panier correspond à l'identifiant du produit passé en paramètre
		for(let item of $cart) {
      // Si un élément avec le même identifiant est trouvé dans le panier, cela signifie que le produit est déjà dans le panier. 
			if(item.id === product.id) {
        // Si la quantité du produit est supérieur
				if(product.quantity > 1 ) {
            // on enlève 1
						product.quantity -= 1
            // on réaffecte le panier à lui-même
						$cart = $cart
        // sinon (dans ce cas la quantité est inférieure ou égale à 1)
				} else {
            // le produit est complètement retiré du panier à l'aide de la méthode filter().
						$cart = $cart.filter((cartItem) => cartItem != product)
				}
				return;
			}
		}
  }

  // fonction pour ajouter un produit du panier
  const increaseCart = (product) => {
    // À chaque itération de la boucle, elle vérifie si l'identifiant (id) de l'élément actuel du panier correspond à l'identifiant du produit passé en paramètre
		for(let item of $cart) {
      // Si un élément avec le même identifiant est trouvé dans le panier, cela signifie que le produit est déjà dans le panier. 
			if(item.id === product.id) {
        // Dans ce cas, la quantité de ce produit est augmentée de 1
        product.quantity = product.quantity + 1
				// on réaffecte le panier à lui-même
        $cart = $cart;
				return;
			}
		}
    // on ajoute le nouveau produit au panier
    $cart = [...$cart, product];
  }
  
  // // on additionne tous les prix des produits pour avoir le total du panier
  // // $: : Ce symbole permet de réexécuter cette ligne pour mettre à jour le panier à chaque modification
  // // acc est l'accumulateur. Il prend la dernière somme et ajoute/retire le prix du produit
  $: total = $cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  
  // On déclare les variables pour pouvoir envoyer les données du produit sélectionné
  let selectedProduct = { id: 0, name: '', price: 0, producers_id:'', description:'', categories_id:'', status, unit_type:'', picture:'' }
  // Fonction pour envoyer seulement les données d'un produit
  function selectProduct(product) {
 // Affiche les données du produit sélectionné
  selectedProduct = product;
  // Inverse la valeur de showSidebar. Si elle est true, elle devient false et inversement
  showEditSidebar = !showEditSidebar
  }
</script> 

<div class="products-container">
  <h1 class="title">
    Nos Produits
  </h1>

  <!-- si je suis admin, je peux ajouter un produit -->
  {#if $isAdminStore  === "true"}
  <!-- Bouton Ajouter un produit -->
  <section>
    <button on:click={() => showAddSidebar = !showAddSidebar} class="button admin-button" aria-label="Ajouter un nouveau produit">
      <div class="button-content">
        <div class="button-text">Ajouter un produit</div>
        <CirclePlus class="button-icon"/>
      </div>
    </button>
  </section>
  {/if}

  <!-- barre de recherche -->
  <section class="search-container" id="query-section">
    <div id="search-input-cont">
      <label for="search">Rechercher un produit</label>
  
      <input type="text"
        class="search"
        id="search" 
        placeholder="Entrez votre recherche ici" 
        autocomplete="off"
        bind:value={searchTerm}
        on:input={filterProducts}
        />
    </div> 
  </section>
  <div class="error-message">
    {#if errorMessage}
      <p>{errorMessage}</p>
    {/if} 
  </div> 

  <!-- affichage de la liste de produits -->
  <section class="products-list">


  <!-- boucle pour afficher les produits avec la fonction recherche -->
	{#if searchTerm && filteredProducts.length === 0}
		<NoResults error_message="Nous n'avons pas ce produit."/>		
	{:else if filteredProducts.length > 0}
		{#each filteredProducts as product}
      {#if !product.status}
    <ProductNotAvailable/>		
    {/if}
      
      <div class="product-card">
        <img class="product-image" src="../images/{product.picture}" alt="{product.name}" />
        <div class="line"></div>
        <div class="info">
          <div class="product-name">{product.name}</div>
          <div class="product-price">{product.price} € / {product.unit_type}</div>
        </div>
        <div class="line"></div>
        <div class="description"><p>{product.description}</p></div>
        <div class="line"></div>

        <div class="actions cart-button-action">
          <!-- Ajouter au panier -->
          <!-- Member - (si j'ai un token et que je suis pas admin), je peux afficher le panier  -->
          {#if $tokenStore !== "" && $isAdminStore === "false"}
          <!-- si le produit est actif -->
          {#if product.status}  
            <button on:click={() => decreaseCart(product)}
              class="cart-button-minus"
              aria-label="Supprimer un produit du panier">
              <div class="button-content">
                <CircleMinus class="button-icon"/>
              </div>
            </button>  
            <button on:click={() => increaseCart(product)}
              class="cart-button-plus"
              aria-label="Ajouter un produit au panier">
              <div class="button-content">
                <CirclePlus class="button-icon"/>
              </div>
            </button>  
          {:else}
            <p class="cart-infos">
            Vous ne pouvez pas commander ce produit
            </p>
          {/if}  
          {/if}

          <!--Pour l'Admin-->
          {#if $isAdminStore === "true"}
          <div class = "cartouche-button">  

          <!-- Bouton pour supprimer le produit -->
          <button on:click={() => deleteProduct(product.id)} class="button admin-button" aria-label="Supprimer le produit">
            <div class="button-content">
              <div class="button-text">Supprimer le produit</div>
              <CircleX class="button-icon"/>
            </div>
          </button>

          <!-- Bouton pour activer/désactiver le produit -->
          <!-- Si le produit est activé, on peut le désactivé -->
            {#if product.status}
              <button on:click={() => activeProduct(product.id)} class="button" aria-label="Activer/Désactiver le produit">
                <div class="button-content">
                  <div class="button-text">Désactiver le produit</div>
                  <CircleSlash2 class="button-icon"/>  
                </div>                       
              </button> 
            {:else}
              <button on:click={() => activeProduct(product.id)} class="button" aria-label="Activer/Désactiver le produit">
                <div class="button-content">
                  <div class="button-text">Activer le produit</div>
                  <CircleCheckBig class="button-icon"/>  
                </div>                        
              </button>
            {/if}

          </div>    
          {/if}
        </div>
      </div>
      {/each}
      <!-- Affichage des sidebar -->
      <AddProductSidebar bind:showSidebar={showAddSidebar} />
      <!-- j'affiche sur la sidebar les données du produit sélectionné en cliquant sur le bouton Modifier -->
      <EditProductSidebar {selectedProduct}  bind:showSidebar={showEditSidebar}/>	
	    {/if}
  </section>
</div>

<style>
  .search-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .products-container {
    margin: auto;
    width:100%;
    padding: 7.5rem;
  }

  h1 {
    text-align: center;
   }
 
  .product-image {
    object-fit: cover;
  }
  
  .cartouche-button {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin: 10px;
  }
  
  .admin-button {
    margin-bottom: 10px;
  }
  
  .cart-button-minus, .cart-button-plus {
    border: 0px;
    background-color: white;
    cursor: pointer;
  }
  
  .cart-button-action {
    display: flex;
    justify-content: flex-end;
  }
  
  .cart-infos {
    text-align: center;
    padding-right: 12px;
    color: red;
  }
  
  .search {
    border-radius:5px;
    height: 30px;
    margin: 0 0 10px 5px;
    padding-left: 5px;
  }

  .error-message {
    font-weight: 700;
    color: red;
    display: flex;
    justify-content: center;
  }
</style>