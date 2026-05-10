import { createContext, useContext } from "react";

const DEFAULT_BUSINESS = {
  id: "integris-nexus-main",
  name: "Integris Nexus"
};

const BusinessContext = createContext({
  business: DEFAULT_BUSINESS,
  loading: false
});

export function BusinessProvider({ children }) {
  return (
    <BusinessContext.Provider
      value={{
        business: DEFAULT_BUSINESS,
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
