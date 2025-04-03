import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refresh: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const result = await window.electronAPI.getCurrentUser();
        console.log("AuthContext getCurrentUser result:", result);
        if (result?.success) {
          setUser(result.user);
        } else {
          console.warn("Failed to fetch user:", result);
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  
  const logout = async () => {
    await window.electronAPI.signOut();
    setUser(null);
  };

  const refresh = async () => {
    try {
      setLoading(true);
      const result = await window.electronAPI.getCurrentUser();
      console.log("AuthContext refreshed:", result);
      if (result?.success) {
        setUser(result.user);
      } else {
        console.warn("Refresh failed:", result);
        setUser(null);
      }
    } catch (err) {
      console.error("Error during refresh:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, loading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
