<script>
  import toast from 'svelte-french-toast'
  import { CirclePlus } from 'lucide-svelte';

  const webp = ".webp"
  let company, firstname, lastname, description, city, website_url, picture, status;

  // Fonction pour ajouter un produit
async function addProducer(event) {
      // Demande de confirmation avant d'ajouter le producteur
      const confirmation = window.confirm("Ajouter ce producteur ?");
    if (!confirmation) {
      return;
    }
  event.preventDefault();
  const producerEndpoint = import.meta.env.VITE_API_BASE_URL  + "producer/"
  const response = await fetch (producerEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("USER_TOKEN"),
    },
      body: JSON.stringify(
        {
          company,
          firstname,
          lastname,
          description,
          city,
          website_url,
          status: true,
          picture: picture + webp
        }
      )
    })

    
    if (response.ok ) {
    const json = await response.json()
  } else {
    console.log(
      "Erreur : " + response.status + ", Message : " + response.statusText
      );
    }
    toast.success("Producteur ajouté",
    {
      position: "top-right"
    })
    location.reload();

}

</script>

<!-- addProduct form -->
<form class="" action="">
  <!-- company -->
    <div class="">
      <label class="" for="company">Société</label>
      <input bind:value={company}
        class="input-field"
        type="text"
        id="company"
        name="company"
        placeholder="Nom de la société"
        aria-label="société"
      >
    </div>

  <!-- firstname -->
  <div class="">
    <label class="" for="firstname">Prénom</label>
    <input bind:value={firstname}
      class="input-field"
      type="text"
      id="firstname"
      name="firstname"
      placeholder="Prénom"
      aria-label="prénom"
    >
  </div>
  
  <!-- lastname -->
  <div class="">
    <label class="" for="lastname">Nom</label>
    <input bind:value={lastname}
      class="input-field"
      type="text"
      id="lastname"
      name="lastname"
      placeholder="Nom"
      aria-label="nom"
    >
  </div>  

  <!-- description -->
    <div class="">
    <label class="label-text-area" for="description">Description</label>
    <textarea
      class="input-text-area"
      id="description"
      name="description"
      aria-label="description"
      placeholder="Description"
      bind:value={description}
      ></textarea>
    </div>

  <!-- city -->
  <div class="">
    <label class="" for="city">Ville</label>
    <input bind:value={city}
      class="input-field"
      type="text"
      id="city"
      name="city"
      placeholder="Ville"
      aria-label="ville"
    >
  </div>  

  <!-- website_url -->
  <div class="">
    <label class="" for="website_url">Site internet</label>
    <input bind:value={website_url}
      class="input-field"
      type="text"
      id="website_url"
      name="website_url"
      placeholder="Site internet"
      aria-label="site internet"
    >
  </div>  

  <!-- picture -->
    <div class="">
    <label class="" for="picture">Photo</label>
    <input
      class="input-field"
      type="txt"
      id="picture"
      name="picture"
      aria-label="image"
      placeholder="Nom de la photo"
      bind:value={picture}      
    >
    </div>

 
  <!-- pour l'accessibilité, on ajoute on:keypress l'input submit. Cel permet de valider avec le clavier -->  
  <!-- send form button -->
  <button
  on:click={addProducer}
  on:keypress={addProducer}        
  class="button admin-button green-button"
  aria-label="Ajouter le producteur">
    <div class="button-content">
      <div class="button-text">Ajouter le producteur</div>
      <CirclePlus class="button-icon"/>
    </div>
  </button>



</form>

<style>
  .input-field {
    border-radius:5px;
    height: 30px;
    margin: 0 0 10px 5px;
    padding-left: 5px;
  }

  .input-text-area {
  border-radius:5px;
  margin: 0 0 10px 5px;
  padding-left: 5px;
  font-size: 14px;
  }

  .label-text-area {
    position: relative;
    top: -35px;
  }

  .green-button {
    background-color: #BFB749;
    border: 1px solid #000;
    border-radius: 20px;
    font-weight: 700;
  }
</style>