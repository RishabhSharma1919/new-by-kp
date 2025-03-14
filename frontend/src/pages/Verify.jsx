import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Verify = () => {
  const { navigate, token, setCartItems,backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!token) return;

      try {
        const res = await axios.post(
          `${backendUrl}/api/order/verifystripe`,
          { success, orderId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setCartItems({});
          navigate("/orders");
        } else {
          navigate("/cart");
        }
      } catch (error) {
        setError(error.message);
        toast.error("Payment verification failed!");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <Card className="w-[90%] sm:max-w-md p-8 bg-[#D6D6C7] text-[#2D2A26] shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Payment Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {loading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin w-8 h-8 text-[#2D2A26]" />
              <p className="mt-2 text-[#2D2A26]">Verifying your payment...</p>
            </div>
          ) : error ? (
            <p className="text-red-500 font-medium">{error}</p>
          ) : (
            <p className="text-green-600 font-medium">
              Payment verified successfully!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify;
