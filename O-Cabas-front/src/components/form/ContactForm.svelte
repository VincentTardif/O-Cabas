<script>
  import toast from 'svelte-french-toast'

  import { ArrowRightToLine } from 'lucide-svelte';
  import { push } from 'svelte-spa-router';
  // email validation function 
  function isValidEmail(input) {
    // Expression régulière pour valider l'email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(input);
  }
  
  let firstname, lastname, email, message, errorMessage;
  // fonction pour envoyer le formulaire de la page contact
  async function postMessage(event) {
    event.preventDefault();
    // Validation du champ email
    // Si la validation de l'email a réussi, on envoie le formulaire
    if (!isValidEmail(email)) {
      errorMessage = 'Veuillez saisir une adresse e-mail valide.';
      return;
    }
    const contactEndpoint = import.meta.env.VITE_API_BASE_URL  + "contact";
    const response = await fetch(contactEndpoint, {
  		method: 'POST',
        headers: {
        "Content-Type": "application/json",
        }, 
        body: JSON.stringify(
          {
            firstname,
            lastname,
            email: email,
            message
          }
        )
  	})
    toast.success("Votre message a bien été envoyé")
    push('/')
    if (response.ok ) {
      const json = await response.json()
    // on vide les inputs
    firstname="";
    lastname="";
    email="";
    message="";
  } else {
      console.log(
        "Erreur : " + response.status + ", Message : " + response.statusText
      );
  }
};
</script>

<!-- register form -->
<h1>Contact</h1>

<form class="form-container" on:submit={postMessage}>

<!-- firstname -->
  <div class="">
    <label class="" for="firstname">Quel est votre prénom ?</label>
    <input
      class="input-field"
      type="text"
      id="firstname"
      name="firstname"
      aria-label="prénom"
      placeholder="Prénom"
      bind:value={firstname}
      required
    >
  </div>

<!-- lastname -->
  <div class="">
    <label class="" for="lastname">Quel est votre nom ?</label>
    <input
      class="input-field"
      type="text"
      id="lastname"
      name="lastname"
      aria-label="nom"
      placeholder="Nom"
      bind:value={lastname}
      required
    >
  </div>

<!-- email -->
  <div class="">
    <label class="" for="email">Votre adresse email:</label>
    <input
      class="input-field"
      type="email"
      id="email"
      name="email"
      aria-label="adresse email"
      placeholder="banana.exemple@mail.com"
      bind:value={email}
      required
    >
  </div>

<!-- message -->
  <div class="">
    <label for="message">Votre message :</label>
  </div>
  <div>
    <textarea
      class="input-text-area"
      rows="5"
      cols="33"
      id="message"
      name="message"
      aria-label="message"
      placeholder="Message, Suggestions, Questions,..."
      bind:value={message}
      required        
    ></textarea>
  </div>

<!-- pour l'accessibilité, on ajoute on:keypress l'input submit. Cel permet de valider avec le clavier -->  
<!-- send form button -->
  <button
    class="submit-contact-button"
    type="submit"
    value="Envoyer le message"
    aria-label="Envoyer le message"
    on:click={postMessage}
    on:keypress={postMessage}>

  <div class="button-text">Envoyer le message</div>
  <ArrowRightToLine class="button-icon"/>
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
}

.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

</style>