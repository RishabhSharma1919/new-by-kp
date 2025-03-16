import axios from "axios";

export const CheckoutButton = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleClick = async () => {
    const redirectUrl = await axios.post(
      `${backendUrl}/api/checkout/checkout`
    );
    console.log(redirectUrl);
  };
  return <div onClick={handleClick}>kp</div>;
};

export default CheckoutButton;
