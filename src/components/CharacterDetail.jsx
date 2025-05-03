import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LiveClock from './LiveClock';

export default function CharacterDetail() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [episodeCount, setEpisodeCount] = useState(0);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://rickandmortyapi.com/api/character/${id}`
        );
        setCharacter(response.data);
        setEpisodeCount(response.data.episode.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching character:', error);
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!character) {
    return <div className="text-center py-10">Character not found</div>;
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-green-600 text-white py-6 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">{character.name}</h1>
          <Link
            to="/"
            className="mt-4 inline-block bg-white text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Back to Gallery
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img
              src={character.image}
              alt={character.name}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Character Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700">Status</h3>
                <div className="flex items-center">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      character.status === 'Alive'
                        ? 'bg-green-500'
                        : character.status === 'Dead'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}
                  ></span>
                  <p>{character.status}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Species</h3>
                <p>{character.species}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Type</h3>
                <p>{character.type || 'Unknown'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Gender</h3>
                <p>{character.gender}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Origin</h3>
                <p>{character.origin.name}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Location</h3>
                <p>{character.location.name}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Episode Appearances</h3>
                <p>{episodeCount}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Created</h3>
                <p>{new Date(character.created).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <LiveClock />
        </div>
      </footer>
    </div>
  );
}