import CartContext from "../store/CartContext";
import Input from "../UI/Input";
import Modal from "../UI/Modal";
import { useContext } from "react";
import Button from "./Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";
const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};
export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgresCtx = useContext(UserProgressContext);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp("http://localhost:3000/orders", requestConfig);
  const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
    return totalPrice + item.quantity * item.price;
  }, 0);

  function handleClose() {
    userProgresCtx.hideCheckout();
  }

  function handleFinish() {
    userProgresCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());
    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending order data...</span>;
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgresCtx.progress === "checkout"}
        onClose={handleFinish}
      >
        <h2>Success!</h2>
        <p>Your order has been placed successfully</p>
        <p>
          We will get back to you with more details via email within the next
          few minutes
        </p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }
  return (
    <Modal open={userProgresCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {cartTotal}</p>
        <Input label="Full Name" type="text" id="name"></Input>
        <Input label="Email Address" type="email" id="email"></Input>
        <Input label="Street" type="text" id="street"></Input>
        <div className="control-row">
          <Input label="Post Code" type="text" id="postal-code"></Input>
          <Input label="City" type="text" id="city"></Input>
        </div>
        {error && (
          <Error title="Failed to send order data" message={error}></Error>
        )}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
