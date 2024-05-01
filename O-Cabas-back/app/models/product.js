import debug from 'debug';
import client from '../services/db_client.js';

const logger = debug('api:product_models');

const product_model = {
    async find_all(){
        try {
            const result = await client.query('SELECT * FROM products');
            return result.rows;
        } catch (error) {
            logger('Error fetching all products;', error);
            throw error;
        }
    },

    async find_by_pk(product_id){
        const query = {
            text: `SELECT * FROM products WHERE id = $1`,
            values: [product_id],
        };
        
        try {
            const result = await client.query(query);
            return result.rows[0];
        } catch (error) {
            logger('Error fetching product by id:', error);
            throw error;
        }
    },

    async find_by_name(product_name){
        const query = {
            text: `SELECT * FROM products WHERE name = $1`,
            values: [product_name],
        };
        
        try {
            const result = await client.query(query);
            return result.rows[0];
        } catch (error) {
            logger('Error fetching product by name:', error);
            throw error;
        }
    },

    async find_product_status_by_name(product){
        const query = {
            text: `SELECT status FROM products WHERE name = $1`,
            values: [product],
        };

        try {
            const result = await client.query(query);
            return result.rows[0];
        } catch (error) {
            logger('Error fetching product by name:', error);
            throw error;
        }
    },

    async insert(product){
        const query = {
            text: `INSERT INTO products 
                        (producers_id, categories_id, name, description, unit_type, price, picture, status)
                    VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING *;
                    `,
            values: [product.producers_id, product.categories_id, product.name, product.description, product.unit_type, product.price, product.picture, product.status]
        };
        
        try {
            const result = await client.query(query);
            logger(query)
            return result.rows[0];
        } catch (error) {
            logger('Error inserting product:', error);
            return error.detail;
        };
    },

    async update(id, product) {
        const fields = Object.keys(product).map((field, index) => `"${field}" = $${index + 1}`);
        const values = Object.values(product);
        const timestamp = new Date().toISOString();
        fields.push(`"updatedat" = $${fields.length + 1}`);
        const query = {
          text: `UPDATE products SET ${fields} WHERE id = $${fields.length + 1} RETURNING *`,
          values: [...values, timestamp, id],
        };
        const result = await client.query(query);
        logger(result)
        return result.rows[0];

    },

    async product_actived(id) {
        // Construire la liste des champs à mettre à jour
        const fields = [];
        // Ajouter le champ 'status' à la liste
        fields.push('"status" = $1');
        
        // Valeur à assigner au champ 'status' (true)
        const status_value = true;
    
        // Ajouter la date de mise à jour
        const timestamp = new Date().toISOString();
        fields.push('"updatedat" = $2');
    
        // Construire la requête SQL
        const query = {
            text: `UPDATE products SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
            values: [status_value, timestamp, id],
        };
    
        // Exécuter la requête et récupérer le résultat
        const result = await client.query(query);
        logger(result)
        // Retourner la première ligne mise à jour
        return result.rows[0];
    },
    
    async product_desactived(id) {
        // Construire la liste des champs à mettre à jour
        const fields = [];
        // Ajouter le champ 'status' à la liste
        fields.push('"status" = $1');
        
        // Valeur à assigner au champ 'status' (true)
        const status_value = false;
    
        // Ajouter la date de mise à jour
        const timestamp = new Date().toISOString();
        fields.push('"updatedat" = $2');
    
        // Construire la requête SQL
        const query = {
            text: `UPDATE products SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
            values: [status_value, timestamp, id],
        };
    
        // Exécuter la requête et récupérer le résultat
        const result = await client.query(query);
        logger(result)
        // Retourner la première ligne mise à jour
        return result.rows[0];
    },

    async delete(product_id){
        const query = {
            text: `DELETE FROM products WHERE id = $1 RETURNING *;`,
            values: [product_id]
        };

        try {
            const result = await client.query(query);
            return !!result.rowCount;
        } catch (error) {
            logger('Error deleting user:', error);
            throw error;
        };
    },

}

export default product_model;