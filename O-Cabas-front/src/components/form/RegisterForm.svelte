<script>
  import toast, {Toaster} from 'svelte-french-toast'
  import { push } from 'svelte-spa-router';

  // on définit les variables pour pouvoir faire un reset dessus à la fin de l'envoie du formulaire
  let firstname, lastname, email, password, phone_number, date_of_birth, address, zip_code, city, avatar, errorMessage;

  // fonction pour valider l'email
  // Avant d'envoyer le formulaire, on vérifie que l'email saisi est conforme
  function isValidEmail(input) {
    // Expression régulière pour valider l'email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(input);
  }

  // définition du endpoint
  const registerEndpoint = import.meta.env.VITE_API_BASE_URL  + "register";
  // console.log(registerEndpoint);

  // fonction pour envoyer l'inscription à l'administrateur
  async function sendRegistration(event) {
    event.preventDefault();

    // Validation du champ email
    // Si la validation de l'email a réussi, on envoie le formulaire
    if (!isValidEmail(email)) {
      errorMessage = 'Veuillez saisir une adresse e-mail valide.';
      return;
    }

    const response = await fetch(registerEndpoint, {
  		method: 'POST',
        headers: {
        "Content-Type": "application/json",
        }, 
        body: JSON.stringify(
          {
            firstname,
            lastname,
            email: email,
            password: password,
            phone_number: phone_number,
            date_of_birth: date_of_birth,
            address: address,
            zip_code: zip_code,
            city: city,
            avatar,
            is_admin: false,
            status: false
          }
        )
  	})
    if (response.ok ) {
      const json = await response.json()
      // console.log(json)
      toast.success("Votre demande d'inscription a bien été envoyée",
      {
       position: "top-right"
      })
      push('/');
    // on vide les inputs
    firstname="";
    lastname="";
    email="";
    password="";
    phone_number="";
    date_of_birth="";
    address="";
    zip_code="";
    city="";
    

  } else {
      console.log(
        "Erreur : " + response.status + ", Message : " + response.statusText
      );
  }
};
</script>

<h1>Inscription</h1>
<Toaster />
<!-- register form -->
<form class="form-container">

<!-- firstname -->
  <div class="">
    <label class="" for="firstname">Prénom</label>
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
    <label class="" for="lastname">Nom</label>
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
    <label class="" for="email">Email</label>
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

<!-- password -->
<div class="">
  <label class="" for="email">Mot de passe</label>
  <input
    class="input-field"
    type="password"
    id="password"
    name="password"
    aria-label="mot de passe"
    placeholder="**********"
    bind:value={password}
    required
  >
</div>  

<!-- phone_number -->
<div class="">
  <label class="" for="phone_number">Numéro de portable</label>
  <input
    class="input-field"
    type="text"
    id="phone_number"
    name="phone_number"
    aria-label="numéro de portable"
    placeholder="06 12 34 56 78"
    bind:value={phone_number}
  >
</div>

<!-- date_of_birth -->
<div class="">
  <label class="" for="date_of_birth">Date de naissance</label>
  <input
    class="input-field"
    type="text"
    id="date_of_birth"
    name="date_of_birth"
    aria-label="date de naissance"
    placeholder="01-12-2001"
    bind:value={date_of_birth}
    required
  >
</div>

<!-- address -->
<div class="">
  <label class="" for="adress">Adresse</label>
  <input
    class="input-field"
    type="text"
    id="address"
    name="address"
    aria-label="adresse"
    placeholder="8, rue du Pré"
    bind:value={address}
    required
  >
</div>

<!-- zip_code -->
<div class="">
  <label class="" for="zip_code">Code Postal</label>
  <input
    class="input-field"
    type="text"
    id="zip_code"
    name="zip_code"
    aria-label="code postal"
    placeholder="44350"
    bind:value={zip_code}
    required
  >
</div>

<!-- city -->
<div class="">
  <label class="" for="ville">Ville</label>
  <input
    class="input-field"
    type="text"
    id="ville"
    name="ville"
    aria-label="ville"
    placeholder="Guérande"
    bind:value={city}
    required
  >
</div>

<!-- pour l'accessibilité, on ajoute on:keypress l'input submit. Cela permet de valider avec le clavier -->
<!-- register button -->
  <button
    class="submit-button"
    type="submit"
    value="S'enregistrer"
    aria-label="envoyer la demande d'inscription"
    on:click={sendRegistration}
    on:keypress={sendRegistration}
    >Envoyer ma demande d'inscription
  </button>

</form>

<!-- <p><a href="/#/login">Retour à la Connexion</a></p>   -->


<style>

h1 {
  text-align: center;
}

.form-container {
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

.submit-button {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 10px 16px;
  position: relative;
  overflow: hidden;
  background-color: #E09C5E;
  border: 1px solid black;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 700;
}
</style>

