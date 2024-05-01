<script>
  import { cart } from './cart.js'
  import toast from 'svelte-french-toast'
  import { CirclePlus } from 'lucide-svelte';
  import { CircleMinus } from 'lucide-svelte';
  import { push } from 'svelte-spa-router';
  export let showCart = false;

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

  // on crée un tableau vide qui recevra le panier
  // export let cart = [];

  // on additionne tous les prix des produits pour avoir le total du panier
  // $: : Ce symbole permet de réexécuter cette ligne pour mettre à jour le panier à chaque modification
  // acc est l'accumulateur. Il prend la dernière somme et ajoute/retire le prix du produit
  $: total = $cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  
  // fonction pour valider le panier
  async function validateCart(products, total){
    // Demande de confirmation avant de valider le panier
    const confirmation = window.confirm("Valider votre panier ?");
    if (!confirmation) {
        return;
    }

    const order = {
        "userId":localStorage.getItem("USER_ID"),
        "status": true,
        "orderTotalPrice": total
        }
    try {
    const orderEndpoint = import.meta.env.VITE_API_BASE_URL + "order";
    const response = await fetch(orderEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
      },
      body: JSON.stringify(
        {
          order,
          products
        }
      )
    })
    toast.success('Votre commande a bien été prise en compte', 
    {
      position: "top-right"
    });
    $cart.splice(0, $cart.length);
    showCart = false
    // 2. Rediriger l'utilisateur vers l'accueil'
    push('/')
    if (response.ok) {
      console.log("Panier envoyé");
    } else {
      throw new Error('Erreur BDD');
    }
  } catch (error) {
      console.error(error)
      console.log(error);;
  }
  }

  // fonction pour annuler le panier
  function cancelCart($cart)  {
    // Demande de confirmation avant d'annuler un panier
    const confirmation = window.confirm("Annuler votre panier ?");
    if (!confirmation) {
        return;
    }
    $cart.splice(0, $cart.length);
    toast.success("Votre panier est vide", 
    {
      position: "top-right"
    })
    showCart = false
  }
</script>




<div>
  <!-- on affiche le panier -->
  {#if showCart}  
  <section class="cart">
    <h2>Mon panier</h2>
    {#each $cart as product}
    <div class="">
      {product.name}
      <div class="quantity-container">
        <button on:click={() => decreaseCart(product)}
          class="cart-button-minus"
          aria-label="Supprimer un produit du panier">
          <div class="button-content">
            <CircleMinus class="button-icon"/>
          </div>
        </button> 
          <p class="quantity-text">
            {product.quantity}
          </p>
        <button on:click={() => increaseCart(product)}
          class="cart-button-plus"
          aria-label="Ajouter un produit au panier">
          <div class="button-content">
            <CirclePlus class="button-icon"/>
          </div>
        </button>        
      </div>
    </div>  
    {/each}
    <div>
      <p class="total">Total : {total} €</p>
    </div>

    <!-- Valider le panier -->
    <div>
      <button on:click={() => validateCart($cart, total)}
      class="button green-button"
      aria-label="Valider le panier">
      Valider mon panier
    </button>
    <button on:click={() => cancelCart($cart)}
      class="button cancel"
      aria-label="Annuler le panier">
      Annuler mon panier
    </button>
    </div>

    <!-- masquer la sidebar -->
    <!-- au clic, la constante showButtonCart repasse en false et ferme la sidebar -->
    <button
      on:click={() => {showCart = false;}}
      class="button close" 
      aria-label="Fermer le panier">
      Fermer mon panier
    </button>
    </section>
  {/if}
</div>



		
<style>

  .cart {
      position: fixed;
      top: 0;
      margin-top:82px;
      right: 0;
      height: 100%;
      padding: 10px;
      border-left: 1px solid #aaa;
      background: #fff;
      overflow-y: auto;
    	width: 250px;
    }

  .green-button {
    background-color: #BFB749;
    border: 1px solid #000;
    border-radius: 20px;
    font-weight: 700;
  }

  .cancel {
    margin-top: 10px;
    background-color: #E09C5E;
    font-weight: 700;
  }

  .close {
    margin-top: 10px;
    background-color: white;
    font-weight: 700;
  }

  .cart-button-minus, .cart-button-plus {
    border: 0px;
    background-color: white;
    cursor: pointer;
  }

  .quantity-container {
    display: flex;
    align-items: center;
    text-align: center;
    margin-bottom: 10px;
  }

  .quantity-text {
    margin: 0 10px;
  }

  .total {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
  }
</style>