import debug from 'debug';
import client from '../services/db_client.js';

const logger = debug('api:producer_models');

const producer_model = {
    async find_all(){
        try {
            const result = await client.query('SELECT * FROM producers');
            return result.rows;
        } catch (error) {
            logger('Error fetching all producers;', error);
            throw error;
        }
    },

    async find_by_pk(producer_id){
        const query = {
            text: `SELECT * FROM producers WHERE id = $1`,
            values: [producer_id],
        };
        
        try {
            const result = await client.query(query);
            return result.rows[0];
        } catch (error) {
            logger('Error fetching producer by id:', error);
            throw error;
        }
    },

    async find_producer_status_by_pk(producer){
        const query = {
            text: `SELECT status FROM producers WHERE id = $1`,
            values: [producer],
        };

        try {
            const result = await client.query(query);
            return result.rows[0];
        } catch (error) {
            logger('Error fetching producer by id:', error);
            throw error;
        }
    },

    async insert(producer){
        const query = {
            text: `INSERT INTO producers 
                        (company, firstname, lastname, description, city, website_url, picture, status)
                    VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING *;
                    `,
            values: [producer.company, producer.firstname, producer.lastname, producer.description, producer.city, producer.website_url, producer.picture, producer.status]
        };
        
        try {
            const result = await client.query(query);
            logger(query)
            return result.rows[0];
        } catch (error) {
            logger('Error inserting producer:', error);
            return error.detail;
        };
    },

    async update(id, producer) {
        const fields = Object.keys(producer).map((field, index) => `"${field}" = $${index + 1}`);
        const values = Object.values(producer);
        const timestamp = new Date().toISOString();
        fields.push(`"updatedat" = $${fields.length + 1}`);
        const query = {
          text: `UPDATE producers SET ${fields} WHERE id = $${fields.length + 1} RETURNING *`,
          values: [...values, timestamp, id],
        };
        const result = await client.query(query);
        logger(result)
        return result.rows[0];

    },

    async producer_actived(id) {
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
            text: `UPDATE producers SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
            values: [status_value, timestamp, id],
        };
    
        // Exécuter la requête et récupérer le résultat
        const result = await client.query(query);
        logger(result)
        // Retourner la première ligne mise à jour
        return result.rows[0];
    },
    
    async producer_desactived(id) {
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
            text: `UPDATE producers SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
            values: [status_value, timestamp, id],
        };
    
        // Exécuter la requête et récupérer le résultat
        const result = await client.query(query);
        logger(result)
        // Retourner la première ligne mise à jour
        return result.rows[0];
    },

    async delete(producer_id){
        const query = {
            text: `DELETE FROM producers WHERE id = $1 RETURNING *;`,
            values: [producer_id]
        };

        try {
            const result = await client.query(query);
            return !!result.rowCount;
        } catch (error) {
            logger('Error deleting producer:', error);
            throw error;
        };
    },

}

export default producer_model;