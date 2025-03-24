// import * as yup from "yup";
export  const userProfileSchema = yup.object({
    first_name: yup.string().required("First Name is required"),
    last_name: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().matches(/^\d{10}$/, "Phone number must be 10 digits").required("Phone number is required"),
    address: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
});
// export  const userBillingSchema = yup.object({
//     billing_first_name: yup.string().required("Billing first name is required"),
//     billing_last_name: yup.string().required("Billing last name is required"),
//     billing_email: yup.string().email("Invalid email").required("Billing email is required"),
//     billing_phone: yup.string().matches(/^\d{10}$/, "Phone number must be 10 digits").required("Billing phone number is required"),
//     billing_address: yup.string().required("Billing address is required"),
//     billing_city: yup.string().required("Billing city is required"),
// });

import * as yup from "yup";

export const userShippingSchema = (sameAsShipping) => {
  return yup.object().shape({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone number is required"),
    country: yup.string().required("Country is required"),
    city: yup.string().required("City is required"),
    address: yup.string().required("Address is required"),
    
    // Agar `sameAsShipping === false` hai to billing ka validation bhi apply hoga
    ...(sameAsShipping
      ? {} // Billing fields ko skip kar do
      : {
          billing_first_name: yup.string().required("Billing first name is required"),
          billing_last_name: yup.string().required("Billing last name is required"),
          billing_email: yup.string().email("Invalid email").required("Billing email is required"),
          billing_phone: yup.string().required("Billing phone number is required"),
          billing_country: yup.string().required("Billing country is required"),
          billing_city: yup.string().required("Billing city is required"),
          billing_address: yup.string().required("Billing address is required"),
        }),
  });
};
