import debug from 'debug';
import client from '../services/db_client.js';

const logger = debug('api:category_models');

const category_model = {
    async find_all(){
        try {
            const result = await client.query('SELECT * FROM categories');
            return result.rows;
        } catch (error) {
            logger('Error fetching all category;', error);
            throw error;
        }
    },

    async find_by_pk(category_id){
        const query = {
            text: `SELECT * FROM categories WHERE id = $1`,
            values: [category_id],
        };
        
        try {
            const result = await client.query(query);
            return result.rows[0];
        } catch (error) {
            logger('Error fetching category by id:', error);
            throw error;
        }
    },
    
    async find_by_name(name){
        const query = {
            text: `SELECT * FROM categories WHERE name = $1`,
            values: [name],
        };
        
        try {
            const result = await client.query(query);
            return result.rows[0];
        } catch (error) {
            logger('Error fetching category by name:', error);
            throw error;
        }
    },
    
    

    async insert(category){
        const query = {
            text: `INSERT INTO categories 
                        (name, color)
                    VALUES
                    ($1, $2)
                    RETURNING *;`,
            values: [category.name, category.color]
        };
        
        try {
            const result = await client.query(query);
            logger(query)
            return result.rows[0];
        } catch (error) {
            logger('Error inserting category:', error);
            return error.detail;
        };
    },

    async update(id, category) {
        const fields = Object.keys(category).map((field, index) => `"${field}" = $${index + 1}`);
        const values = Object.values(category);
        const timestamp = new Date().toISOString();
        fields.push(`"updatedat" = $${fields.length + 1}`);
        const query = {
          text: `UPDATE categories SET ${fields} WHERE id = $${fields.length + 1} RETURNING *`,
          values: [...values, timestamp, id],
        };
        const result = await client.query(query);
        logger(result)
        return result.rows[0];

    },

    async delete(category_id){
        const query = {
            text: `DELETE FROM categories WHERE id = $1 RETURNING *;`,
            values: [category_id]
        };

        try {
            const result = await client.query(query);
            return !!result.rowCount;
        } catch (error) {
            logger('Error deleting category:', error);
            throw error;
        };
    },

}

export default category_model;