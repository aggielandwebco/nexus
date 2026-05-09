import { createContext, useContext } from "react";

const BusinessContext = createContext({
  business: {
    name: "Aggieland Web Co"
  },
  loading: false
});

export function BusinessProvider({ children }) {
  return (
    <BusinessContext.Provider
      value={{
        business: {
          name: "Aggieland Web Co"
        },
        loading: false
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}
