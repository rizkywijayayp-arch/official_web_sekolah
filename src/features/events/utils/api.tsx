import axios from 'axios';

// Base URL dari environment variable atau fallback ke default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/calendar`
  : 'https://dev.kiraproject.id/api/calendar';

// Inisialisasi Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Middleware untuk menambahkan token secara otomatis ke setiap request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
    } else {
      
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ **FETCH SEMUA EVENT**
export const fetchCalendarEvents = async () => {
  try {
    
    const response = await apiClient.get('/');
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '❌ Error fetching calendar events:',
        error.response?.data || error.message,
      );
    } else {
      
    }
    throw error;
  }
};

export const fetchCalendarEventById = async (eventId: number) => {
  try {
    
    const response = await apiClient.get(`/${eventId}`);

    // ✅ Pastikan hanya mengambil bagian `data`
    const existingData = response?.data?.data;

    if (!existingData || !existingData.id) {
      
      return null;
    }

    

    return existingData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      
      return null;
    }
    console.error(
      '❌ Error fetching calendar event by ID:',
      axios.isAxiosError(error) ? error.response?.data || error.message : error,
    );
    throw error;
  }
};

// ✅ **CREATE EVENT**

// ✅ CREATE EVENT (Menggunakan FormData untuk File Upload)
export const createCalendarEvent = async (eventData: FormData) => {
  try {
    console.log(
      '➕ Creating event with data:',
      Object.fromEntries(eventData.entries()),
    );
    const response = await apiClient.post('/', eventData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return response.data;
  } catch (error) {
    console.error(
      '❌ Error creating event:',
      axios.isAxiosError(error) ? error.response?.data || error.message : error,
    );
    throw error;
  }
};

// ✅ UPDATE EVENT (Menggunakan FormData)
export const updateCalendarEvent = async (
  eventId: number,
  eventData: FormData,
) => {
  try {
    
    const response = await apiClient.put(`/${eventId}`, eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '❌ Error updating note siswa:',
        error.response?.data || error.message,
      );
    } else {
      
    }
    throw error;
  }
};

// ✅ **DELETE EVENT**
export const deleteCalendarEvent = async (eventId: number) => {
  try {
    

    // First, check if the event exists before deleting
    const checkEvent = await apiClient.get(`/${eventId}`);
    if (!checkEvent.data) {
      
      return; // Event not found, so skip deletion
    }

    // If event exists, proceed to delete it
    const response = await apiClient.delete(`/${eventId}`);
    
    return response.data; // Return the response data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '❌ Error deleting calendar event:',
        error.response?.data || error.message,
      );
    } else {
      
    }
    throw error; // Re-throw the error if any
  }
};
