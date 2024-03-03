import axios from 'axios';

const axiosInterceptorInstanceFaas = axios.create({
  baseURL: 'https://faas.teknix.dev/function', // Replace with your API base URL
});


// Request interceptor
axiosInterceptorInstanceFaas.interceptors.request.use(
  (config) => {
    // Modify the request config here (add headers, authentication tokens)
        // const accessToken = JSON.parse(localStorage.getItem("token"));

    // If token is present add it to request's Authorization Header
    // if (accessToken) {
    //   if (config.headers) config.headers.token = accessToken;
    // }
    return config;
  },
  (error) => {
    // Handle request errors here

    return Promise.reject(error);
  }
);
// End of Request interceptor



// Response interceptor
axiosInterceptorInstanceFaas.interceptors.response.use(
  (response) => {
    // Modify the response data here

    return response;
  },
  (error) => {
    // Handle response errors here

    return Promise.reject(error);
  }
);
// End of Response interceptor

export default axiosInterceptorInstanceFaas;