const VALID_ORDERS = ['addorder', 'order', 'alias', 'what', ':hamburger:', 'botw', 'menu'];

module.exports = function(order) {
  if (VALID_ORDERS.includes(order)) {
    return true;
  } else {
    throw new Error(`could not parse this order: ${order}`);
  }
}
