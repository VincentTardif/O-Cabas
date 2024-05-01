<script>
  import { link, params } from "svelte-spa-router";
  import { onMount } from 'svelte';
  import NoResults from '../components/NoResults.svelte';
  import { orderStatusStore } from '../store.js'



  // fonction pour récupérer les commandes d'un utilisateur sur la page Commandes
  async function getOrders() {
    try {
      const authEndpoint = import.meta.env.VITE_API_BASE_URL + "orders/";
      const response = await fetch(authEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
        }
      });
      if (response.ok) {
        const ordersData = await response.json();
        return ordersData;
      } else {
        throw new Error('Erreur BDD');
      }
    } catch (error) {
      console.error(error);
    }
  }


  // pour la recherche
  let searchTerm = "";
  let orderData = [];
  let filteredOrders = [];


  // Fonction qui normalise du texte en supprimant les accents
  // source : https://www.30secondsofcode.org/js/s/remove-accents/
  // NFD est le normalisation Unicode utilisée et /[\u0300-\u036f]/g, '' la regex qui va enlever les accents aux caractères accentués
  const removeAccents = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Fonction qui filtre les commandes en fonction de la recherche, en ignorant les accents et les  majuscules
  function filterOrders() {
  // Normalisation de la recherche en retirant les accents et en le convertissant en minuscules
  const sanitizedFilter = removeAccents(searchTerm).toLowerCase();
  // Filtrage des commandes en vérifiant si le prénom et le nom de famille concaténés contiennent la recherche normalisée
  return filteredOrders = orderData.filter(order => 
  removeAccents(order.fullname.toLowerCase())
  .includes(sanitizedFilter));
  }

  // Utilisation de onMount pour exécuter le code une fois le DOM est monté
  onMount(async () => {
  // Attendre que les données utilisateur soient récupérées depuis le serveur
  orderData = await getOrders();
  // Filtrer les utilisateurs une fois que les données sont récupérées
  filterOrders();
  });
</script>

<div class="container">
  <h1>
    Commandes des adhérents 
  </h1>
  <!-- barre de recherche -->
  <section class="search-container" id="query-section">
    <div id="search-input-cont">
      <label for="search">Rechercher une commande</label>
  
      <input type="text"
        class="search"
        id="search" 
        placeholder="Prénom et/ou Nom" 
        autocomplete="off"
        bind:value={searchTerm}
        on:input={filterOrders}
        />
    </div> 
  </section>

  <!-- affichage des commandes selon la recherche -->
  <h2 class="to-prepare">Commandes en cours</h2>
  <div class="orders-list">
    {#if searchTerm && filteredOrders.length === 0}
		<NoResults error_message="Aucune commande à ce nom"/>		
	  {:else if filteredOrders.length > 0}
		{#each filteredOrders as order}

    {#if order.status}
    <div class="order-list">
      <p class="order_number">Commande n° {order.order_number} du {new Date(order.createdat).toLocaleDateString()} 
      <p class="order_fullname">{order.fullname}</p>
      <p>Prix total : <span class="order_price">{order.total_price_order} €</span></p>
      <p class="to-prepare"> Commande en cours</p>
      <a href="/order/{order.order_number}" use:link>Détail de la commande</a>      
    </div> 
    {/if}
    {/each}
    {/if}
  </div>

  <h2 class="to-recover">Commandes à jour</h2>
  <div class="orders-list">

  {#each filteredOrders as order}
    {#if !order.status}
    <div class="order-list">
      <p class="order_number">Commande n° {order.order_number} du {new Date(order.createdat).toLocaleDateString()} 
      <p class="order_fullname">{order.fullname}</p>
      <p>Prix total : <span class="order_price">{order.total_price_order} €</span></p>
      <p class="to-recover"> Commande à jour</p>
      <a href="/order/{order.order_number}" use:link>Détail de la commande</a>      
    </div>     
    {/if}
  {/each}
  </div>
</div>

<style>
  .search-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .search {
    border-radius:5px;
    height: 30px;
    margin: 0 0 10px 5px;
    padding-left: 5px;
  }

  h1 {
    text-align: center;
   }

   h2 {
    text-align: center;
   }

  .orders-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 80%;
    margin: 0 auto;
    justify-content: center;

  }

  .order-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid black;
    border-radius: 20px;
    width: 350px;
    margin: 0 auto;
    padding: 10px;
    margin-bottom: 20px;
    text-align: center;
  } 
  .to-prepare {
    font-weight: 700;
    color: #005700;
    margin-top: 5px;
  }

  .to-recover {
    font-weight: 700;
    color:#a70e0e;
    margin-top: 5px;
  }
  
  .order_number {
    text-align: center;
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 5px;
  }
  
  .order_fullname {
    text-align: center;
    font-weight: 700;
    margin-bottom: 5px;
  }

  .order_price {
    font-weight: 700;
  }
  
  a {
    margin-top :15px;
    text-decoration: none;
    color: black;
    font-weight: 700;
    font-style: oblique;
  }

  /* .no-order {
    display: inline-block;
    margin-bottom: 20px;
    text-decoration: none;
    color: black;
    font-weight: 700;
    font-style: oblique;
  } */
</style>