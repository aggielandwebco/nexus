export function useBusiness() {
  return {
    business: {
      name: "Aggieland Web Co"
    }
  };
}

export function BusinessProvider({ children }) {
  return children;
}
