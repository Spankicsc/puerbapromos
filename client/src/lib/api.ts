import { apiRequest } from "./queryClient";
import { type Brand, type Promotion, type PromotionItem } from "@shared/schema";

export const api = {
  // Brands
  getBrands: (): Promise<Brand[]> => 
    fetch('/api/brands').then(res => res.json()),
    
  getBrand: (slug: string): Promise<Brand> => 
    fetch(`/api/brands/${slug}`).then(res => res.json()),
    
  getBrandPromotions: (slug: string): Promise<Promotion[]> => 
    fetch(`/api/brands/${slug}/promotions`).then(res => res.json()),
    
  // Promotions
  getPromotions: (): Promise<Promotion[]> => 
    fetch('/api/promotions').then(res => res.json()),
    
  getPromotion: (slug: string): Promise<Promotion> => 
    fetch(`/api/promotions/${slug}`).then(res => res.json()),
    
  getPromotionItems: (slug: string): Promise<PromotionItem[]> => 
    fetch(`/api/promotions/${slug}/items`).then(res => res.json()),
    
  // Search
  searchPromotions: (query: string): Promise<Promotion[]> => 
    fetch(`/api/search/promotions?q=${encodeURIComponent(query)}`).then(res => res.json()),
    
  searchItems: (query: string): Promise<PromotionItem[]> => 
    fetch(`/api/search/items?q=${encodeURIComponent(query)}`).then(res => res.json()),
};
