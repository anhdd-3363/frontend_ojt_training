import moment from "moment";

export const formatPrice = (price) => {
  return price >= 0
    ? price.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
      })
    : price;
};

export const formatDate = (date) => {
  return moment(date).format("DD MMMM YYYY, h:mm:ss a");
};

export const calculatePageSum = (total, limit) => {
  return Math.ceil(total / limit);
};
