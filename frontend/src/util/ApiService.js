export class API {
  static async request(endpoint, method, body = null) {
    const baseUrl = "http://localhost:3003";
    const url = `${baseUrl}/${endpoint}`;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error ${method}ing data:`, error);
      throw error;
    }
  }

  static async get(endpoint) {
    return this.request(endpoint, "GET");
  }

  static async post(endpoint, options) {
    return this.request(endpoint, "POST", options.body);
  }

  static async put(endpoint, options) {
    return this.request(endpoint, "PUT", options.body);
  }

  static async del(endpoint) {
    return this.request(endpoint, "DEL");
  }
}
