import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const url = "http://localhost:4000";

    // Add to cart and update localStorage
    const addToCart = async (itemId) => {
        const newCartItems = { ...cartItems };
        if (!newCartItems[itemId]) {
            newCartItems[itemId] = 1;
        } else {
            newCartItems[itemId] += 1;
        }
        setCartItems(newCartItems);
        localStorage.setItem("cartItems", JSON.stringify(newCartItems)); 

        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        const newCartItems = { ...cartItems };
        if (newCartItems[itemId] > 1) {
            newCartItems[itemId] -= 1;
        } else {
            delete newCartItems[itemId];
        }
        setCartItems(newCartItems);
        localStorage.setItem("cartItems", JSON.stringify(newCartItems)); 

        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        let total = 0;
        for (let itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                let itemInfo = food_list.find((product) => product._id === itemId);
                if (itemInfo) {
                    total += Number(itemInfo.price) * cartItems[itemId];
                }
            }
        }
        return total;
    };

    const loadCartData = async (token) => {
        const response = await axios.get(url + "/api/cart/get", { headers: { token } });
        setCartItems(response.data.cartData);
        localStorage.setItem("cartItems", JSON.stringify(response.data.cartData));
    };

    const fetchFoodList = async () => {
        const response = await axios.get(`${url}/api/food/list`);
        setFoodList(response.data.data);
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedCartItems = localStorage.getItem("cartItems");

        async function loadData() {
            await fetchFoodList();

            if (storedCartItems) {
                setCartItems(JSON.parse(storedCartItems));
            }

            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        }

        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        url
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
