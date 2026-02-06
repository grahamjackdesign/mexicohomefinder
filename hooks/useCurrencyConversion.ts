// hooks/useCurrencyConversion.ts
'use client';

import { useState, useEffect } from 'react';

interface ExchangeRates {
  USD_TO_MXN: number;
  MXN_TO_USD: number;
  lastUpdated: Date;
}

export function useCurrencyConversion() {
  const [rates, setRates] = useState<ExchangeRates>({
    USD_TO_MXN: 20, // Default fallback rate
    MXN_TO_USD: 0.05,
    lastUpdated: new Date(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        // Free API (exchangerate-api.com)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        setRates({
          USD_TO_MXN: data.rates.MXN,
          MXN_TO_USD: 1 / data.rates.MXN,
          lastUpdated: new Date(data.date),
        });
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        // Keep default rates on error
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
    
    // Refresh rates every hour
    const interval = setInterval(fetchRates, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const convertPrice = (
    price: number,
    fromCurrency: string,
    toCurrency: string
  ): number => {
    if (fromCurrency === toCurrency) return price;
    
    if (fromCurrency === 'USD' && toCurrency === 'MXN') {
      return price * rates.USD_TO_MXN;
    }
    
    if (fromCurrency === 'MXN' && toCurrency === 'USD') {
      return price * rates.MXN_TO_USD;
    }
    
    return price;
  };

  return {
    rates,
    loading,
    convertPrice,
  };
}
