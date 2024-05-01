import debug from 'debug';
import client from '../services/db_client.js';

const logger = debug('api:ordered_product_models');

const ordered_product_model = {
    async find_all(){
        try {
            const result = await client.query('SELECT * FROM ordered_products');
            return result.rows;
        } catch (error) {
            logger('Error fetching all ordered_products;', error);
            throw error;
        }
    },

    async find_by_pk(ordered_product_id){
        const query = {
            text: `SELECT * FROM ordered_products WHERE id = $1`,
            values: [ordered_product_id],
        };
        
        try {
            const result = await client.query(query);
            return result.rows[0];
        } catch (error) {
            logger('Error fetching producer by id:', error);
            throw error;
        }
    },

    async find_producer_status_by_pk(ordered_product){
        const query = {
            text: `SELECT status FROM ordered_products WHERE id = $1`,
            values: [ordered_product],
        };

        try {
            const result = await client.query(query);
            return result.rows[0];
        } catch (error) {
            logger('Error fetching ordered_product by id:', error);
            throw error;
        }
    },

    async insert(ordered_product){
        const query = {
            text: `INSERT INTO ordered_products 
                        (orders_id, products_id, quantity, total_price)
                    VALUES
                    ($1, $2, $3, $4)
                    RETURNING *;
                    `,
            values: [ordered_product.orders_id, ordered_product.products_id, ordered_product.quantity, ordered_product.total_price]
        };
        
        try {
            const result = await client.query(query);
            logger(query)
            return result.rows[0];
        } catch (error) {
            logger('Error inserting ordered_product:', error);
            return error.detail;
        };
    },

    async update(id, ordered_product) {
        const fields = Object.keys(ordered_product).map((field, index) => `"${field}" = $${index + 1}`);
        const values = Object.values(ordered_product);
        const timestamp = new Date().toISOString();
        fields.push(`"updatedat" = $${fields.length + 1}`);
        const query = {
          text: `UPDATE ordered_products SET ${fields} WHERE id = $${fields.length + 1} RETURNING *`,
          values: [...values, timestamp, id],
        };
        const result = await client.query(query);
        logger(result)
        return result.rows[0];

    },

    async delete(ordered_product_id){
        const query = {
            text: `DELETE FROM ordered_products WHERE id = $1 RETURNING *;`,
            values: [ordered_product_id]
        };

        try {
            const result = await client.query(query);
            return !!result.rowCount;
        } catch (error) {
            logger('Error deleting ordered_product:', error);
            throw error;
        };
    },

}

export default ordered_product_model;