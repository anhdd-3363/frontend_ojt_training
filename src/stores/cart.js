import { defineStore } from "pinia";
import { cartMessage } from "../locales/vi/messages";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [],
  }),
  getters: {
    getTotalPrice: (state) =>
      state.cart.reduce(
        (accumulator, item) => accumulator + item.inCartQuantity * item.price,
        0
      ),
  },
  actions: {
    addToCart(book) {
      const inCartItem = this.cart.find((item) => item.id === book.id);
      if (inCartItem) {
        if (inCartItem.inCartQuantity < inCartItem.quantity) {
          inCartItem.inCartQuantity += 1;
        } else {
          throw new Error(cartMessage.outOfStock);
        }
      } else {
        this.cart.push({
          ...book,
          inCartQuantity: 1,
        });
      }
    },
    increment(id) {
      const inCartItem = this.cart.find((item) => item.id === id);
      if (inCartItem && inCartItem.inCartQuantity < inCartItem.quantity)
        inCartItem.inCartQuantity += 1;
      else {
        throw new Error(cartMessage.outOfStock);
      }
    },
    decrement(id) {
      const inCartItem = this.cart.find((item) => item.id === id);
      if (inCartItem) {
        if (inCartItem.inCartQuantity === 1) {
          inCartItem.inCartQuantity = 1;
        } else {
          inCartItem.inCartQuantity -= 1;
        }
      }
    },
    removeItem(id) {
      const remainCart = this.cart.filter((item) => item.id !== id);
      this.cart = remainCart;
    },
    removeAllItem() {
      this.cart = [];
    },
  },
  persist: true,
});
