import debug from 'debug';
import client from '../services/db_client.js';

const logger = debug('api:order_models');

const order_model = {
    async find_all(){
        try {
            const result = await client.query(
                `SELECT distinct u.firstname || ' ' || u.lastname as fullname, 
                                    o.id as order_number,
                                    o.total_price as total_price_order, 
                                    o.status, 
                                    o.createdat
                    from users u
                    join orders o on u.id = o.users_id
                    join ordered_products od on od.orders_id = o.id
                    join products p on p.id = od.products_id
                    order by createdat desc;`);
            return result.rows;
        } catch (error) {
            logger('Error fetching all orders;', error);
            throw error;
        }
    },
    async find_by_pk(order_id){
        const query = {
            text: `SELECT p.name as product_name,
                            od.quantity, 
                            od.total_price as total_price_product, 
                            o.total_price as total_price_order, 
                            o.status, 
                            o.createdat
                    FROM users u
                    JOIN orders o ON u.id = o.users_id
                    JOIN ordered_products od ON od.orders_id = o.id
                    JOIN products p ON p.id = od.products_id
                    WHERE o.id = $1;`,
            values: [order_id],
        };
        
        try {
            const result = await client.query(query);
            logger('toto', result)
            return result.rows;
        } catch (error) {
            logger('Error fetching order by id:', error);
            throw error;
        }
    },
    async get_all_my_orders(email){
        const query = {
            text: `SELECT o.id,
                            o.total_price,
                            o.status,
                            o.createdat 
                        FROM orders o 
                        JOIN users u ON u.id = o.users_id WHERE u.email = $1;`,
            values: [email],
        };
        
        try {
            const result = await client.query(query);
            return result.rows;
        } catch (error) {
            logger('Error fetching order by email:', error);
            throw error;
        }
    },
    async get_detail_order(email, id){
        const query = {
            text:`select p.name as product_name, 
                            od.quantity,	
                            od.total_price as total_price_product,
                            o.total_price as total_price_order
                    from users u
                    join orders o on u.id = o.users_id
                    join ordered_products od on od.orders_id = o.id
                    join products p on p.id = od.products_id
                    where u.email = $1
                    and o.id = $2;`,
            values: [email, id],
        };
        try {
            const result = await client.query(query);
            return result.rows;
        } catch(error) {
            logger('Error fetching order by email and id:', error);
            throw error;
        }
    },
    async insert(order){
        const query = {
            text: `INSERT INTO orders 
                        (users_id, total_price, status)
                    VALUES
                    ($1, $2, $3)
                    RETURNING *;
                    `,
            values: [order.users_id, 1,order.status]
        };
        
        try {
            const result = await client.query(query);
            logger(query)
            return result.rows[0];
        } catch (error) {
            logger('Error inserting order:', error);
            return error.detail;
        };
    },
    async insert_into_order(order, products) {
      logger(order)
      try {
        const orderInsertQuery = {
          text: `
            INSERT INTO orders (users_id, total_price, status)
            VALUES ($1, $2, $3)
            RETURNING *;
          `,
          values: [order.userId, order.orderTotalPrice, order.status],
        };
        const orderResult = await client.query(orderInsertQuery);
        logger(orderResult)
        const orderTotalPrice = orderResult.rows[0].total_price;
        const orderId = orderResult.rows[0].id;
        logger(orderId)
        logger(orderTotalPrice)
        // Insérer les produits commandés dans ordered_products
        for (const product of products) {
            logger(product)
          const totalPriceOfProduct = (product.price * product.quantity).toFixed(2)
          const orderedProductQuery = {
            text: `
              INSERT INTO ordered_products (orders_id, products_id, quantity, total_price)
              VALUES ($1, $2, $3, $4);
            `,
            values: [orderId, product.id, product.quantity, totalPriceOfProduct]
          };
          const result = await client.query(orderedProductQuery);
          logger(result)
        }
        logger(orderId, orderTotalPrice); // Retourner l'identifiant de commande et le prix total
      } catch (error) {
        console.error('Error inserting order with products:', error);
        throw error;
        }
    },
    async update(id, order) {
        const fields = Object.keys(order).map((field, index) => `"${field}" = $${index + 1}`);
        const values = Object.values(order);
        const timestamp = new Date().toISOString();
        fields.push(`"updatedat" = $${fields.length + 1}`);
        const query = {
          text: `UPDATE orders SET ${fields} WHERE id = $${fields.length + 1} RETURNING *`,
          values: [...values, timestamp, id],
        };
        const result = await client.query(query);
        logger(result)
        return result.rows[0];

    },
    async pending_order(id) {
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
            text: `UPDATE orders SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
            values: [status_value, timestamp, id],
        };
    
        // Exécuter la requête et récupérer le résultat
        const result = await client.query(query);
        logger(result)
        // Retourner la première ligne mise à jour
        return result.rows[0];
    },
    async order_completed(id) {
        // Construire la liste des champs à mettre à jour
        const fields = [];
        // Ajouter le champ 'status' à la liste
        fields.push('"status" = $1');
        
        // Valeur à assigner au champ 'status' (false)
        const status_value = false;
    
        // Ajouter la date de mise à jour
        const timestamp = new Date().toISOString();
        fields.push('"updatedat" = $2');
    
        // Construire la requête SQL
        const query = {
            text: `UPDATE orders SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
            values: [status_value, timestamp, id],
        };
    
        // Exécuter la requête et récupérer le résultat
        const result = await client.query(query);
        logger(result)
        // Retourner la première ligne mise à jour
        return result.rows[0];
    },
    async delete(order_id){
        const query = {
            text: `DELETE FROM orders WHERE id = $1 RETURNING *;`,
            values: [order_id]
        };

        try {
            const result = await client.query(query);
            return !!result.rowCount;
        } catch (error) {
            logger('Error deleting order:', error);
            throw error;
        };
    },

    
}

export default order_model;