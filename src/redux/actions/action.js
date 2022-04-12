
export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";
export const CLEAR = "CLEAR";


export const countActions = {
  increment() {
  
    return { type: INCREMENT };
  },

  decrement() {
    return { type: DECREMENT };
  },

  clear(payload) {
    return { type: CLEAR, payload };
  },

}
