import apiClient from "@/service/Index";
import debounce from "lodash/debounce";
 
 export const getImageUrl = (imagePath) => {
  return `${process.env.VUE_APP_API_URL}/${imagePath}`;
  };

export  const getCountries = async () =>  {
    try {
        const response = await apiClient.get('/countries');
        if(response.data ?. success){
            return response;
        }
    } catch (error) {
        console.error('counries not found');
        throw error;
    }
       
  }
  
export  const convertToUTC = (date) => {
    return date ? new Date(date).toISOString() : null;
  };

export  const calculateDiscountPercentage = (productPrice, deal) =>  {
    let discountPercentage = 0;

    if (deal.discount_type === 'percentage') {
        discountPercentage = deal.discount_value; 
    } else if (deal.discount_type === 'Fixed') {
        let finalPrice = productPrice - deal.discount_value;
        discountPercentage = ((productPrice - finalPrice) / productPrice) * 100;
    }
    return parseInt(discountPercentage); 
};
export const calculateDiscountedPrice = (productPrice, deal) => {
    let finalPrice = Number(productPrice); // Ensure productPrice is a number

    if (deal.discount_type === 'percentage') {
        finalPrice = finalPrice - (finalPrice * (Number(deal.discount_value) / 100)); // Ensure discount_value is a number
    }else{
        finalPrice = finalPrice - Number(deal.discount_value); 
    }
    return finalPrice > 0 && !isNaN(finalPrice) ? finalPrice.toFixed(0) : '0.00';
};
export const convertToIST = (date) => {
    if (!date) return null;
  
    const utcDate = new Date(date);
    const offset = 5.5 * 60;

    utcDate.setMinutes(utcDate.getMinutes() + offset);

    return utcDate.toLocaleString('en-IN', { 
      weekday: 'short', 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };


  // Create a reusable debounce function
export const  useDebouncedFunction = (fn, delay = 1000) => {
    return debounce(fn, delay);
}
  