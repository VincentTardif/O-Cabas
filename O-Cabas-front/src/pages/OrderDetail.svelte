<script>
  export let params = {}
  import toast from 'svelte-french-toast'
  import { push } from 'svelte-spa-router';
  import { orderStatusStore } from '../store.js'

  // / fonction pour récupérer les détails d'une commande d'un adhérent
  async function getOrderDetail() {
    try {
      const authEndpoint = import.meta.env.VITE_API_BASE_URL + "order/" + params.id;
      const response = await fetch(authEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
        }
      });
      if (response.ok) {
        const OrderDetailData = await response.json();      
        // console.log(OrderDetailData[0].status);
        orderStatusStore.set(OrderDetailData[0].status)
        // console.log($orderStatusStore);
        return OrderDetailData;
      } else {
        throw new Error('Erreur BDD');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // fonction pour passer une commande en récupérer
  async function orderCompleted() {
    const confirmation = window.confirm("Marquer cette commande comme récupérée ?");
    if (!confirmation) {
        return;
    }
    try {
      const orderCompletedEndpoint = import.meta.env.VITE_API_BASE_URL + "order_completed/" + params.id;
      const response = await fetch(orderCompletedEndpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
        }
      });
      toast.success('Commande récupérée');
      push('/orders');

      if (response.ok) {
        const orderCompleted = await response.json();
        return orderCompleted;
      } else {
        throw new Error('Erreur BDD');
      }
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="container">
  <h1>Détail de la commande</h1>
  <div class="order-detail-container">
    {#await getOrderDetail()}
    <p>Chargement en cours. Patientez...</p>
    {:then ordersDetail}
    {#each ordersDetail as orderDetail}
    {#if orderDetail}
    <div class="order-detail">
      <p class="product">{orderDetail.product_name}</p>
      <p>Quantité : {orderDetail.quantity}</p>
      <p class="price">Prix : {orderDetail.total_price_product} €</p>
    </div>
    {/if}
    {/each}
    {/await}
    <!-- Bouton pour mettre à jour une commande-->
    {#if $orderStatusStore}
    <div class="button-container">
      <button on:click={orderCompleted} on:keypress={orderCompleted}
      class="button green-button" aria-label="Commande récupérée">
        Commande récupérée          
      </button>
    </div>
    {/if}
  </div> 

  <div class="button-container">
    <a href="/#/orders">
      <button 
        class="button cancel"
        aria-label="Retour à la liste de mes commandes">
        Retour à la liste des commandes
      </button>
    </a>
  </div>

</div>

<style>
  h1 {
  text-align: center;
 }
 
  .order-detail-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid black;
    border-radius: 20px;
    width: 350px;
    margin: 0 auto;
    padding: 5px;
  } 
  .order-detail {
    margin: 5px;
  }

  .green-button {
    background-color: #BFB749;
    border: 1px solid #000;
    border-radius: 20px;
    font-weight: 700;
    width: 250px;
    margin-top: 10px;
    margin-bottom: 5px;
  }

  .product {
    font-weight: 700;
  }
    
  .price {
    text-align: right;
    font-weight: 700;
  }
 
 .cancel {
   margin: 0 auto;
   margin-top: 10px;
   background-color: #E09C5E;
   font-weight: 700;
 }
 
 .button-container {
   display: flex;
   flex-direction: row;
   justify-content: center;
 }
</style>