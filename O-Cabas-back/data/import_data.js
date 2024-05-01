import 'dotenv/config';
import debug from 'debug';
import client from '../app/services/db_client.js';
// import data from './users_data.json' assert {type:'json'};

const logger = debug('api:import_data');

async function insert_users() {
    try {
        // Début de la transaction
        await client.query('BEGIN');

        // Boucle sur chaque utilisateur pour l'insérer dans la base de données
        for (const user of data_users) {
            const query = {
                text: `INSERT INTO users (firstname, lastname, email, password, phone_number, date_of_birth, address, zip_code, city, avatar, is_admin, status)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                values: [user.firstname, user.lastname, user.email, user.password, user.phone_number, user.date_of_birth, user.address, user.zip_code, user.city, user.avatar, user.is_admin, user.status]
            };

            await client.query(query);
        }

        // Commit de la transaction
        await client.query('COMMIT');

        logger('Les utilisateurs ont été insérés avec succès dans la base de données.');
    } catch (error) {
        // Rollback de la transaction en cas d'erreur
        await client.query('ROLLBACK');
        logger('Une erreur est survenue lors de l\'insertion des utilisateurs :', error);
    }
}

 async function insert_producers() {
    try {
        // Début de la transaction
        await client.query('BEGIN');

        // Boucle sur chaque producteur pour l'insérer dans la base de données
        for (const producer of data_producers) {
            const query = {
                text: `INSERT INTO producers (company, firstname, lastname, description, city, website_url, picture, status)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                values: [producer.company, producer.firstname, producer.lastname, producer.description, producer.city, producer.website_url, producer.picture, producer.status]
            };

        await client.query(query);
        }

        // Commit de la transaction
        await client.query('COMMIT');

        logger('Les producteurs ont été insérés avec succès dans la base de données.');
        
    } catch (error) {
        // Rollback de la transaction en cas d'erreur
        await client.query('ROLLBACK');
        logger('Une erreur est survenue lors de l\'insertion des producteurs :', error);
    }
}

async function insert_categories() {
    try {
        // Début de la transaction
        await client.query('BEGIN');

        // Boucle sur chaque catégoris pour l'insérer dans la base de données
        for (const category of data_categories) {
            const query = {
                text: `INSERT INTO categories (name, color)
                        VALUES ($1, $2)`,
                values: [category.name, category.color]
            };

            await client.query(query);
        }

        // Commit de la transaction
        await client.query('COMMIT');

        logger('Les categories ont été insérés avec succès dans la base de données.');
    } catch (error) {
        // Rollback de la transaction en cas d'erreur
        await client.query('ROLLBACK');
        logger('Une erreur est survenue lors de l\'insertion des categories :', error);
    }
}

async function insert_products() {
     
     try {
         // Début de la transaction
        await client.query('BEGIN');
         
         // Boucle sur chaque produit pour l'insérer dans la base de données
         for (const product of data_products) {
             const query = {
                 text: `INSERT INTO products (producers_id, categories_id, name, description, unit_type, price, picture, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                values: [product.producers_id, product.categories_id, product.name, product.description, product.unit_type, product.price, product.picture, product.status]
            };
            
        await client.query(query);
        }
        
        // Commit de la transaction
        await client.query('COMMIT');
        
        logger('Les produits ont été insérés avec succès dans la base de données.');
    } catch (error) {
        // Rollback de la transaction en cas d'erreur
        await client.query('ROLLBACK');
        logger('Une erreur est survenue lors de l\'insertion des produits :', error);
    }

}



async function delete_users() {
    try {
        // Début de la transaction
        await client.query('BEGIN');
        
        // Suppression des utilisateurs de la base de données
        const query = {
            text: 'DELETE FROM users',
        };
        await client.query(query);

        // Commit de la transaction
        await client.query('COMMIT');

        logger('Les utilisateurs ont été supprimés avec succès de la base de données.');
    } catch (error) {
        // Rollback de la transaction en cas d'erreur
        await client.query('ROLLBACK');
        logger('Une erreur est survenue lors de la suppression des utilisateurs :', error);
    }
}

async function delete_producers() {
    try {
        // Début de la transaction
        await client.query('BEGIN');

        // Suppression des producteurs de la base de données
        const query = {
            text: 'DELETE FROM producers',
        };
        await client.query(query);

        // Commit de la transaction
        await client.query('COMMIT');

        logger('Les producteurs ont été supprimés avec succès de la base de données.');
    } catch (error) {
        // Rollback de la transaction en cas d'erreur
        await client.query('ROLLBACK');
        logger('Une erreur est survenue lors de la suppression des producteurs :', error);
    }
}

async function delete_categories() {
    try {
        // Début de la transaction
        await client.query('BEGIN');

        // Suppression des catégories de la base de données
        const query = {
            text: 'DELETE FROM categories',
        };
        await client.query(query);

        // Commit de la transaction
        await client.query('COMMIT');

        logger('Les catégories ont été supprimés avec succès de la base de données.');
    } catch (error) {
        // Rollback de la transaction en cas d'erreur
        await client.query('ROLLBACK');
        logger('Une erreur est survenue lors de la suppression des catégories :', error);
    }
}

async function delete_products() {
    try {
        // Début de la transaction
        await client.query('BEGIN');

        // Suppression des produits de la base de données
        const query = {
            text: 'DELETE FROM products',
        };
        await client.query(query);

        // Commit de la transaction
        await client.query('COMMIT');

        logger('Les produits ont été supprimés avec succès de la base de données.');
    } catch (error) {
        // Rollback de la transaction en cas d'erreur
        await client.query('ROLLBACK');
        logger('Une erreur est survenue lors de la suppression des produits :', error);
    }
}





// Exemple d'utilisation de la fonction avec les données fournies
const data_users = [
    {
        
        "firstname": "Jean",
        "lastname": "Dupont",
        "email": "jean.dupont@example.com",
        "password": "1234",
        "phone_number": "+33612345678",
        "date_of_birth": "1990-03-15",
        "address": "10 Rue des Lilas",
        "zip_code": "44350",
        "city": "Guérande",
        "avatar": "lien_avatar_1.jpg",
        "is_admin": false,
        "status": true
     },
    {
     
        "firstname": "Marie",
        "lastname": "Martin",
        "email": "marie.martin@example.com",
        "password": "1234",
        "phone_number": "+33623456789",
        "date_of_birth": "1995-07-20",
        "address": "24 Avenue du Soleil",
        "zip_code": "44350",
        "city": "Guérande",
        "avatar": "lien_avatar_2.jpg",
        "is_admin": false,
        "status": false
    },
    {
     
        "firstname": "Pierre",
        "lastname": "Leroy",
        "email": "pierre.leroy@example.com",
        "password": "1234",
        "phone_number": "+33734567890",
        "date_of_birth": "1982-11-10",
        "address": "15 Rue des Roses",
        "zip_code": "44350",
        "city": "Guérande",
        "avatar": "lien_avatar_3.jpg",
        "is_admin": false,
        "status": false
    },
    {
     
        "firstname": "Émilie",
        "lastname": "Dubois",
        "email": "emilie.dubois@example.com",
        "password": "1234",
        "phone_number": "+33123456789",
        "date_of_birth": "1976-05-25",
        "address": "8 Rue du Moulin",
        "zip_code": "44350",
        "city": "Guérande",
        "avatar": "lien_avatar_4.jpg",
        "is_admin": false,
        "status": false
    },
    {
     
        "firstname": "Sophie",
        "lastname": "Lefevre",
        "email": "sophie.lefevre@example.com",
        "password": "1234",
        "phone_number": "+33987654321",
        "date_of_birth": "1983-09-30",
        "address": "6 Rue du Commerce",
        "zip_code": "44350",
        "city": "Guérande",
        "avatar": "lien_avatar_5.jpg",
        "is_admin": false,
        "status": false
    },
    {
     
        "firstname": "Thomas",
        "lastname": "Garcia",
        "email": "thomas.garcia@example.com",
        "password": "1234",
        "phone_number": "+33123456789",
        "date_of_birth": "1992-08-12",
        "address": "12 Rue de la Paix",
        "zip_code": "44350",
        "city": "Guérande",
        "avatar": "lien_avatar_6.jpg",
        "is_admin": false,
        "status": false
    },
    {
     
        "firstname": "Charlotte",
        "lastname": "Moreau",
        "email": "charlotte.moreau@example.com",
        "password": "1234",
        "phone_number": "+33765432109",
        "date_of_birth": "1993-04-18",
        "address": "20 Rue des Écoles",
        "zip_code": "44350",
        "city": "Guérande",
        "avatar": "lien_avatar_7.jpg",
        "is_admin": false,
        "status": false
    },
    {
     
        "firstname": "Lucas",
        "lastname": "Girard",
        "email": "lucas.girard@example.com",
        "password": "1234",
        "phone_number": "+33654321098",
        "date_of_birth": "1988-12-05",
        "address": "5 Avenue Victor Hugo",
        "zip_code": "44350",
        "city": "Guérande",
        "avatar": "lien_avatar_8.jpg",
        "is_admin": false,
        "status": false
    },
    {
     
        "firstname": "Julie",
        "lastname": "Roux",
        "email": "julie.roux@example.com",
        "password": "1234",
        "phone_number": "+33567890123",
        "date_of_birth": "1987-10-25",
        "address": "3 Rue de la Liberté",
        "zip_code": "44350",
        "city": "Guérande",
        "avatar": "lien_avatar_9.jpg",
        "is_admin": false,
        "status": false
    },
    {
     
        "firstname": "Alexandre",
        "lastname": "Martinez",
        "email": "alexandre.martinez@example.com",
        "password": "1234",
        "phone_number": "+33654321987",
        "date_of_birth": "1994-09-15",
        "address": "18 Rue de la Poste",
        "zip_code": "44350",
        "city": "Guérande",
        "avatar": "lien_avatar_10.jpg",
        "is_admin": false,
        "status": false
    }
]

const data_producers = [
    {
        "id": 1,
        "company": "Ferme de la Saline",
        "firstname": "Étienne",
        "lastname": "Dupont",
        "description": "Producteur de sel de Guérande",
        "city": "Guérande",
        "website_url": "www.fermedelasaline.fr",
        "picture": "ferme_saline.webp",
        "status": true
    },
    {
        "id": 2,
        "company": "Domaine du Marais",
        "firstname": "Jean-Luc",
        "lastname": "Martin",
        "description": "Vigneron",
        "city": "Guérande",
        "website_url": "www.domainedumarais.com",
        "picture": "domaine_marais.webp",
        "status": true
    },
    {
        "id": 3,
        "company": "La Cabane aux Huîtres",
        "firstname": "Pierre",
        "lastname": "Moreau",
        "description": "Élevage et vente d'huîtres de la Baie de La Baule",
        "city": "Batz-sur-Mer",
        "website_url": "www.cabaneauxhuitres.fr",
        "picture": "cabane_huitres.webp",
        "status": true
    },
    {
        "id": 4,
        "company": "Ferme de la Prairie",
        "firstname": "Daniel",
        "lastname": "Lambert",
        "description": "Producteur de légumes bio",
        "city": "La Turballe",
        "website_url": "www.fermedelaprairie.com",
        "picture": "ferme_prairie.webp",
        "status": true
    },
    {
        "id": 5,
        "company": "Boulangerie Guérandaise",
        "firstname": "Jean",
        "lastname": "Laurent",
        "description": "Boulangerie artisanale",
        "city": "Guérande",
        "website_url": "www.boulangerieguerandaise.fr",
        "picture": "boulangerie_guerandaise.webp",
        "status": true
    },
    {
        "id": 6,
        "company": "Le Potager de Eric",
        "firstname": "Eric",
        "lastname": "Girard",
        "description": "Maraîcher bio",
        "city": "Piriac-sur-Mer",
        "website_url": "www.potagerdepauline.fr",
        "picture": "potager_eric.webp",
        "status": true
    },
    {
        "id": 7,
        "company": "La Fromagerie du Coin",
        "firstname": "Sophie",
        "lastname": "Petit",
        "description": "Fromagerie locale",
        "city": "Herbignac",
        "website_url": "www.fromagerieducoin.com",
        "picture": "fromagerie_sophie.webp",
        "status": true
    },
    {
        "id": 8,
        "company": "Les Vergers de Guérande",
        "firstname": "Francis",
        "lastname": "Roux",
        "description": "Producteur de pommes et poires",
        "city": "La Baule",
        "website_url": "www.vergersdeguerande.fr",
        "picture": "vergers_guerande.webp",
        "status": true
    },
    {
        "id": 9,
        "company": "Moulin de la Sérénité",
        "firstname": "Marc",
        "lastname": "Charpentier",
        "description": "Moulin à vent pour farine",
        "city": "Guérande",
        "website_url": "www.moulinserenite.fr",
        "picture": "moulin_serenite.webp",
        "status": true
    },
    {
        "id": 10,
        "company": "Ferme des Mille Saveurs",
        "firstname": "Hector",
        "lastname": "Lefebvre",
        "description": "Ferme laitière",
        "city": "Batz-sur-Mer",
        "website_url": "www.millesaveurs.com",
        "picture": "ferme_mille_saveurs.webp",
        "status": true
    },
    {
        "id": 11,
        "company": "Les Jardins du Sel",
        "firstname": "Julien",
        "lastname": "Marchand",
        "description": "Producteur de légumes de saison",
        "city": "Guérande",
        "website_url": "www.jardinsdusel.com",
        "picture": "jardin_sel.webp",
        "status": true
    },
    {
        "id": 12,
        "company": "Poissonnerie de Guérande",
        "firstname": "Émilie",
        "lastname": "Guérin",
        "description": "Poissonnerie locale",
        "city": "Guérande",
        "website_url": "-",
        "picture": "poissonnerie_guerande.webp",
        "status": true
    },
    {
        "id": 13,
        "company": "La Ferme du Bois Joli",
        "firstname": "Nicolas",
        "lastname": "Mercier",
        "description": "Producteur de volailles fermières",
        "city": "La Baule",
        "website_url": "www.fermeduboisjoli.com",
        "picture": "ferme_bois_joli.webp",
        "status": true
    },
    {
        "id": 14,
        "company": "Brasserie de Guérande",
        "firstname": "Thomas",
        "lastname": "Leclerc",
        "description": "Brasserie artisanale",
        "city": "Guérande",
        "website_url": "www.brasseriedeguerande.com",
        "picture": "brasserie_guerande.webp",
        "status": true
    },
    {
        "id": 15,
        "company": "Les Délices de Kévin",
        "firstname": "Kévin",
        "lastname": "Dupuis",
        "description": "Fromagerie artisanale",
        "city": "La Turballe",
        "website_url": "www.delicesdekevin.fr",
        "picture": "delice_kevin.webp",
        "status": true
    },
    {
        "id": 16,
        "company": "Les Vergers de Piriac",
        "firstname": "Éric",
        "lastname": "Perrin",
        "description": "Producteur de fruits",
        "city": "Piriac-sur-Mer",
        "website_url": "www.vergersdepiriac.com",
        "picture": "vergers_piriac.webp",
        "status": true
    },
    {
        "id": 17,
        "company": "La Ferme des Marais",
        "firstname": "Christian",
        "lastname": "Rousseau",
        "description": "Élevage de bovins",
        "city": "Guérande",
        "website_url": "www.fermedesmarais.fr",
        "picture": "ferme_marais.webp",
        "status": true
    },
    {
        "id": 18,
        "company": "Apiculteur du Marais",
        "firstname": "Antoine",
        "lastname": "Bernard",
        "description": "Production de miel",
        "city": "Saint-Molf",
        "website_url": "-",
        "picture": "apiculteur_marais.webp",
        "status": true
    },
    {
        "id": 19,
        "company": "Les Gourmandises de Arnaud",
        "firstname": "Arnaud",
        "lastname": "Dubois",
        "description": "Epicerie",
        "city": "La Baule",
        "website_url": "www.gourmandisesdearnaud.com",
        "picture": "gourmandises_arnaud.webp",
        "status": true
    },
    // {
    //     "id": 20,
    //     "company": "Les Plaisirs de la Mer",
    //     "firstname": "Mathieu",
    //     "lastname": "Robert",
    //     "description": "Produits de la mer frais",
    //     "city": "Le Croisic",
    //     "website_url": "-",
    //     "picture": "lien_vers_photo.jpg",
    //     "status": true
    // }
  ]

const data_categories = [
    {
      "id": 1,
      "name": "Fruits",
      "color": "#FFD700"
    },
    {
      "id": 2,
      "name": "Légumes",
      "color": "#32CD32"
    },
    {
      "id": 3,
      "name": "Pains et viennoiseries",
      "color": "#8B4513"
    },
    {
      "id": 4,
      "name": "Produits laitiers",
      "color": "#FF69B4"
    },
    {
      "id": 5,
      "name": "Viandes et volailles",
      "color": "#FF6347"
    },
    {
      "id": 6,
      "name": "Poissons et fruits de mer",
      "color": "#1E90FF"
    },
    {
      "id": 7,
      "name": "Épicerie sucrée",
      "color": "#FF4500"
    },
    {
      "id": 8,
      "name": "Épicerie salée",
      "color": "#4682B4"
    },
    {
      "id": 9,
      "name": "Boissons",
      "color": "#00FFFF"
    },
    {
      "id": 10,
      "name": "Snacks",
      "color": "#FFA500"
    }
  ]
  

const data_products = [
    {
        "id": 1,
        "producers_id": 5,
        "categories_id": 3,
        "name": "Baguette traditionnelle",
        "description": "Pain traditionnel français, croustillant à l'extérieur et moelleux à l'intérieur.",
        "unit_type": "Unité",
        "price": 1.5,
        "picture": "baguette.webp",
        "status": "true"
    },
    {
        "id": 2,
        "producers_id": 7,
        "categories_id": 4,
        "name": "Brie de Meaux",
        "description": "Fromage français à pâte molle et à croûte fleurie, au goût doux et crémeux.",
        "unit_type": "Pièce",
        "price": 6.99,
        "picture": "brie.webp",
        "status": "true"
    },
    {
        "id": 3,
        "producers_id": 10,
        "categories_id": 4,
        "name": "Yaourt nature",
        "description": "Yaourt nature onctueux, fabriqué à partir de lait entier et de ferments lactiques.",
        "unit_type": "Pot (125g)",
        "price": 0.99,
        "picture": "yaourt.webp",
        "status": "true"
    },
    {
        "id": 4,
        "producers_id": 18,
        "categories_id": 7,
        "name": "Miel toutes fleurs",
        "description": "Miel artisanal récolté dans les champs de fleurs sauvages, au goût floral et sucré.",
        "unit_type": "Pot (250g)",
        "price": 5.49,
        "picture": "miel.webp",
        "status": "true"
    },
    {
        "id": 5,
        "producers_id": 4,
        "categories_id": 2,
        "name": "Pommes de terre bio",
        "description": "Pommes de terre cultivées de manière biologique, riches en saveur et en nutriments.",
        "unit_type": "Kg",
        "price": 2.49,
        "picture": "pommesdeterre.webp",
        "status": "true"
    },
    {
        "id": 6,
        "producers_id": 17,
        "categories_id": 5,
        "name": "Saucisson sec",
        "description": "Saucisson sec traditionnel français, séché lentement pour un goût intense et une texture fondante.",
        "unit_type": "Pièce",
        "price": 7.99,
        "picture": "saucissonsec.webp",
        "status": "true"
    },
    {
        "id": 7,
        "producers_id": 19,
        "categories_id": 7,
        "name": "Confiture de fraises",
        "description": "Confiture artisanale préparée avec des fraises fraîches, sucrées et juteuses.",
        "unit_type": "Pot (200g)",
        "price": 4.29,
        "picture": "confituresfraises.webp",
        "status": "true"
    },
    {
        "id": 8,
        "producers_id": 11,
        "categories_id": 8,
        "name": "Huile d'olive extra vierge",
        "description": "Huile d'olive de première pression à froid, au goût fruité et à la texture veloutée.",
        "unit_type": "Bouteille (500ml)",
        "price": 8.99,
        "picture": "huileolive.webp",
        "status": "true"
    },
    {
        "id": 9,
        "producers_id": 9,
        "categories_id": 8,
        "name": "Pâtes penne",
        "description": "Pâtes artisanales de forme penne, fabriquées à partir de semoule de blé dur.",
        "unit_type": "Paquet (500g)",
        "price": 2.19,
        "picture": "penne.webp",
        "status": "true"
    },
    {
        "id": 10,
        "producers_id": 19,
        "categories_id": 7,
        "name": "Café moulu",
        "description": "Café arabica moulu, torréfié à la perfection pour un arôme riche et persistant.",
        "unit_type": "Paquet (250g)",
        "price": 6.49,
        "picture": "cafemoulu.webp",
        "status": "true"
    },
    {
        "id": 11,
        "producers_id": 19,
        "categories_id": 7,
        "name": "Thé vert bio",
        "description": "Thé vert biologique, aux feuilles fraîches et au goût délicat.",
        "unit_type": "Boîte (50 sachets)",
        "price": 3.99,
        "picture": "thevert.webp",
        "status": "true"
    },
    {
        "id": 12,
        "producers_id": 11,
        "categories_id": 2,
        "name": "Tomates cerises",
        "description": "Tomates cerises mûries au soleil, juteuses et pleines de saveur.",
        "unit_type": "Barquette (250g)",
        "price": 2.99,
        "picture": "tomatecerise.webp",
        "status": "true"
    },
    {
        "id": 13,
        "producers_id": 18,
        "categories_id": 7,
        "name": "Miel de lavande",
        "description": "Miel aux délicates saveurs de lavande, récolté dans les champs en fleurs.",
        "unit_type": "Pot (250g)",
        "price": 6.99,
        "picture": "miellavande.webp",
        "status": "true"
    },
    {
        "id": 14,
        "producers_id": 10,
        "categories_id": 4,
        "name": "Lait demi-écrémé",
        "description": "Lait de vache demi-écrémé, issu de l'agriculture biologique.",
        "unit_type": "Bouteille (1L)",
        "price": 1.79,
        "picture": "lait.webp",
        "status": "true"
    },
    {
        "id": 15,
        "producers_id": 19,
        "categories_id": 7,
        "name": "Confiture d'abricots",
        "description": "Confiture artisanale préparée avec des abricots mûrs et sucrés.",
        "unit_type": "Pot (200g)",
        "price": 4.49,
        "picture": "confitureabricots.webp",
        "status": "true"
    },
    {
        "id": 16,
        "producers_id": 7,
        "categories_id": 4,
        "name": "Fromage de chèvre frais",
        "description": "Fromage de chèvre frais, à la texture crémeuse et au goût frais.",
        "unit_type": "Bûchette (150g)",
        "price": 3.99,
        "picture": "fromagechevrefrais.webp",
        "status": "true"
    },
    {
        "id": 17,
        "producers_id": 18,
        "categories_id": 7,
        "name": "Miel d'acacia",
        "description": "Miel doux et délicat, aux saveurs florales et légèrement fruitées.",
        "unit_type": "Pot (250g)",
        "price": 5.99,
        "picture": "mielacacia.webp",
        "status": "true"
    },
    {
        "id": 18,
        "producers_id": 5,
        "categories_id": 3,
        "name": "Pain aux céréales",
        "description": "Pain aux céréales riches en fibres et en nutriments essentiels.",
        "unit_type": "Unité",
        "price": 2.29,
        "picture": "paincereales.webp",
        "status": "true"
    },
    {
        "id": 19,
        "producers_id": 16,
        "categories_id": 1,
        "name": "Fraises fraîches",
        "description": "Fraises fraîchement cueillies, sucrées et parfumées.",
        "unit_type": "Barquette (250g)",
        "price": 3.99,
        "picture": "fraisesfraiches.webp",
        "status": "true"
    },
    {
        "id": 20,
        "producers_id": 13,
        "categories_id": 5,
        "name": "Poulet fermier",
        "description": "Poulet fermier élevé en plein air, tendre et savoureux.",
        "unit_type": "Kg",
        "price": 7.99,
        "picture": "poulet.webp",
        "status": "true"
    },
    {
        "id": 21,
        "producers_id": 8,
        "categories_id": 7,
        "name": "Compote de pommes",
        "description": "Compote de pommes maison, préparée avec des pommes fraîches et du sucre de canne.",
        "unit_type": "Pot (500g)",
        "price": 2.49,
        "picture": "compotepommes.webp",
        "status": "true"
    },
    {
        "id": 22,
        "producers_id": 19,
        "categories_id": 7,
        "name": "Confiture de cerises",
        "description": "Confiture artisanale préparée avec des cerises mûres et juteuses.",
        "unit_type": "Pot (200g)",
        "price": 4.99,
        "picture": "confiturecerises.webp",
        "status": "true"
    },
    {
        "id": 23,
        "producers_id": 9,
        "categories_id": 7,
        "name": "Muesli aux fruits secs",
        "description": "Muesli croustillant aux flocons d'avoine, aux fruits secs et aux noix.",
        "unit_type": "Paquet (500g)",
        "price": 3.99,
        "picture": "muesli.webp",
        "status": "true"
    },
    {
        "id": 24,
        "producers_id": 5,
        "categories_id": 3,
        "name": "Pain complet",
        "description": "Pain complet bio, riche en fibres et en nutriments essentiels.",
        "unit_type": "Unité",
        "price": 2.0,
        "picture": "paincomplet.webp",
        "status": "true"
    },
    {
        "id": 25,
        "producers_id": 4,
        "categories_id": 2,
        "name": "Carottes bio",
        "description": "Carottes bio, fraîchement récoltées et riches en vitamines.",
        "unit_type": "Kg",
        "price": 1.49,
        "picture": "carottes.webp",
        "status": "true"
    }
  ]


// insert_users(data_users);
// insert_producers(data_producers);
// insert_categories(data_categories);
insert_products(data_products);


// delete_users();
// delete_producers();
// delete_categories();
// delete_products();