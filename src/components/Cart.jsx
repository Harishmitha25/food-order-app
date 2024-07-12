import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import Modal from "../UI/Modal";
import Button from "./Button";
import { useContext } from "react";
import CartItem from "./CartItem";

export default function Cart() {
  const cartCtx = useContext(CartContext);
  const userProgresCtx = useContext(UserProgressContext);

  const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
    return totalPrice + item.quantity * item.price;
  }, 0);

  function handleCloseCart() {
    userProgresCtx.hideCart();
  }

  function handleGoToCheckout() {
    userProgresCtx.showCheckout();
  }
  return (
    <Modal
      className="cart"
      open={userProgresCtx.progress === "cart"}
      onClose={userProgresCtx.progress === "cart" ? handleCloseCart : null}
    >
      <h2>Your Cart</h2>
      <ul>
        {cartCtx.items.map((item) => (
          <CartItem
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            price={item.price}
            onIncrease={() => cartCtx.addItem(item)}
            onDecrease={() => cartCtx.removeItem(item.id)}
          ></CartItem>
        ))}
      </ul>
      <p className="total">${cartTotal}</p>
      <p className="modal-actions">
        <Button textOnly onClick={handleCloseCart}>
          Close
        </Button>
        {cartCtx.items.length > 0 && (
          <Button onClick={handleGoToCheckout}>Go to Checkout</Button>
        )}
      </p>
    </Modal>
  );
}
