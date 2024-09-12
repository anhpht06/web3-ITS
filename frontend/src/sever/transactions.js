import API from "../sever/API.js";
import axios from "axios";
const URL_GET_HISTORY = API.baseURL + "blockchain/getDataByUser";
export async function getAllTRansaction(page) {
  try {
    // if (!page) page = 1;
    const transactions = await axios.get(URL_GET_HISTORY + `?page=${page}`);
    return transactions?.data?.data;
  } catch (error) {
    console.error(error);
  }
}
