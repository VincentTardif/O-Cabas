<script>
	import toast from 'svelte-french-toast'
  import { tokenStore } from '../../store.js'
  import { isAdminStore } from '../../store.js'
  import { userIdStore } from '../../store.js'
  import { userFirstnameStore } from '../../store.js'
  import { userLastnameStore } from '../../store.js'
  import { userEmailStore } from '../../store.js'
  import { userPhoneNumberStore } from '../../store.js'
  import { userAddressStore } from '../../store.js'
  import { userZipCodeStore } from '../../store.js'
  import { userCityStore } from '../../store.js'

  // on crée les varialbles pour stocker les input du formulaire que l'on a créé dans le form
  let email, password, errorMessage;

  
  // fonction pour s'authentifier
  async function userLogin(event) {
    event.preventDefault()  
    // définition du endpoint
    const loginEndpoint = import.meta.env.VITE_API_BASE_URL  + "login";
    const response = await fetch(loginEndpoint, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    // on stringify ce qu'on envoie au serveur parce que le serveur veut de la donnée brute
    body: JSON.stringify(
        {
            email: email,
            password: password
        }
    )
    });
          // gestion des erreurs
          if (response.ok) {

          // On récupère la réponse au format JSON
          const authJson = await response.json();
          // on récupère la valeur de is_admin pour savoir si le user est admin
          const is_admin = authJson.data.is_admin
          // on récupère les données du user connecté pour le stocker dans le localStorage
          const userId = authJson.data.id
          const userFirstname = authJson.data.firstname
          const userLastname = authJson.data.lastname
          const userEmail = authJson.data.email
          const userPhoneNumber = authJson.data.phone_number
          const userAddress = authJson.data.address
          const userZipCode = authJson.data.zip_code
          const userCity = authJson.data.city

          // si le status est false, l'utilisateur ne pourra pas se connecter
          if (authJson.data.status === false) {
          toast.error("Votre inscription n'a pas encore été validée");
        
          } else {
          // Puis le token
          const token = authJson.token;

          // On utilise le localstorage pour stocker le token
          // setItems pour le stocker. info : Il existe aussi getItems pour les recevoir.
          localStorage.setItem("USER_TOKEN", token)
          // on stocke dans le localstorage si le user est admin
          localStorage.setItem("IS_ADMIN", is_admin)
          // on stocke dans le localstorage les données du user connecté
          localStorage.setItem("USER_ID", userId)
          localStorage.setItem("USER_FIRSTNAME", userFirstname)
          localStorage.setItem("USER_LASTNAME", userLastname)
          localStorage.setItem("USER_EMAIL", userEmail)
          localStorage.setItem("USER_PHONENUMBER", userPhoneNumber)
          localStorage.setItem("USER_ADDRESS", userAddress)
          localStorage.setItem("USER_ZIPCODE", userZipCode)
          localStorage.setItem("USER_CITY", userCity)

          // on stocke aussi le token dans un store pour rendre cette valeur disponible partout
          // avec .set, on l'ajoute dans le store
          // on ajoute le USER_TOKEN, IS_ADMIN, USER_ID du localstorage dans un store
          tokenStore.set(localStorage.getItem("USER_TOKEN"))
          isAdminStore.set(localStorage.getItem("IS_ADMIN"))
          userIdStore.set(localStorage.getItem("USER_ID"))
          userFirstnameStore.set(localStorage.getItem("USER_FIRSTNAME"))
          userLastnameStore.set(localStorage.getItem("USER_LASTNAME"))
          userEmailStore.set(localStorage.getItem("USER_EMAIL"))
          userPhoneNumberStore.set(localStorage.getItem("USER_PHONENUMBER"))
          userAddressStore.set(localStorage.getItem("USER_ADDRESS"))
          userZipCodeStore.set(localStorage.getItem("USER_ZIPCODE"))
          userCityStore.set(localStorage.getItem("USER_CITY"))



          // on efface les inputs. Les effacer permet de faire à utilisateur qu'il s'est bien connecté. Si les données restent là, ça lui indiquerait que ça n'a pas marché
          email = "";
          password = "";

          // on fait appel à une méthode du router pour "pousser" le visiteur vers une autre url(la page d'accueil en    l'occurence)
          // push("/")
          toast.success("Vous êtes maintenant connecté", {
            position: "top-right"
          });
          // push('/')
          setTimeout(function(){location.href="/"} , 500);

          }            
          } else {
            toast.error("Ce compte n'existe pas. Vérifiez vos identifiants de connexion", {
              position: "top-right"
            })
            console.log(
              "Erreur : " + response.status + ", Message : " + response.statusText
            );
          }
        }
</script>

<h1>Connexion</h1>


<!-- login form --> 
<form class="form-container">

  <!-- email field  -->
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

  {#if errorMessage}
    <p style="color: red;">{errorMessage}</p>
  {/if}

  <!-- password field -->
  <div class="">
  <label class="" for="password">Mot de passe</label>
  <input
    class="input-field"
    type="password"
    id="password"
    name="password"
    aria-label="mot de passe"
    placeholder="Mot de passe"
    bind:value={password}
    required
  >
  </div>

  <!-- pour l'accessibilité, on ajoute on:keypress l'input submit. Cela permet  de valider avec le clavier -->
  <!-- login button -->
  <button
    class="submit-button"
    type="submit"
    value="Se connecter"
    aria-label="se connecter"
    on:click={userLogin}
    on:keypress={userLogin}
  >Se connecter
  </button>

</form>

<style>
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