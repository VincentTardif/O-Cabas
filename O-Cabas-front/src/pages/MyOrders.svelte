<script>
  import { link } from "svelte-spa-router";

  // fonction pour récupérer les commandes d'un utilisateur
  async function getMyOrders() {
    try {
      const authEndpoint = import.meta.env.VITE_API_BASE_URL + "my_orders/";
      const response = await fetch(authEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
        }
      });
      if (response.ok) {
        const myOrderData = await response.json();
        // console.log(myOrderData);
        // const total = myOrderData[3].total_price
        // console.log(total);
        // const totalFixed = total.toFixed(2)
        // console.log(totalFixed);

        return myOrderData;
      } else {
        throw new Error('Erreur BDD');
      }
    } catch (error) {
      console.error(error);
    }
  }



</script>

<div class="container">
  <h1>Mes commandes</h1>
  <h2 class="to-prepare">Commandes en cours</h2>
  <div class="orders-list">
    {#await getMyOrders()}
      <p>Chargement en cours. Patientez...</p>
    {:then myOrders}
    {#each myOrders as order}

    <!-- {#if !order.status}
    <p class="no-order">
      Vous n'avez pas de commande en cours
    </p>
    {/if} -->

    {#if order.status}
      <div class="order-list">
        <p class="order_number">Commande n° {order.id} du {new Date(order.createdat).toLocaleDateString()}</p>
        <p>Prix total : <span class="order_price">{order.total_price} €</span></p>
        <p class="to-prepare"> Commande en cours</p>
        <a href="/my_order_detail/{order.id}" use:link>Détail de la commande</a>      
      </div>
    {/if}
    {/each}
    {/await}
  </div>

  <h2 class="to-recover">Commandes à jour</h2>
  <div class="orders-list">
    {#await getMyOrders()}
      <p>Chargement en cours. Patientez...</p>
    {:then myOrders}
    {#each myOrders as order}
    {#if !order.status}
    <div class="order-list">
      <p class="order_number">Commande n° {order.id} du {new Date(order.createdat).toLocaleDateString()}</p>
      <p>Prix total : <span class="order_price">{order.total_price} €</span></p>
      <p class="to-recover"> Commande à jour</p>
      <a href="/my_order_detail/{order.id}" use:link>Détail de la commande</a>      
    </div>
  {/if}
  {/each}
  {/await}
  </div>

</div>

<style>
  h1 {
    text-align: center;
  }

  h2 {
    text-align: center;
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
  
  .orders-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 80%;
    margin: 0 auto;
    justify-content: center;
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