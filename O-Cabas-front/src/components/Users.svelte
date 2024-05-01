<script>
  import NoResults from '../components/NoResults.svelte'
  import { onMount } from 'svelte';
  import { link } from "svelte-spa-router";

  let userData = [];
  let filteredUsers = [];
  let searchTerm = '';
  let errorMessage = "";

  // fonction pour récupérer les users
  async function getUsers() {
    try {
      const authEndpoint = import.meta.env.VITE_API_BASE_URL + "users";
      const response = await fetch(authEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
        }
      });
      if (response.ok) {
        const usersData = await response.json();
        return usersData;
      } else {
        throw new Error('Erreur BDD');
      }
    } catch (error) {
      console.error(error);
      errorMessage = "Problème de connexion à la base de données";
    }
  }

  // Fonction qui normalise du texte en supprimant les accents
	// source : https://www.30secondsofcode.org/js/s/remove-accents/
  // NFD est le normalisation Unicode utilisée et /[\u0300-\u036f]/g, '' la regex qui va enlever les accents aux caractères accentués
  const removeAccents = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // console log pour vérifier si la fonction est OK
  // console.log(removeAccents("Véronique"));

  // Utilisation de onMount pour exécuter le code une fois le DOM est monté
  onMount(async () => {
    // Attendre que les données utilisateur soient récupérées depuis le serveur
    userData = await getUsers();
    // Filtrer les utilisateurs une fois que les données sont récupérées
    filterUsers();
  });

  // Fonction qui filtre les utilisateurs en fonction de la recherche, en ignorant les accents et les majuscules
  function filterUsers() {
    // Normalisation de la recherche en retirant les accents et en le convertissant en minuscules
    const sanitizedFilter = removeAccents(searchTerm).toLowerCase();
    // Filtrage des utilisateurs en vérifiant si le prénom et le nom de famille concaténés contiennent la recherche normalisée
    return filteredUsers = userData.filter(user => 
    removeAccents(user.firstname.toLowerCase() + ' ' + user.lastname.toLowerCase())
    .includes(sanitizedFilter));
  }
</script>


<section class="search-container" id="query-section">
  <div id="search-input-cont">
    <label for="search">Rechercher un adhérent</label>

    <input type="text"
      class="input-field"
      id="search" 
      placeholder="Entrez votre recherche ici" 
      autocomplete="off"
      bind:value={searchTerm}
      on:input={filterUsers}/>
  </div> 
</section>
<div class="error-message">
  {#if errorMessage}
    <p>{errorMessage}</p>
  {/if} 
</div> 

<section class="users_list">
  {#if searchTerm && filteredUsers.length === 0}
  <NoResults error_message="Pas d'adhérent à ce nom"/>		
  {:else if filteredUsers.length > 0}
  <table>
    <caption>
      <h2>Listes des adhérents de O'Cabas</h2>
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
      {#each filteredUsers as user}
      {#if user.status === true && user.is_admin === true}
        <tr class="admin">
          <th scope="row"><a href="/user/{user.id}" use:link>{user.firstname}</a></th>
          <td><a href="/user/{user.id}" use:link>{user.lastname}</a></td>
          <td><a href="/user/{user.id}" use:link>{user.email}</a></td>
          <td><a href="/user/{user.id}" use:link>{user.phone_number.replace(/^\+33/, '0')}</a></td>
          <td><a href="/user/{user.id}" use:link>{user.city}</a></td>
          <td><a href="/user/{user.id}" use:link>Admin</a></td>
        </tr>
      {:else if user.status === true}
      <tr>
        <th scope="row"><a href="/user/{user.id}" use:link>{user.firstname}</a></th>
        <td><a href="/user/{user.id}" use:link>{user.lastname}</a></td>
        <td><a href="/user/{user.id}" use:link>{user.email}</a></td>
        <td><a href="/user/{user.id}" use:link>{user.phone_number.replace(/^\+33/, '0')}</a></td>
        <td><a href="/user/{user.id}" use:link>{user.city}</a></td>
        <td><a href="/user/{user.id}" use:link>A jour</a></td>
      </tr>
      {:else}
      <tr>
        <th scope="row"><a href="/user/{user.id}" use:link>{user.firstname}</a></th>
        <td><a href="/user/{user.id}" use:link>{user.lastname}</a></td>
        <td><a href="/user/{user.id}" use:link>{user.email}</a></td>
        <td><a href="/user/{user.id}" use:link>{user.phone_number.replace(/^\+33/, '0')}</a></td>
        <td><a href="/user/{user.id}" use:link>{user.city}</a></td>
        <td><a href="/user/{user.id}" use:link><span>A valider</span></a></td>
      </tr>
      {/if}
      {/each}
  </table>
  {/if}
</section>

<style>
  .search-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .users_list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .input-field {
    border-radius:5px;
    height: 30px;
    margin: 0 0 10px 5px;
    padding-left: 5px;
  }

  .admin {
    background-color: blue,
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
    color: black;
  }

  .error-message {
    font-weight: 700;
    color: red;
    display: flex;
    justify-content: center;
  }
</style>