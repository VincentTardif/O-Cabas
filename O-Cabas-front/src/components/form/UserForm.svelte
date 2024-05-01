<script>
  // https://www.thisdot.co/blog/handling-forms-in-svelte
  let firstname, lastname, email, phone_number, date_of_birth, adress, zip_code, city, avatar, is_admin, status, errorMessage;
  
  // email validation function 
  function isValidEmail(input) {
  // Expression régulière pour valider l'email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(input);
  }  
  
  function addUser(event) {
    event.preventDefault();

    // Validation du champ email
    if (!isValidEmail(email)) {
      errorMessage = 'Veuillez saisir une adresse e-mail valide.';
      return;
    }

    const userData = new FormData(event.target);
    const data = {firstname, lastname, email, phone_number,date_of_birth, adress, zip_code, city, avatar, is_admin, status}; 
    console.log(data)
    // on vide les inputs
    firstname=""
    lastname=""
    email=""
    phone_number=""
    date_of_birth=""
    adress=""
    zip_code=""
    city=""
    avatar=""
    is_admin=""
    status=""
    errorMessage=""
  }


</script>

<h2>Ajouter un adhérent</h2>
<!-- register form -->
<form class="" on:submit={addUser}
>

  <!-- firstname -->
    <div class="">
      <label class="" for="firstname">Prénom</label>
      <input
        type="text"
        class=""
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
        type="text"
        class=""
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
        type="email"
        class=""
        id="email"
        name="email"
        aria-label="email"
        placeholder="Email"
        bind:value={email}    
        required    
      >
    </div>
  
  <!-- phone_number -->
  <div class="">
    <label class="" for="phone_number">Portable</label>
    <input
      type="text"
      class=""
      id="phone_number"
      name="phone_number"
      aria-label="numéro de téléphone portable"
      placeholder="06 12 34 56"
      bind:value={phone_number}     
    >
  </div>

  <!-- date_of_birth -->
  <div class="">
    <label class="" for="date_of_birth">Date de naissance</label>
    <input
      type="text"
      class=""
      id="date_of_birth"
      name="date_of_birth"
      aria-label="date de naissance"
      placeholder="01/11/20001"
      bind:value={date_of_birth}     
    >
  </div>
  
  <!-- adress -->
  <div class="">
    <label class="" for="adress">Adresse</label>
    <input
      type="text"
      class=""
      id="adress"
      name="adress"
      aria-label="adresse"
      placeholder="18, rue du Pré"
      bind:value={adress}     
    >
  </div>  

  <!-- zip_code -->
  <div class="">
    <label class="" for="zip_code">Code Postal</label>
    <input
      type="text"
      class=""
      id="zip_code"
      name="zip_code"
      aria-label="code postal"
      placeholder="44350"
      bind:value={zip_code}     
    >
  </div>

  <!-- city -->
  <div class="">
    <label class="" for="city">Ville</label>
    <input
      type="text"
      class=""
      id="city"
      name="city"
      aria-label="ville"
      placeholder="Guérande"
      bind:value={city}     
    >
  </div>    

  <!-- avatar -->
    <div class="">
      <label class="" for="picture">Avatar</label>
      <input
        class=""
        type="file"
        id="avatar"
        name="avatar"
        aria-label="avatar"
        accept="image/png, image/jpeg"
        bind:value={avatar}      
      >
    </div>

  <!-- is_admin -->
  <div class="">
    <label class="" for="is_admin">Administrateur</label>
    <input
      class=""
      type="checkbox"
      id="is_admin"
      name="is_admin"
      aria-label="administrateur"
      bind:value={is_admin}
    >
    </div>

  <!-- status -->
  <div class="">
    <label class="" for="status">Actif</label>
    <input
      class=""
      type="checkbox"
      id="status"
      name="status"
      aria-label="actif"
      bind:value={status}
    >
    </div>

  <!-- error message -->
    {#if errorMessage}
      <p style="color: red;">{errorMessage}</p>
    {/if}

  <!-- pour l'accessibilité, on ajoute on:keypress l'input submit. Cel permet de valider avec le clavier -->  
  <!-- send form button -->
    <button
      type="submit"
      class=""
      value="Enregister le formulaire"
      aria-label="ajouter le producteur"
      on:keypress={addUser}
      >Ajouter l'adhérent
    </button>
  
  </form>