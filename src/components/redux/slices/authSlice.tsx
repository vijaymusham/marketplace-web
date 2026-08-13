import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_INDIA_LOCATION } from '@/lib/geo'

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
    location: {
        latitude: DEFAULT_INDIA_LOCATION.latitude,
        longitude: DEFAULT_INDIA_LOCATION.longitude,
    },
    address: 'India',
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
            state.location = {
                latitude: DEFAULT_INDIA_LOCATION.latitude,
                longitude: DEFAULT_INDIA_LOCATION.longitude,
            }
            state.address = 'India'
        },
    },
})

export const { setUser, clearuser, setLocation, clearLocation, setAddress } = userSlice.actions

export default userSlice.reducer
