const VALID_ORDERS = ['addOrder', 'order', 'alias', 'whatsMyOrder', ':hamburger:'];

module.exports = function(order) {
  if (VALID_ORDERS.includes(order)) {
    return true;
  } else {
    throw new Error(`could not parse this order: ${order}`);
  }
}
