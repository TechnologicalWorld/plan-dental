import { useCharacters } from '../hooks/useCharacters';
import CharacterList from './CharacterList';

export default function CharacterListContainer() {
  const { characters, loading } = useCharacters();
  return <CharacterList characters={characters} loading={loading} />;
}
