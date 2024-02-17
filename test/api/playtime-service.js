import axios from "axios";
import { serviceUrl } from "../fixtures.js";

export const playtimeService = {
  playtimeUrl: serviceUrl,

  async createUser(user) {
    const res = await axios.post(`${this.playtimeUrl}/api/users`, user);
    return res.data;
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
    const res = await axios.post(`${this.playtimeUrl}/api/countys`, county);
    return res.data;
  },

  async deleteAllCountys() {
    const response = await axios.delete(`${this.playtimeUrl}/api/countys`);
    return response.data;
  },

  async deleteCounty(id) {
    const response = await axios.delete(`${this.playtimeUrl}/api/countys/${id}`);
    return response;
  },

  async getAllCountys() {
    const res = await axios.get(`${this.playtimeUrl}/api/countys`);
    return res.data;
  },

  async getCounty(id) {
    const res = await axios.get(`${this.playtimeUrl}/api/countys/${id}`);
    return res.data;
  },

  async getAllDealers() {
    const res = await axios.get(`${this.playtimeUrl}/api/dealers`);
    return res.data;
  },

  async createDealer(id, dealer) {
    const res = await axios.post(`${this.playtimeUrl}/api/countys/${id}/dealers`, dealer);
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
