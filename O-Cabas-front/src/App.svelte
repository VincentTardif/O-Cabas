<script>
  import Router, { location } from "svelte-spa-router";
  import Header from './components/Header.svelte'
  import Footer from './components/Footer.svelte'

  import routes from "./routes";
</script>

<Header />
<main>
  <Router {routes} />
</main>
<Footer />

<style>
</style>