import { QueryFunction } from "react-query/types/core/types"
import { FAVORITES_TABLE } from "../constants"
import { supabaseClient } from "./supabaseClient"

export const toggleFavorite: QueryFunction<boolean> = () => {


    return true
}