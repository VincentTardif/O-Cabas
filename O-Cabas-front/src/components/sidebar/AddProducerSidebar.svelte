<!-- https://svelte.dev/repl/bcdbbb7f2e584ca58dfd9928887a2923?version=4.2.12 -->

<script>
  import ProducerForm from '../form/ProducerForm.svelte'
  import { CircleX } from 'lucide-svelte';

  
  // la constante showSidebar indique la sidebar est visible ou non.
  // on la définit comme non visible
  export let showSidebar = false;
</script>

{#if showSidebar}
  <nav>
    <!-- Contenu de la sidebar -->
    <div>
      <h2>Ajouter un producteur</h2>

      <!-- on appelle le composant ProducerForm -->
      <ProducerForm />
    </div>
    <!-- masquer la sidebar -->
    <!-- au clic, la constante showSidebar repasse en non visible -->
    <!-- <button on:click={() => {showSidebar = false;}}>Annuler</button> -->
    <button on:click={() => {showSidebar = false;}}
      class="button admin-button cancel" aria-label="Annuler">
      <div class="button-content">
        <div class="button-text">Annuler</div>
        <CircleX class="button-icon"/>
      </div>
    </button>
  </nav>
{/if}

<style>
  nav {
    position: fixed;
    margin-top:80px;
    top: 0;
    right: 0;
    height: 100%;
    padding: 10px;
    border-left: 1px solid #aaa;
    background: white;
    overflow-y: auto;
  	width: 350px;
  }
  
  h2 {
    margin-bottom: 10px;
  }

  .admin-button {
    margin-top: 10px;
  }

  .cancel {
    margin-top: 10px;
    background-color: #E09C5E;
    font-weight: 700;
  }

</style>