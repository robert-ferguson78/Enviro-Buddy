import axios from "axios";
import { serviceUrl } from "../fixtures.js";

export const playtimeService = {
  playtimeUrl: serviceUrl,

  // async createUser(user) {
  //   const res = await axios.post(`${this.playtimeUrl}/api/users`, user);
  //   return res.data;
  // },

  async createUser(user) {
    const userWithoutId = { ...user };
    delete userWithoutId._id;
    try {
      const res = await axios.post(`${this.playtimeUrl}/api/users`, user);
      return res.data;
    } catch (error) {
      console.error(error.response.data);
      throw error;
    }
  },

  async getUser(id) {
    const res = await axios.get(`${this.playtimeUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${this.playtimeUrl}/api/users`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.playtimeUrl}/api/users`);
    return res.data;
  },

  async createCounty(county) {
    const res = await axios.post(`${this.playtimeUrl}/api/counties`, county);
    return res.data;
  },

  async deleteAllCounties() {
    const response = await axios.delete(`${this.playtimeUrl}/api/counties`);
    return response.data;
  },

  async deleteCounty(id) {
    const response = await axios.delete(`${this.playtimeUrl}/api/counties/${id}`);
    return response;
  },

  async getAllCounties() {
    const res = await axios.get(`${this.playtimeUrl}/api/counties`);
    return res.data;
  },

  async getCounty(id) {
    const res = await axios.get(`${this.playtimeUrl}/api/counties/${id}`);
    return res.data;
  },

  async getAllDealers() {
    const res = await axios.get(`${this.playtimeUrl}/api/dealers`);
    return res.data;
  },

  async createDealer(id, dealer) {
    const res = await axios.post(`${this.playtimeUrl}/api/counties/${id}/dealers`, dealer);
    return res.data;
  },

  async deleteAllDealers() {
    const res = await axios.delete(`${this.playtimeUrl}/api/dealers`);
    return res.data;
  },

  async getDealer(id) {
    const res = await axios.get(`${this.playtimeUrl}/api/dealers/${id}`);
    return res.data;
  },

  async deleteDealer(id) {
    const res = await axios.delete(`${this.playtimeUrl}/api/dealers/${id}`);
    return res.data;
  },
};
