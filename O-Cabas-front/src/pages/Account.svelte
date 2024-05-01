<script>
  import { userFirstnameStore } from "../store";
  import { userLastnameStore } from "../store";
  import { userEmailStore } from '../store.js'
  import { userPhoneNumberStore } from '../store.js'
  import { userAddressStore } from '../store.js'
  import { userZipCodeStore } from '../store.js'
  import { userCityStore } from '../store.js'
  import { CircleX } from 'lucide-svelte';
  import toast from 'svelte-french-toast'
  import { isAdminStore } from "../store"

  // Supprimer son compte
  async function deleteUser() {
    // Demande de confirmation avant de passer un adhérent admin
    const confirmation = window.confirm("Supprimer votre compte ?");
    if (!confirmation) {
        return;
    }
    const deleteUserEndoint = import.meta.env.VITE_API_BASE_URL  + "account"
    const response = await fetch (deleteUserEndoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
      },
    })
    // gestion des erreurs
    if (response.ok) {

    // Effacer le token stocké dans le localStorage
    localStorage.removeItem("USER_TOKEN");
    localStorage.removeItem("IS_ADMIN");
    localStorage.removeItem("USER_ID");
    localStorage.removeItem("USER_FIRSTNAME");
    localStorage.removeItem("USER_LASTNAME");
    localStorage.removeItem("USER_EMAIL");
    localStorage.removeItem("USER_PHONENUMBER");
    localStorage.removeItem("USER_ADDRESS");
    localStorage.removeItem("USER_ZIPCODE");
    localStorage.removeItem("USER_CITY");

    toast.error('Votre compte a bien été supprimé', {
      position: "top-right"
    }   
    )

    // // on fait appel à une méthode du router pour "pousser" le visiteur vers une autre url(la page d'accueil en    l'occurence)
    // 2. Rediriger l'utilisateur vers l'accueil'
    setTimeout(function(){location.href="/"} , 250);
    } else {
      console.log(
        "Erreur : " + response.status + ", Message : " + response.statusText
      );
    }
  }

</script>

<div class="container">
  <h1>Mon compte</h1>
  <div class="table-container">
    <table>
    <caption>
      <h2>Mes informations personnelles</h2>
    </caption>
    <thead>
      <tr>
        <th scope="col">Prénom</th>
        <th scope="col">Nom</th>
        <th scope="col">Email</th>
        <th scope="col">Adresse</th>
        <th scope="col">Code Postal</th>
        <th scope="col">Ville</th>
        <th scope="col">Téléphone</th>
      </tr>
    </thead>
    <tbody>
        <tr class="admin">
          <td>{$userFirstnameStore}</td>
          <td>{$userLastnameStore}</td>
          <td>{$userEmailStore}</td>
          <td>{$userAddressStore}</td>
          <td>{$userPhoneNumberStore}</td>
          <td>{$userZipCodeStore}</td>
          <td>{$userCityStore}</td>
        </tr>
    </table>
    {#if $isAdminStore === "false"}
    <div>
      <button on:click={deleteUser}
      class="button admin-button" aria-label="supprimer cet adhérent">
        <div class="button-content">
          <div class="button-text">Supprimer mon compte</div>
          <CircleX class="button-icon"/>
        </div>
      </button>
    </div>
    {/if}
  </div>
</div>

<style>
  h1 {
    text-align: center;
  }

  h2 {
   text-align: center;
  }

  .table-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;    
  }

  table {
    border-collapse: collapse;
    font-family: sans-serif;
    font-size: 0.8rem;
    letter-spacing: 1px;
  }

  caption {
    caption-side: top;
    padding: 10px;
    font-weight: bold;
  }

  thead {
    background-color: #e4e0ae;
  }

  th,
  td {
    padding: 8px 10px;
  }

  td:last-of-type {
    text-align: center;
  }

  .button {
    margin-top: 20px;
  }
</style>