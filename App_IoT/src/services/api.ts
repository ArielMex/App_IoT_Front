import axios from 'axios';

const API_URL = 'http://moriahmkt.com/iotapp/test/';

export interface Parcela {
  id: number;
  nombre: string;
  // ... resto de propiedades
}

export const fetchData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const deleteParcel = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}parcelas/${id}`);
  } catch (error) {
    console.error('Error deleting parcel:', error);
    throw error;
  }
};