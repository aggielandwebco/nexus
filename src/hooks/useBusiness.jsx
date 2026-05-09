import { createContext, useContext } from "react";

const BusinessContext = createContext({
  business: {
    name: "Aggieland Web Co"
  },
  loading: false
});

export function BusinessProvider({ children }) {
  const business = {
    name: "Aggieland Web Co"
  };

  return (
    <BusinessContext.Provider value={{ business, loading: false }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}
