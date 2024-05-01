<script>
  import { link } from "svelte-spa-router";
  import LoginForm from "../components/form/LoginForm.svelte";
  import ForgotPasswordForm from "../components/ForgotPasswordForm.svelte";
  
  //le composant par defaut est "LoginFrom" lors du chargement de la page Account
  let showLoginForm = true;
  let showForgotPasswordForm = false;

  function toggleForgotPassword() {
    showForgotPasswordForm = !showForgotPasswordForm;
  }

</script>

<div class="container">
  <div class="login-container">
  {#if showLoginForm && !showForgotPasswordForm}
    <LoginForm/>
    <a href='/login'
    role="button"
    tabindex="0"
    on:click|preventDefault={toggleForgotPassword}
    on:keypress={toggleForgotPassword}
    > Mot de passe oublié ?</a>  <!-- {:else if !showLoginForm && !showForgotPasswordForm}
    <RegisterForm/>
    <p>J'ai déjà un compte ? <a href="#" on:click|preventDefault={toggleForm}>Se connecter</a></p> -->
  {:else}
    <ForgotPasswordForm />
    <a href="/login"
    role="button"
    tabindex="0"
    on:click|preventDefault={toggleForgotPassword}
    on:keypress={toggleForgotPassword}
    >Retour à la Connexion</a>  
  {/if}
    <!-- Lien vers page de connexion -->
    <div>
      Pas encore de compte ?
      <a
      class="theme-minor-link"
      href="/register"
      aria-label="Créez-vous un compte"
      use:link>S'inscrire</a
      >
    </div>
  </div>  
</div>

<style>
  .login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>