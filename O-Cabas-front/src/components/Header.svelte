<script>
  import Cart from '../components/Cart.svelte';
  
  //Icons library lucide
  import { User } from 'lucide-svelte';
  import { ShoppingCart } from 'lucide-svelte';
  import { AlignJustify } from 'lucide-svelte';
  import { X } from 'lucide-svelte';

  import toast, {Toaster} from 'svelte-french-toast'
  
  // on importe push pour rediriger vers la page d'accueil après l'authentification
  import { link } from "svelte-spa-router";

  import { tokenStore } from "../store";
  import { isAdminStore } from "../store";
  import { userFirstnameStore } from "../store";

  import { cart } from './cart.js';

  let showSidebar = false;

  // fonction pour se déconnecter
  async function userLogout(event) {
    event.preventDefault()
    const logoutEndpoint = import.meta.env.VITE_API_BASE_URL  + "logout";
    const response = await fetch(logoutEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem("USER_TOKEN")}`
      },
    });
    // gestion des erreurs
    if (response.ok) {

    // Effacer le token stocké dans le localStorage
    localStorage.removeItem("USER_TOKEN");
    localStorage.removeItem("IS_ADMIN");
    localStorage.removeItem("USER_ID");
    localStorage.removeItem("USER_FIRSTNAME");
    localStorage.removeItem("USER_LASTNAME");
    localStorage.removeItem("USER_EMAIL");
    localStorage.removeItem("USER_PHONENUMBER");
    localStorage.removeItem("USER_ADDRESS");
    localStorage.removeItem("USER_ZIPCODE");
    localStorage.removeItem("USER_CITY");

    
    toast.error('Vous avez été déconnecté', {
	    position: "top-right"
    })
    // // on fait appel à une méthode du router pour "pousser" le visiteur vers une autre url(la page d'accueil en    l'occurence)
    // 2. Rediriger l'utilisateur vers l'accueil'
    setTimeout(function(){location.href="/"} , 500);
    } else {
      console.log(
        "Erreur : " + response.status + ", Message : " + response.statusText
      );
    }
  } 
  
  /* BURGER MERNU */
  // fonction pour dérouler le burger menu
  let menuOpen = false;
  function toggleBurgerMenu() {
    menuOpen = !menuOpen;
  }

  // fonction pour fermer le burger menu
  function closeBurgerMenu() {
    menuOpen = false;
  }


</script>

<!-- On appelle le module qui gère les toasts -->
<Toaster />
<header>
  <nav class="navbar" aria-label="Barre de navigation">
    <div class="logo" aria-label="Accèder à la page d'accueil du site">
      <a href="/">O'Cabas</a>
    </div>

    {#if $tokenStore == ""}
    <!-- Si je suis utilisateur non connecté, je peux voir les pages :
      Accueil,
      Nos Producteurs,
      Nos Produits,
      Contact,
      Connexion
      Inscription
    -->
    <ul class="links">
      <!-- producers -->
      <li><a href="/producers" class="link" aria-label="Accèder à la liste des producteurs partenaires"
        use:link>Nos Producteurs
      </a></li>

      <!-- products -->
      <li><a href="/products" class="link" aria-label="Accèder à la liste des produits"
        use:link>Nos Produits
      </a></li>  

      <!-- contact link -->
      <li><a href="/contact" class="link" aria-label="Contacter l'association"
        use:link>Contact
      </a></li>
    </ul>

    <div class="buttons">
      <!-- login link -->
      <a href="/login" class="action_button" aria-label="Se connecter"
        use:link>Connexion
      </a>  

      <!-- register link -->
      <a href="/register" class="action_button register" aria-label="S'enregistrer"
        use:link>Inscription
      </a>  
    </div>

  
    <!-- si je suis adhérent, je peux voir les pages :
      Accueil,
      Nos Producteurs,
      Nos Produits,
      Mes Commandes,
      Contact,
      Déconnexion,
      Mon Compte,
      Mon panier        
    -->
    {:else if $isAdminStore  === "false"}
    <ul class="links">
      <!-- producers -->
      <li><a href="/producers" class="link" aria-label="Accèder à la liste des producteurs partenaires"
        use:link>Nos Producteurs
      </a></li>
    
      <!-- products -->
      <li><a href="/products" class="link" aria-label="Accèder à la liste des produits"
        use:link>Nos Produits
      </a></li>  
    
      <!-- myorder -->
      <li><a href="/my_orders" class="link" aria-label="Accèder à la liste de mes commandes"
        use:link>Mes Commandes
      </a></li>   

      <!-- déconnexion -->
      <li>
        <a on:click={userLogout}
          href="/"
          class="link"
          aria-label="Se déconnecter"
          use:link>Déconnexion</a
        >
      </li>
    </ul>
    
    <div class="buttons">
      <!-- account -->
      <div class="icon-user">
        <a href="/account" aria-label="Mon compte" use:link>
          <User class="icon"/> 
        </a>
        <a
          href="/account"
          class="user"
          aria-label="Mon compte"
          use:link>{$userFirstnameStore}</a
        >  
      </div>

      <!-- cart -->
      {#if $cart.length > 0}
      <div class="icon-user">             
        <!-- On affiche le panier, si il y a quelque chose dedans -->
        <button on:click={() => showSidebar = !showSidebar} class="cart-icon">
          <ShoppingCart class="icon"/>
          {$cart.length}
          <!-- {$product.quantity} -->
        </button>
        <Cart bind:showCart={showSidebar} />
      </div>
      {/if}
    </div>

    {:else}
    <!-- si je suis admin, je peux voir les pages :
      Accueil => O'Cabas Logo,
      Producteurs,
      Produits,
      Commandes,
      Déconnexion,
      Mon Compte,        
    --> 
    <ul class="links">
      <!-- producers -->
      <li><a href="/producers" class="link" aria-label="Accèder à la liste des producteurs partenaires"
        use:link>Producteurs
      </a></li>
    
      <!-- products -->
      <li><a href="/products" class="link" aria-label="Accèder à la liste des produits"
        use:link>Produits
      </a></li>  

      <!-- users -->
      <li><a href="/users" class="link" aria-label="Accèder à la liste des adhérents"
        use:link>Adhérents
      </a></li>
    
      <!-- orders -->
      <li><a href="/orders" class="link" aria-label="accèder à la liste des commandes des adhérents"
        use:link>Commandes
      </a></li>

      <!-- déconnexion -->
      <li>
        <a on:click={userLogout}
          href="/"
          class="link"
          aria-label="Se déconnecter"
          use:link>Déconnexion</a
        >
      </li>
    </ul>

    <!-- account -->
    <div class="icon-user">
      <a href="/account" aria-label="Mon compte" use:link>
        <User class="icon"/> 
      </a>
      <a
        href="/account"
        class="admin"
        aria-label="Mon compte"
        use:link>Admin</a
      >  
    </div>
    {/if}
    
    <!------ BURGER MENU ------>
    <button class="burger-menu-button" on:click={toggleBurgerMenu}>
      {#if menuOpen}
        <X class="burger-menu-icon"/>
      {:else}
        <AlignJustify class="burger-menu-icon"/>
      {/if}
    </button>

  </nav>

  <!------ BURGER MENU ------>
  {#if menuOpen}

  <!------ USER ------>
  {#if $tokenStore == ""}
  <div class="burger-menu">
    <ul>
      <!-- producers -->
      <li><a href="/producers" on:click={closeBurgerMenu} lass="link" aria-label="Accèder à la liste des producteurs partenaires"
       use:link>Nos Producteurs
      </a></li>
  
      <!-- products -->
      <li><a href="/products" on:click={closeBurgerMenu} class="link" aria-label="Accèder à la liste des produits"
        use:link>Nos Produits
      </a></li>  
  
      <!-- contact link -->
      <li><a href="/contact" on:click={closeBurgerMenu} class="link" aria-label="Contacter l'association"
        use:link>Contact
      </a></li>
    </ul>
    <div class="divider"></div>
    <div class="buttons-burger-menu">
      <!-- login link -->
      <a href="/login" on:click={closeBurgerMenu} class="action_button" aria-label="Se connecter"
        use:link>Connexion
      </a>  

      <!-- register link -->
      <a href="/register" on:click={closeBurgerMenu} class="action_button register" aria-label="S'enregistrer"
        use:link>Inscription
      </a>  
    </div>
  </div>

  <!------ MEMBER ------>
  {:else if $isAdminStore  === "false"}
  <div class="burger-menu" >
    <ul>    
      <!-- producers -->
      <li><a href="/producers" on:click={closeBurgerMenu} class="link" aria-label="Accèder à la liste des producteurs partenaires"
        use:link>Nos Producteurs
      </a></li>
    
      <!-- products -->
      <li><a href="/products" on:click={closeBurgerMenu} class="link" aria-label="Accèder à la liste des produits"
        use:link>Nos Produits
      </a></li>  
    
      <!-- myorder -->
      <li><a href="/my_orders" on:click={closeBurgerMenu} class="link" aria-label="Accèder à la liste de mes commandes"
        use:link>Mes Commandes
      </a></li>   
    </ul>
    <div class="divider"></div>
    <div class="buttons-burger-menu">
      <!-- login link -->
      <a href="/account" on:click={closeBurgerMenu} class="action_button" aria-label="Mon compte"
        use:link>Mon Compte
      </a>  

      <!-- register link -->
      <a href="/account" on:click={closeBurgerMenu} class="action_button" aria-label="Mon Panier"
        use:link>Mon Panier
      </a>

      <!-- déconnexion -->
      <a on:click={userLogout} on:click={closeBurgerMenu}
        href="/"
        class="link"
        aria-label="Se déconnecter"
        use:link>Déconnexion
      </a>
    </div>
  </div>

  <!------ ADMIN ------>
  {:else}
  <div class="burger-menu" >
    <ul>
      <!-- producers -->
      <li><a href="/producers" on:click={closeBurgerMenu} class="link" aria-label="Accèder à la liste des producteurs partenaires"
        use:link>Producteurs
      </a></li>

      <!-- products -->
      <li><a href="/products" on:click={closeBurgerMenu} class="link" aria-label="Accèder à la liste des produits"
        use:link>Produits
      </a></li>  

      <!-- users -->
      <li><a href="/users" on:click={closeBurgerMenu} class="link" aria-label="Accèder à la liste des adhérents"
        use:link>Adhérents
      </a></li>

      <!-- orders -->
      <li><a href="/orders" on:click={closeBurgerMenu} class="link" aria-label="accèder à la liste des commandes des adhérents"
        use:link>Commandes
      </a></li>
    </ul>
    <div class="divider"></div>
    <div class="buttons-burger-menu">
      <!-- login link -->
      <a href="/account" on:click={closeBurgerMenu} class="action_button" aria-label="Mon compte"
        use:link>Mon Compte
      </a>

      <!-- déconnexion -->
      <a on:click={userLogout} on:click={closeBurgerMenu}
        href="/"
        class="link"
        aria-label="Se déconnecter"
        use:link>Déconnexion
      </a>
    </div>
  </div>
  {/if}

  {/if}

</header>
