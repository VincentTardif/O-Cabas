<script>
  function handleSubmit(event) {
    event.preventDefault();
    // Logique pour gérer l'envoi du formulaire de mot de passe oublié
  }
</script>

<h2>Mot de passe oublié ?</h2>
<p>Entrez l'email de votre compte, nous vous enverrons un lien pour réinitialiser votre mot de passe</p>

<form on:submit={handleSubmit}>

  <!-- email -->
  <div class="">
    <input
      class=""
      type="email"
      id="email"
      name="email-address"
      aria-label="adresse email"
      placeholder="flo.sotoca@mail.com"
      required
    />
  </div>

  <!-- send form button -->
  <button
    class=""
    type="submit"
    value="Envoyer le formulaire"
    aria-label="soumission formulaire"
  >Envoyer
  </button>
  
</form>