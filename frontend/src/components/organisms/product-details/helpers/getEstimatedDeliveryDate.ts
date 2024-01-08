export const getEstimatedDeliveryDate = (deliveryDays: number): string => {
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
  let formattedDate = estimatedDate.toLocaleDateString();
  formattedDate = formattedDate.replace(/\//g, '-');
  return formattedDate;
};
