-- SELECT city, COUNT(*)
-- FROM properties
-- JOIN reservations ON properties.id = reservations.property_id
-- GROUP BY city
-- ORDER BY COUNT(*) DESC;

SELECT properties.city, count(reservations) as total_reservations
FROM reservations
JOIN properties ON property_id = properties.id
GROUP BY properties.city
ORDER BY total_reservations DESC;