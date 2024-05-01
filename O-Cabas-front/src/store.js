// le store permet de pouvoir récupérer les données d'une variable partout dans le code.
// ça permet de pouvoir récupérer ces données dans un autre script, un autre composant,...
// par convention et par practicité, on les stocke tous ici

// la notion de store représente un outil svelte mettant à disposition des variables à portée globale et plus réactive.
// on importe la méthode pour créer un store, ou plusieurs
import {writable} from "svelte/store"

// ?? "" : si le token est vide, il mettra une string vide
// si il y a un user_token, il le mettra dans le localStorage
// on crée un store pour pour l'utiliser ailleurs
export const tokenStore = writable(localStorage.getItem("USER_TOKEN") ?? "");
// la même chose avec is_admin
export const isAdminStore = writable(localStorage.getItem("IS_ADMIN") ?? "");
// la même chose avec l'id du user
export const userIdStore = writable(localStorage.getItem("USER_ID") ?? "");
export const userFirstnameStore = writable(localStorage.getItem("USER_FIRSTNAME") ?? "");
export const userLastnameStore = writable(localStorage.getItem("USER_LASTNAME") ?? "");
export const userEmailStore = writable(localStorage.getItem("USER_EMAIL") ?? "");
export const userPhoneNumberStore = writable(localStorage.getItem("USER_PHONENUMBER") ?? "");
export const userAddressStore = writable(localStorage.getItem("USER_ADDRESS") ?? "");
export const userZipCodeStore = writable(localStorage.getItem("USER_ZIPCODE") ?? "");
export const userCityStore = writable(localStorage.getItem("USER_CITY") ?? "");
export const orderStatusStore = writable([]);

export const cartStore =  writable([])






