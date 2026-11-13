import axios from "axios";

export const CheckoutButton = () => {
  const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || "https://new-by-kp.vercel.app";
  const backendUrl = rawBackendUrl.replace(/\/+$/, "");

  const handleClick = async () => {
    const redirectUrl = await axios.post(
      `${backendUrl}/api/checkout/checkout`
    );
    console.log(redirectUrl);
  };
  return <div onClick={handleClick}>kp</div>;
};

export default CheckoutButton;
