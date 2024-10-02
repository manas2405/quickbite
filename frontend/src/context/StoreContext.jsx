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
        newCartItems[itemId] = (newCartItems[itemId] || 0) + 1;
        setCartItems(newCartItems);
        localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    
        if (token) {
            try {
                await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (error) {
                console.error("Error adding item to cart:", error);
            }
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
            try {
                await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (error) {
                console.error("Error removing item from cart:", error);
            }
        }
    };
    

    const getTotalCartAmount = () => {
        let total = 0;
        for (let itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                const itemInfo = food_list.find((product) => product._id === itemId);
                if (itemInfo) {
                    total += Number(itemInfo.price) * cartItems[itemId];
                }
            }
        }
        return total;
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("cartItems");
        setToken("");
        setCartItems({});
    };
    

    const loadCartData = async (token) => {
        if (!token) return; 
    
        try {
            const response = await axios.get(`${url}/api/cart/get`, { headers: { Authorization: `Bearer ${token}` } });
            const cartData = response.data.cartData || {};
            setCartItems(cartData);
            localStorage.setItem("cartItems", JSON.stringify(cartData));
        } catch (error) {
            console.error("Error loading cart data:", error);
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized access, logging out.");
                handleLogout(); 
            }
        }
    };
    

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            setFoodList(response.data.data || []);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedCartItems = localStorage.getItem("cartItems");

        const loadData = async () => {
            await fetchFoodList();
        
            if (storedCartItems) {
                try {
                    const parsedCartItems = JSON.parse(storedCartItems);
                    setCartItems(parsedCartItems);
                } catch (error) {
                    console.error("Error parsing stored cart items:", error);
                    setCartItems({});
                }
            }
        
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        };

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
        url,
        handleLogout
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
