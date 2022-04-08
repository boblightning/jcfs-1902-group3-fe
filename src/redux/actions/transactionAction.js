import axios from "axios"
import { API_URL } from "../../helper"

export const addCartAction = (data) => {
    return async (dispatch) => {
        try {
            let res = await axios.post(`${API_URL}/transactions/carts`,data)

            if(res.data.success){
                return {success: res.data.success}
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const getCartAction = () => {
    return async (dispatch) => {
        try {
            let res  = await axios.get(`${API_URL}/transactions/carts`)
            
            if(res.data.success) {
                dispatch({
                    type: 'GET DATA CART',
                    payload: res.data.dataCart
                })

                return {success: res.data.success, data: res.data.dataCart}
            }
        } catch (error) {
            console.log(error)
        }
    }

}
export const updateQtyCartAction = (idcart,data) => {
    return async (dispatch) => {
        try {
            let res = await axios.patch(`${API_URL}/transactions/carts/${idcart}`, data)
            if(res.data.success){
                dispatch(getCartAction())
                return {success: res.data.success}
            }
        } catch (error) {
            console.log(error)
        }
    }
}
export const deleteCartAction = (idcart) => {
    return async (dispatch) => {
        try {
            let res = await axios.delete(`${API_URL}/transactions/carts/${idcart}`)
            if(res.data.success){
                dispatch(getCartAction())
                return {success: res.data.success}
            }
        } catch (error) {
            console.log(error)
        }
    }
}