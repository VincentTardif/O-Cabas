import debug from 'debug';
// import { Pool } from 'pg';
import pkg from 'pg';
const { Pool } = pkg;

const logger = debug('app:db');

const pool = new Pool();

export default {
        originalClient: pool,

        async query(...params) {
          logger(...params);
          return pool.query(...params);
        }
}


