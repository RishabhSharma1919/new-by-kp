// ✅ Create a Blog
import axios from "axios"

export const checkout = async (req, res) => {
  try {
        console.log("=================");
        
        const response = await axios.post(
          "https://test-api.creem.io/v1/checkouts",
          {
            product_id: 'prod_54rOSCM2DeJHjmGXHBgCJn',
          },
          { headers: { "x-api-key": "creem_test_1Hb233kqU01XsYjXNfiIEA" } }
        );

        console.log(response);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};