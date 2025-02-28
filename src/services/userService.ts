import { UsersResponse } from "@/types/user.types";
import axios from "axios";

const API_URL = "https://dummyjson.com/users";

export const fetchUsers = async (
  limit: number = 100
): Promise<UsersResponse> => {
  try {
    const response = await axios.get<UsersResponse>(
      `${API_URL}?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};
