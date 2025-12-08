import Conso, { Iconso } from '../models/conso';
import axios from 'axios';

export const createConsoService = async (
  userId: string,
  barcode: string,
  lieu?: string,
  notes?: string
): Promise<Iconso> => {
  if (!barcode) {
    throw new Error('Barcode manquant');
  }

  const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
  const product = response.data.product;

  const produit = product?.product_name || 'Produit inconnu';
  const sucre = product?.nutriments?.sugars_serving || 0;
  const cafeine = product?.nutriments?.caffeine_serving || 0;
  const calories = product?.nutriments?.['energy-kcal_serving'] || 0;

  const conso = new Conso({
    produit,
    sucre,
    cafeine,
    calories,
    lieu,
    notes,
    user: userId,
  });

  return conso.save();
};

export const getConsoByUserService = async (userId: string) => {
  return Conso.find({ user: userId }).sort({ createdAt: -1 });
};

export const getAllConsoService = async () => {
  return Conso.find().sort({ createdAt: -1 });
};

export const getStatsbyWeek = async (date: Date) => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);
  endOfWeek.setHours(0, 0, 0, 0);

  const consommations = await Conso.find({ createdAt: { $lt: endOfWeek, $gte: startOfWeek} });

  return computeStats(consommations);
}

export const getStatsByMonth = async (date: Date) => {
  const startOfMonth = new Date(date);
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setDate(1);
  endOfMonth.setHours(0, 0, 0, 0);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const consommations = await Conso.find({ createdAt: { $lt: endOfMonth, $gte: startOfMonth} });

  return computeStats(consommations);
};

export const getStatByDay = async (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const consommations = await Conso.find({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  return computeStats(consommations);
};

const computeStats = (consommations: Iconso[]) => {
  const totalSucre = consommations.reduce((sum, c) => sum + c.sucre, 0);
  const totalCafeine = consommations.reduce((sum, c) => sum + c.cafeine, 0);
  const totalCalories = consommations.reduce((sum, c) => sum + c.calories, 0);
  const totalContributions = consommations.length;

  return { totalSucre, totalCafeine, totalCalories, totalContributions };
};