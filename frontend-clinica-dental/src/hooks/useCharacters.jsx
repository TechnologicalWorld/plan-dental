import { useEffect, useState } from 'react';
import { getCharacters } from '../services/rickService';

export function useCharacters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCharacters().then(data => {
      setCharacters(data);
      setLoading(false);
    });
  }, []);

  return { characters, loading };
}
