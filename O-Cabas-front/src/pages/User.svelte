<script>
  import toast from 'svelte-french-toast'
  import { push } from "svelte-spa-router";
  import { CircleDot } from 'lucide-svelte';
  import { CircleX } from 'lucide-svelte';

  // on demande au router de stocker les infos de l'URL, dont l'id
  export let params = {}

  // récupérer un user
  async function getUser(userId) {
  const userEndpoint = import.meta.env.VITE_API_BASE_URL  + "user/" + userId
  const response = await fetch(userEndpoint, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
      }
  })
// on gère les erreurs
// si notre réponse est OK
    if (response.ok) {
    const userData = await response.json();
    return userData
  } else {
    console.log("Erreur : " + response.status + ". Message : " + response.statusText);
  }
  };  

  // Valider une inscription
  async function validateUser() {
  // Demande de confirmation avant de valider l'inscription
  const confirmation = window.confirm("Valider l'inscription de cet adhérent ?");
    if (!confirmation) {
        return;
    }
  let userStatus
  const user = await getUser(params.id);
  const userEndoint = import.meta.env.VITE_API_BASE_URL  + "user/" + params.id
    if (user.status) {
      userStatus = false;
    } else if (!user.status) {
      userStatus = true;
    }
    const response = await fetch (userEndoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
      },
        body: JSON.stringify(
          { 
            status: userStatus
          }          
        )
    })
    if (response.ok ) {
    const json = await response.json()
    
    if (user.status) {
      toast.success("Cet adhérent ne fait plus partie de O'Cabas")   
    
    } else if (!user.status) {
      toast.success("Inscription validée")   
    }
    push("/users")
  }
  }

  // Passer un adhérent en admin
  async function beAdmin() {
  // Demande de confirmation avant de passer un adhérent admin
  const confirmation = window.confirm("Passer cet adhérent en admin ?");
  if (!confirmation) {
      return;
  }
  let userAdmin
  const user = await getUser(params.id);
  const userEndoint = import.meta.env.VITE_API_BASE_URL  + "user/" + params.id
    if (user.is_admin) {
      userAdmin = false;
    } else if (!user.is_admin) {
      userAdmin = true;
    }
    const response = await fetch (userEndoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
      },
      body: JSON.stringify(
          {
            is_admin: userAdmin,
          }
      )
    })
    if (response.ok ) {
    const json = await response.json()
    if (user.is_admin) {
      toast.success("Cet adhérent n'est plus administateur")   
    } else if (!user.is_admin) {
      toast.success("Cet adhérent est maintenant administateur")   
    }
    // on redirige sur la page d'accueil
    push("/users")
  }
  }

  // Supprimer un adhérent
  async function deleteUser() {
    // Demande de confirmation avant de passer un adhérent admin
    const confirmation = window.confirm("Supprimer cet adhérent ?");
    if (!confirmation) {
        return;
    }
    const deleteUserEndoint = import.meta.env.VITE_API_BASE_URL  + "user/" + params.id
    // console.log(validateUserEndoint);

      const response = await fetch (deleteUserEndoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
        },

      })
      if (response.ok ) {
      const json = await response.json()
      toast.success("Cet adhérent a été supprimé")
      push("/users")

    }
  }
</script>

<div class="container">
  {#await getUser(params.id)}
  <p>Chargement en cours. Patientez...</p>
{:then user}
  <div class="table-container">
    <table>
    <caption>
      <h2>Adhésion de {user.firstname} {user.lastname}</h2>
    </caption>
    <thead>
      <tr>
        <th scope="col">Prénom</th>
        <th scope="col">Nom</th>
        <th scope="col">Email</th>
        <th scope="col">Téléphone</th>
        <th scope="col">Ville</th>
        <th scope="col">Adhésion</th>
      </tr>
    </thead>
    <tbody>
        <tr class="admin">
          <!-- l'attribut scope indique que la cellule d'en-tête concerne une ligne dans le tableau -->
          <th scope="row"><a href="/user/{user.id}" >{user.lastname}</a></th>
          <td><a href="/user/{user.id}" >{user.firstname}</a></td>
          <td><a href="/user/{user.id}" >{user.email}</a></td>
          <td><a href="/user/{user.id}" >{user.phone_number.replace(/^\+33/, '0')}</a></td>
          <td><a href="/user/{user.id}" >{user.city}</a></td>
          {#if user.status === true && user.is_admin === true}
          <td><a href="/user/{user.id}" >Admin</a></td>
          {:else if user.status === true}
          <td><a href="/user/{user.id}">A jour</a></td>
          {:else}
          <td><a href="/user/{user.id}"><span>A valider</span></a></td>
          {/if}

        </tr>
    </table>
  </div>
  <!-- Boutons pour gérer une adhésion -->
  {#if user.is_admin}
    <p>Vous ne pouvez pas gérer cet adhérent</p>
    <div class="button-container">
      <a href="/#/users">
        <button 
          class="button cancel"
          aria-label="Retour à la liste des adhérents">
          Retour à la liste des adhérents
        </button>
      </a>
    </div>
  {:else}
    <div class="button-container">
      <div>
      {#if !user.status}
        <!-- Bouton pour valider l'inscription -->
        <button on:click={validateUser} on:keypress={validateUser}
          class="button admin-button" aria-label="Valider l'inscription">           
          <div class="button-content">
            <div class="button-text">Valider l'inscription</div>
            <CircleDot class="button-icon"/>
          </div>
        </button>
      {:else}
        <button on:click={validateUser} on:keypress={validateUser}
          class="button admin-button" aria-label="Annuler l'adhésion">           
          <div class="button-content">
            <div class="button-text">Annuler l'adhésion</div>
            <CircleDot class="button-icon"/>
          </div>
        </button>
      {/if}
      </div>
    
      <div>
        <button on:click={deleteUser} on:keypress={deleteUser}
          class="button admin-button" aria-label="supprimer cet adhérent">
          <div class="button-content">
            <div class="button-text">Supprimer l'adhérent</div>
            <CircleX class="button-icon"/>
          </div>
        </button>
      </div>
      <div>
        <a href="/#/users">
          <button 
            class="button cancel"
            aria-label="Retour à la liste des adhérents">
            Retour à la liste des adhérents
          </button>
        </a>
      </div>
    </div>
  {/if}  

{:catch error}
  <p>erreur : {error.message}</p>
{/await}
  </div>

<style>
  .table-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .cancel {
    margin-top: 10px;
    background-color: #E09C5E;
    font-weight: 700;
  }

  .admin-button {
    margin-bottom: 10px;
  }

  span {
    font-weight: 700;
    color:#a70e0e;
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

  a {
    text-decoration: none;
    color: black
  }

  p {
    text-align: center;
    color: red;
  }

</style>