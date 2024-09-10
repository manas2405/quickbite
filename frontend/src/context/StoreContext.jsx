import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const [food_list, setFoodList] = useState([])
    const url = `http://localhost:4000`;

    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const newCartItems = { ...prev };
            if (newCartItems[itemId] > 1) {
                newCartItems[itemId] -= 1;
            } else {
                delete newCartItems[itemId];
            }
            return newCartItems;
        });
    };

    const getTotalCartAmount = () => {
        let total = 0;
        for (let items in cartItems) {
            if (cartItems[items] > 0) {
                let itemInfo = food_list.find((product) => product._id === items);
                if (itemInfo) {
                    total += Number(itemInfo.price) * cartItems[items];
                }
            }
        }
        return total;
    };

    const fetchFoodList = async () => {
        const response = await axios.get(`${url}/api/food/list`);
        setFoodList(response.data.data);
    }

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        async function loadData() {
            await fetchFoodList()
            if (storedToken){
                setToken(storedToken)
            }
        }

        loadData()
    }, [])

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
