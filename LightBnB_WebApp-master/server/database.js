const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  host: 'localhost',
  database: 'lightbnb',
  password: 'labber',
  port: 5432,
});

// the following assumes that you named your connection variable `pool`
// pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)})

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

//initial version replaced later
// const getUserWithEmail = function(email) {
//   let user;
//   for (const userId in users) {
//     user = users[userId];
//     if (user.email.toLowerCase() === email.toLowerCase()) {
//       break;
//     } else {
//       user = null;
//     }
//   }
//   return Promise.resolve(user);
// }

const getUserWithEmail = function(email) {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1
  `;
  return pool
    .query(query, [email])
    .then((result) => result.rows[0] || null)
    .catch((err) => console.log(err.message));
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
//initial version replaced later
// const getUserWithId = function(id) {
//   return Promise.resolve(users[id]);
// }

const getUserWithId = function(id) {
  const query = `
    SELECT *
    FROM users
    WHERE id = $1
  `;
  return pool
    .query(query, [id])
    .then((result) => result.rows[0] || null)
    .catch((err) => console.log(err.message));
};

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
//initial version replaced later
// const addUser =  function(user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// }

const addUser = function(user) {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [user.name, user.email, user.password];
  return pool
    .query(query, values)
    .then((result) => result.rows[0])
    .catch((err) => console.log(err.message));
};


exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
//initial version replaced later
// const getAllReservations = function(guest_id, limit = 10) {
//   return getAllProperties(null, 2);
// }

const getAllReservations = function(guest_id, limit = 10) {
  const query = {
    //SQL query that joins multiple tables to get the required data
    text: `SELECT reservations.*, properties.*, avg(rating) as average_rating
           FROM reservations
           JOIN properties ON reservations.property_id = properties.id
           JOIN property_reviews ON properties.id = property_reviews.property_id
           WHERE reservations.guest_id = $1 AND end_date < now()::date
           GROUP BY reservations.id, properties.id
           ORDER BY reservations.start_date DESC
           LIMIT $2;`,
    values: [guest_id, limit]
  };

  return pool
    .query(query)
    .then(res => res.rows)
    .catch(err => console.error('Error executing query', err.stack));
};

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

//initial version replaced later
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }

// modified function duringbfirst stage of project
// const getAllProperties = (options, limit = 10) => {
//   pool
//     .query(`SELECT * FROM properties LIMIT $1`, [limit])
//     .then((result) => {
//       console.log(result.rows);
//       return result.rows;
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// };

const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_reviews.property_id
  `;

  // 3
  let whereClauseAdded = false;
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
    whereClauseAdded = true;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    if (whereClauseAdded) {
      queryString += `AND owner_id = $${queryParams.length} `;
    } else {
      queryString += `WHERE owner_id = $${queryParams.length} `;
      whereClauseAdded = true;
    }
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100, options.maximum_price_per_night * 100);
    if (whereClauseAdded) {
      queryString += `AND cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length} `;
    } else {
      queryString += `WHERE cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length} `;
      whereClauseAdded = true;
    }
  } else if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    if (whereClauseAdded) {
      queryString += `AND cost_per_night >= $${queryParams.length} `;
    } else {
      queryString += `WHERE cost_per_night >= $${queryParams.length} `;
      whereClauseAdded = true;
    }
  } else if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    if (whereClauseAdded) {
      queryString += `AND cost_per_night <= $${queryParams.length} `;
    } else {
      queryString += `WHERE cost_per_night <= $${queryParams.length} `;
      whereClauseAdded = true;
    }
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    if (whereClauseAdded) {
      queryString += `AND properties.id IN (
        SELECT property_reviews.property_id 
        FROM property_reviews 
        GROUP BY property_reviews.property_id
        HAVING AVG(property_reviews.rating) >= $${queryParams.length}
      ) `;
    } else {
      queryString += `WHERE properties.id IN (
        SELECT property_reviews.property_id 
        FROM property_reviews 
        GROUP BY property_reviews.property_id
        HAVING AVG(property_reviews.rating) >= $${queryParams.length}
      ) `;
      whereClauseAdded = true;
    }
  }



  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  return pool.query(queryString, queryParams).then((res) => res.rows);
};


exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
//initial version replaced later
// const addProperty = function(property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// }

const addProperty = function (property) {
  const costPerNightInCents = property.cost_per_night * 100; // Convert to cents
  const values = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, costPerNightInCents, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code];
  const queryString = `
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;
  return pool.query(queryString, values)
    .then(res => res.rows[0]);
};


exports.addProperty = addProperty;
