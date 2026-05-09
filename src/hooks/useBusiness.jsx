import { useState, useEffect, createContext, useContext } from 'react';
import { base44 } from '@/api/base44Client';

const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const user = await base44.auth.me();
      const businesses = await base44.entities.Business.filter({ created_by: user.email });
      if (businesses.length > 0) {
        setBusiness(businesses[0]);
      } else {
        const newBiz = await base44.entities.Business.create({
          name: "My Business",
          ai_tone: "Professional",
          plan: "Business"
        });
        setBusiness(newBiz);
      }
      setLoading(false);
    }
    init();
  }, []);

  const refreshBusiness = async () => {
    if (business) {
      const businesses = await base44.entities.Business.filter({ created_by: (await base44.auth.me()).email });
      if (businesses.length > 0) setBusiness(businesses[0]);
    }
  };

  return (
    <BusinessContext.Provider value={{ business, loading, refreshBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used within BusinessProvider");
  return ctx;
}
