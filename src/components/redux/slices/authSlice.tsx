import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface userState {
    user: {
        message: string
        accessToken: string
        refreshToken: string
        expiresIn: string
        user: {
            id: string
            firstName: string
            lastName: string
            username: string
            email: string
            phone: string
            profilePhoto: string | null
            referralCode: string
            phoneVerified: boolean
            emailVerified: boolean
            status: string
            createdAt: string
            /** Optional until API ships a dedicated plan field */
            isPro?: boolean
        }
    } | null
    location: {
        latitude: number
        longitude: number
    } | null
    address: string | null
}

const initialState: userState = {
    user: null,
    location: null,
    address: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<userState['user']>) => {
            state.user = action.payload
        },
        clearuser: (state) => {
            state.user = null
        },
        setLocation: (state, action: PayloadAction<userState['location']>) => {
            state.location = action.payload
        },
        setAddress: (state, action: PayloadAction<userState['address']>) => {
            state.address = action.payload
        },
        clearLocation: (state) => {
            state.location = null
        },
    },
})

export const { setUser, clearuser, setLocation, clearLocation, setAddress } = userSlice.actions

export default userSlice.reducer
