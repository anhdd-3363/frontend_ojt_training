import { defineStore } from "pinia";
import Cookies from "js-cookie";
import decodeJwt from "jwt-decode";
import { TOKEN_KEY } from "@constants/storage";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    identity: null,
  }),
  actions: {
    loginUser(accessToken) {
      Cookies.set(TOKEN_KEY, accessToken);
      window.location.replace("/");
    },
    getIdentity() {
      const token = Cookies.get(TOKEN_KEY);
      if (token) {
        const decoded = decodeJwt(token);
        this.identity = decoded;
      }
    },
    logout() {
      Cookies.remove(TOKEN_KEY);
      window.location.replace("/login");
    },
  },
});
