<!-- https://svelte.dev/repl/bcdbbb7f2e584ca58dfd9928887a2923?version=4.2.12 -->

<script>
  // on definit comme masqué la sidebar
  export let sidebar = false;

  import UserForm from '../form/UserForm.svelte'
</script>

{#if sidebar}
  <nav>
    <!-- Contenu de la sidebar -->
    <div>
      <!-- <ProducerForm /> -->
      <UserForm />
    </div>
    <!-- masquer la sidebar -->
    <button on:click={() => {sidebar = false;}}>Annuler</button>
  </nav>
{/if}

<style>
nav {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  padding: 10px;
  border-left: 1px solid #aaa;
  background: #fff;
  overflow-y: auto;
	width: 500px;
}
</style>