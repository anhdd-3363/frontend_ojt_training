import { defineStore } from "pinia";
import { cartMessage } from "../locales/vi/messages";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [],
  }),
  getters: {
    getTotalPrice: (state) =>
      state.cart.reduce(
        (accumulator, item) =>
          accumulator + item.inCartQuantity * item.book.price,
        0,
      ),
  },
  actions: {
    setCart(cart) {
      this.cart = cart;
    },
    addItem(newBook) {
      this.cart.push(newBook);
    },
    increment(id) {
      const inCartItem = this.cart.find((item) => item.id === id);
      if (inCartItem) {
        if (inCartItem.inCartQuantity < inCartItem.book.quantity) {
          inCartItem.inCartQuantity += 1;
        } else throw new Error(cartMessage.outOfStock);
      }
    },
    decrement(id) {
      const inCartItem = this.cart.find((item) => item.id === id);
      if (inCartItem && inCartItem.inCartQuantity > 1) {
        inCartItem.inCartQuantity -= 1;
      }
    },
    removeItem(id) {
      const remainCart = this.cart.filter((item) => item.id !== id);
      this.cart = remainCart;
    },
    clearCart() {
      this.cart = [];
    },
  },
  persist: true,
});
