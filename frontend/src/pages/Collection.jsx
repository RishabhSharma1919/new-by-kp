import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { cn } from "@/lib/utils"; // Utility for conditional classnames
import { Card, CardContent } from "@/components/ui/card"; // ShadCN Card component

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // Toggle category filter
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Apply filter based on search and category
  const applyFilter = () => {
    let filtered = [...products];

    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.category));
    }

    setFilterProducts(filtered);
  };

  // Sort products
  const sortProduct = () => {
    let sortedProducts = [...filterProducts];

    switch (sortType) {
      case "low-high":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        applyFilter();
        return;
    }

    setFilterProducts(sortedProducts);
  };

  useEffect(() => {
    applyFilter();
  }, [category, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col gap-6 pt-10 border-t px-4 sm:px-8 lg:px-16">
      {/* HEADER & SORT OPTIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-4xl sm:text-5xl mb-4 gap-4">
        <Title text1={"ALL"} text2={"COLLECTIONS"} />
        <select
          onChange={(e) => setSortType(e.target.value)}
          className="border-2 border-gray-300 text-sm px-3 py-1 rounded-md"
        >
          <option value="relevant">Sort by: Relevant</option>
          <option value="low-high">Sort by: Low to High</option>
          <option value="high-low">Sort by: High to Low</option>
        </select>
      </div>

      {/* DISPLAY PRODUCTS */}
      {filterProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filterProducts.map((item) => (
            <Card
              key={item._id}
              className={cn(
                "relative w-full bg-[#E8E8E3] rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-500",
                "hover:scale-[1.02] hover:shadow-2xl"
              )}
              onClick={() => window.location.href = `/product/${item._id}`}
            >
              <CardContent className="p-4">
                <div className="relative w-full h-48 flex justify-center">
                  <div className="absolute w-full h-full bg-cover bg-center rounded-t-md overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-700">${item.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;
