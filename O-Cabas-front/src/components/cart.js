import { readable, writable } from 'svelte/store';

// fonction pour récupérer les produits
async function getProducts() {
  try {
    const productsEndpoint = import.meta.env.VITE_API_BASE_URL + "products";
    const response = await fetch(productsEndpoint)
    if (response.ok) {
      const productsData = await response.json();
      return productsData;
    } else {
        throw new Error('Erreur BDD');
    }
  } catch (error) {
      console.error(error);
  }
}

export const products = readable(getProducts())
export const cart = writable([])
