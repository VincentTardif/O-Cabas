import debug from 'debug';
import client from '../services/db_client.js';


const logger = debug('api:user_models');

const user_model = {
    /**
     * Get all users from DB
     * 
     * @returns {Array} - Categories object array
     */
    async find_all(){
        try {
            const result = await client.query('SELECT * FROM users');
            return result.rows;
        } catch (error) {
            logger('Error fetching all users:', error);
            throw error;
        }
    },
    /**
     * Get one user by PK from DB
     * 
     * @param {number} user_id - user id
     * @returns {object} - user object
     */
    async find_by_pk(user_id){
        const query = {
            text: `SELECT * FROM users WHERE id = $1`,
            values: [user_id],
        };
        
        try {
            const result = await client.query(query);
            return result.rows[0];
        } catch (error) {
            logger('Error fetching user by PK:', error);
            throw error;
        }
    },
    /**
     * Get one user by email from DB
     * 
     * @param {string} user - user
     * @returns {object} - user object
     */
    async find_by_email(user){
        const query = {
            text: `SELECT * FROM users WHERE email = $1`,
            values: [user],
        };
        try {
            const result = await client.query(query);
            return result.rows[0];
        } catch (error) {
            logger('Error fetching user by email:', error);
            throw error;
        }
    },
    /**
     * Get user role by his email
     * 
     * @param {string} user 
     * @returns 
     */
    async find_user_role_by_email(user){
        const query = {
            text: `SELECT is_admin FROM users WHERE email = $1`,
            values: [user],
        };
        try {
            const result = await client.query(query);
            return result.rows[0];
        } catch (error) {
            logger('Error fetching user by email:', error);
            throw error;
        }
    },

    async find_user_status_by_email(user){
        const query = {
            text: `SELECT status FROM users WHERE email = $1`,
            values: [user],
        };
        try {
            const result = await client.query(query);
            return result.rows[0];
        } catch (error) {
            logger('Error fetching user by email:', error);
            throw error;
        }
    },
    /**
     * Insert a new user in DB
     * 
     * @param {object} user - an user object
     * @returns {object} - inserted user object
     */
    async insert(user){
        const query = {
            text: `INSERT INTO users 
                        (firstname, lastname, email, password, phone_number, date_of_birth, address, zip_code, city, avatar, is_admin, status)
                    VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                    RETURNING *;
                    `,
            values: [user.firstname, user.lastname, user.email, user.password, user.phone_number, user.date_of_birth, user.address, user.zip_code, user.city, user.avatar, user.is_admin, user.status]
        };
        
        try {
            const result = await client.query(query);
            logger(query)
            return result.rows[0];
        } catch (error) {
            logger('Error inserting user:', error);
            return error.detail;
        };
    },

    /**
     * Update an existing user in DB
     * 
     * @param {number} id - identifier id of th users table
     * @param {object} user - an user object with updated data
     * @return {object} - updated user object
     */
    async update(id, user) {
        const fields = Object.keys(user).map((field, index) => `"${field}" = $${index + 1}`);
        const values = Object.values(user);
        const timestamp = new Date().toISOString();
        fields.push(`"updatedat" = $${fields.length + 1}`);
        const query = {
          text: `UPDATE users SET ${fields} WHERE id = $${fields.length + 1} RETURNING *`,
          values: [...values, timestamp, id],
        };
        const result = await client.query(query);
        logger(result)
        return result.rows[0];

    },

    async account_actived(id) {
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
            text: `UPDATE users SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
            values: [status_value, timestamp, id],
        };
    
        // Exécuter la requête et récupérer le résultat
        const result = await client.query(query);
        logger(result)
        // Retourner la première ligne mise à jour
        return result.rows[0];
    },
    
    async account_desactived(id) {
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
            text: `UPDATE users SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
            values: [status_value, timestamp, id],
        };
    
        // Exécuter la requête et récupérer le résultat
        const result = await client.query(query);
        logger(result)
        // Retourner la première ligne mise à jour
        return result.rows[0];
    },
    
    async account_is_admin(id) {
        // Construire la liste des champs à mettre à jour
        const fields = [];
        // Ajouter le champ 'is_admin' à la liste
        fields.push('"is_admin" = $1');
        
        // Valeur à assigner au champ 'is_admin' (true)
        const is_admin_value = true;
    
        // Ajouter la date de mise à jour
        const timestamp = new Date().toISOString();
        fields.push('"updatedat" = $2');
    
        // Construire la requête SQL
        const query = {
            text: `UPDATE users SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
            values: [is_admin_value, timestamp, id],
        };
    
        // Exécuter la requête et récupérer le résultat
        const result = await client.query(query);
        logger(result)
        // Retourner la première ligne mise à jour
        return result.rows[0];
    },
    
    async account_is_not_admin(id) {
        // Construire la liste des champs à mettre à jour
        const fields = [];
        // Ajouter le champ 'is_admin' à la liste
        fields.push('"is_admin" = $1');
        
        // Valeur à assigner au champ 'is_admin' (true)
        const is_admin_value = false;
    
        // Ajouter la date de mise à jour
        const timestamp = new Date().toISOString();
        fields.push('"updatedat" = $2');
    
        // Construire la requête SQL
        const query = {
            text: `UPDATE users SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
            values: [is_admin_value, timestamp, id],
        };
    
        // Exécuter la requête et récupérer le résultat
        const result = await client.query(query);
        logger(result)
        // Retourner la première ligne mise à jour
        return result.rows[0];
    },
    
    async account (email) {
        const query = {
            text: `select firstname,
                            lastname, 
                            email, 
                            phone_number,
                            date_of_birth,
                            address,
                            zip_code,
                            city,
                            status
                    from users where email = $1;`,
            values: [email],
        };
        try {
            const result = await client.query(query);
            return result.rows;
        } catch (error) {
            logger('Error fetching order by id:', error);
            throw error;
        }
    },

    async delete_account (email) {
        const query = {
            text: `DELETE FROM users WHERE email = $1;`,
            values: [email],
        };
        try {
            const result = await client.query(query);
            return ('Suppression du compte effectué!');
        } catch (error) {
            logger('Error fetching order by email:', error);
            throw error;
        }
    },

    async update_account (email, user) {
        const keys = Object.keys(user);

         // Exclure les colonnes 'is_admin' et 'status' des clés
        const fields = keys.filter(key => key !== 'is_admin' && key !== 'status')
                        .map((field, index) => `"${field}" = $${index + 1}`);
        const values = Object.values(user);
        const timestamp = new Date().toISOString();
        fields.push(`"updatedat" = $${fields.length + 1}`);
        const query = {
          text: `UPDATE users SET ${fields} WHERE email = $${fields.length + 1} RETURNING *`,
          values: [...values, timestamp, email],
        };
        try {
            const result = await client.query(query);
            return result.rows[0];
        } catch (error) {
            logger('Error update account:', error);
            throw error;
        }
    },
    
    /**
     * Delete an user from DB
     * 
     * @param {number} user_id - user id
     * @returns {object} - deleted user object
     */
    async delete(user_id){
        const query = {
            text: `DELETE FROM users WHERE id = $1 RETURNING *;`,
            values: [user_id]
        };

        try {
            const result = await client.query(query);
            return !!result.rowCount;
        } catch (error) {
            logger('Error deleting user:', error);
            throw error;
        };
    }

};

export default user_model;