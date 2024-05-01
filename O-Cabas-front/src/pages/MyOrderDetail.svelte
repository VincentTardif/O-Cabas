<script>
  export let params = {}
  
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




  // fonction pour récupérer les détails d'une commande
  async function getMyOrderDetail() {
    try {
      const authEndpoint = import.meta.env.VITE_API_BASE_URL + "my_order_detail/" + params.id;
      const response = await fetch(authEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
        }
      });
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
  
<div class="container">
  <h1>Détail de ma commande</h1>
  <div class="order-detail-container">
    {#await getMyOrderDetail()}
      <p>Chargement en cours. Patientez...</p>
    {:then myOrderDetail}
    {#each myOrderDetail as orderDetail}
    <div class="order-detail">
      <p class="product">{orderDetail.product_name}</p>
      <p>Quantité : {orderDetail.quantity}</p>
      <p class="price">Prix : {orderDetail.total_price_product} €</p>
    </div>
    {/each}
    {/await}
  </div>
  <div class="button-container">
    <a href="/#/my_orders">
      <button 
        class="button cancel"
        aria-label="Retour à la liste de mes commandes">
        Retour à la liste de mes commandes
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