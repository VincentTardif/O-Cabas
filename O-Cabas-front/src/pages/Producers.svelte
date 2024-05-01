<script>  
  import { tokenStore } from "../store";
  import { isAdminStore } from "../store";
  
  // Modules Svelte
  import { onMount } from 'svelte';
  import { Search } from 'lucide-svelte';
  import { CirclePlus } from 'lucide-svelte';
  import { CircleX } from 'lucide-svelte';
  import { CircleSlash2 } from 'lucide-svelte';
  import { CircleCheckBig } from 'lucide-svelte';
  import toast from 'svelte-french-toast'

  import ProducerNotAvailable from "../components/ProducerNotAvailable.svelte";
  import NoResults from '../components/NoResults.svelte'
  import AddProducerSidebar from '../components/sidebar/AddProducerSidebar.svelte';
  let producerData = [];
  let showAddSidebar = false;
	let filteredProducers = [];
	let searchTerm = "";
  let errorMessage = "";

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
    errorMessage = "Problème de connexion à la base de données";
  }
  }

  // Supprimer un produit
  async function deleteProducer(producerId) {
    const confirmation = window.confirm("Supprimer ce producteur ?");
    if (!confirmation) {
        return;
    }
  const producerEndpoint = import.meta.env.VITE_API_BASE_URL  + "producer/" + producerId
    const response = await fetch (producerEndpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
      },

    })
    toast.success('Producteur supprimé', 
    {
      position: "top-right"
    });
    if (response.ok ) {
    const json = await response.json()
  }
  // on recharge la page après la suppression
  setTimeout(function(){location.reload()} , 250);
  // location.reload();
  }

  // fonction pour récupérer un produit
  async function getProducer(producerId) {
  const producerEndpoint = import.meta.env.VITE_API_BASE_URL  + "producer/" + producerId
  const response = await fetch(producerEndpoint, {
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
      },
  })
  // on gère les erreurs
  // si notre réponse est OK
    if (response.ok) {
    const producer = await response.json();
    // console.log(producer);
    return producer
  } else {
    console.log("Erreur : " + response.status + ". Message : " + response.statusText);
  }
  };

  // Activer/désactiver un producteur
  async function activeProducer(producerId) {
    const producer = await getProducer(producerId)
    let producerStatus = producer.status;
    const producerEndpoint = import.meta.env.VITE_API_BASE_URL  + "producer/" + producerId;
    if (producer.status) {
      producerStatus = false;
    } else if (!producer.status) {
      producerStatus = true;
    }
    const response = await fetch(producerEndpoint, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("USER_TOKEN")
        },
        body: JSON.stringify({ 
            status: producerStatus
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

  // Fonction qui filtre les utilisateurs en fonction de la recherche, en ignorant les accents et les majuscules
  function filterProducers() {
    // Normalisation de la recherche en retirant les accents et en le convertissant en minuscules
    const sanitizedFilter = removeAccents(searchTerm).toLowerCase();
    // Filtrage des utilisateurs en vérifiant si le prénom et le nom de famille concaténés contiennent la recherche normalisée
    return filteredProducers = producerData.filter(producer => 
    removeAccents(producer.company.toLowerCase())
    .includes(sanitizedFilter));
  }

  // Utilisation de onMount pour exécuter le code une fois le DOM est monté
  onMount(async () => {
  // Attendre que les données utilisateur soient récupérées depuis le serveur
  producerData = await getProducers();
  // Filtrer les utilisateurs une fois que les données sont récupérées
  filterProducers();
  });
</script>

<div class="producers-container">
  <h1 class="title">
    Nos Producteurs
  </h1>

  <!-- si je suis admin, je peux ajouter un produit -->
  {#if $isAdminStore  === "true"}
  <!-- Bouton Ajouter un produit -->
  <section>
    <button on:click={() => showAddSidebar = !showAddSidebar} class="button admin-button" aria-label="Ajouter un nouveau producteur">
      <div class="button-content">
        <div class="button-text">Ajouter un producteur</div>
        <CirclePlus class="button-icon"/>
      </div>
    </button>
  </section>
  {/if}
  
  <!-- barre de recherche -->
  <section class="search-container" id="query-section">
    <div id="search-input-cont">
        <label for="search">Rechercher un producteur</label>
        <input type="text"
          class="search"
          id="search" 
          name="search"
          placeholder="Entrez votre recherche ici" 
          autocomplete="off"
          bind:value={searchTerm}
          on:input={filterProducers}
        />
    </div> 
  </section>
  <div class="error-message">
    {#if errorMessage}
      <p>{errorMessage}</p>
    {/if} 
  </div> 

  <!-- Liste de producteurs -->
  <section class="producers-card-container ">	
    <!-- boucle pour afficher les producteurs avec la fonction recherche -->
	  {#if searchTerm && filteredProducers.length === 0}
      <NoResults error_message="Nous ne connaissons pas ce producteur." />		
	  {:else if filteredProducers.length > 0}

	  {#each filteredProducers as producer}
    <article class="card-article">
      <div class="card-title-container">
        <a class="card-title" href="https://{producer.website_url}">{producer.company}</a>   
      </div>
      <div class="line"></div>
      <img src="../images/{producer.picture}" class="card-img" alt="Profil de {producer.firstname} {producer.lastname}">
      {#if !producer.status}
      <ProducerNotAvailable/>		
      {/if}
      <div class="card-data">
        <p class="card-name">{producer.firstname} {producer.lastname}</p>
        <div class="divider"></div>
        <p class="card-description">{producer.description}</p>
        <p class="card-address">{producer.city}</p>
        
        <!--Pour l'Admin-->
        <div class="producer-container">
          {#if $tokenStore !== "" && $isAdminStore === "true"}
          <!-- Bouton pour supprimer le produit -->
          <button on:click={() => deleteProducer(producer.id)} class="button admin-button-edit" aria-label="Supprimer le producteur">
            <div class="button-content">
              <div class="button-text">Supprimer le producteur</div>
              <CircleX class="button-icon"/>
            </div>
          </button>
          <!-- Bouton pour activer/désactiver le producteur -->
          <!-- Si le producteur est activé, on peut le désactivé -->
          {#if producer.status}
            <button on:click={() => activeProducer(producer.id)} class="button admin-button-edit" aria-label="Activer/Désactiver le producteur">
              <div class="button-content">
                <div class="button-text">Désactiver le producteur</div>
                <CircleSlash2 class="button-icon"/>  
              </div>                       
            </button> 
          {:else}
            <button on:click={() => activeProducer(producer.id)} class="button admin-button-edit" aria-label="Activer/Désactiver le producteur">
              <div class="button-content">
                <div class="button-text">Activer le producteur</div>
                <CircleCheckBig class="button-icon"/>  
              </div>                        
            </button>
          {/if}
          {/if}
        </div>
      </div>
    </article>		
    {/each}	
    <!-- Affichage des sidebar -->
    <AddProducerSidebar bind:showSidebar={showAddSidebar} />
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

  .search {
    border-radius:5px;
    height: 36px;
    margin: 0 0 10px 5px;
    padding-left: 5px;
  }

  h1 {
    text-align: center;
  }

  .producer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .admin-button-edit {
    margin: 4px 0;
  }
  
  .producers-container {
    margin: auto;
    width:100%;
    padding: 7.5rem;
  }

  .error-message {
    font-weight: 700;
    color: red;
    display: flex;
    justify-content: center;
  }
</style>
