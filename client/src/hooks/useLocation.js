import { useState, useCallback } from 'react';

export function useLocation() {
  const [location, setLocation] = useState({ lat: null, lng: null, error: null });
  const [loading, setLoading] = useState(false);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: 'Geolocation is not supported by your browser.' }));
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: parseFloat(position.coords.latitude.toFixed(6)),
          lng: parseFloat(position.coords.longitude.toFixed(6)),
          error: null,
        });
        setLoading(false);
      },
      (err) => {
        setLocation((prev) => ({ ...prev, error: err.message }));
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { location, getLocation, loading, error: location.error };
}