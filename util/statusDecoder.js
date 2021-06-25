const statusDecoder = (status) => {
  return status == 1
    ? "Order placed"
    : status == 2
    ? "Pay upon delivery"
    : status == 3
    ? "Paid"
    : status == 4
    ? "Order received"
    : status == 5
    ? "Order is ready"
    : status == 6
    ? "Out for delivery"
    : status == 7
    ? "Completed"
    : status == 8
    ? "Reviewed"
    : null;
};

export default statusDecoder;
