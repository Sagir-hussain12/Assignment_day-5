import { useState, useEffect } from 'react';
import { ChevronLeft, Loader2, MapPin, User, Calendar, Film, Users } from 'lucide-react';

export default function CharacterDetail() {
  // In a real app, you'd get the ID from useParams
  // This is a demo version that takes an ID prop
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [episodeCount, setEpisodeCount] = useState(0);
  const [relatedCharacters, setRelatedCharacters] = useState([]);
  const [id, setId] = useState(1); // Demo ID

  // Function to simulate navigation/prop changes for demo
  const loadCharacter = (newId) => {
    setId(newId);
    setLoading(true);
  };

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://rickandmortyapi.com/api/character/${id}`
        );
        const data = await response.json();
        setCharacter(data);
        setEpisodeCount(data.episode.length);
        
        // Fetch related characters (same location)
        const locationId = data.location.url.split('/').pop();
        if (locationId && locationId !== '') {
          const locationResponse = await fetch(
            `https://rickandmortyapi.com/api/location/${locationId}`
          );
          const locationData = await locationResponse.json();
          const residentIds = locationData.residents
            .map(url => url.split('/').pop())
            .filter(resId => resId !== id.toString())
            .slice(0, 4);
            
          if (residentIds.length > 0) {
            const residentsResponse = await fetch(
              `https://rickandmortyapi.com/api/character/${residentIds.join(',')}`
            );
            const residentsData = await residentsResponse.json();
            setRelatedCharacters(Array.isArray(residentsData) ? residentsData : [residentsData]);
          } else {
            setRelatedCharacters([]);
          }
        }
        
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
      <div className="flex flex-col justify-center items-center h-screen bg-slate-900 text-white">
        <Loader2 className="h-12 w-12 animate-spin text-green-500 mb-4" />
        <p className="text-lg font-medium">Loading character data...</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center p-8 bg-slate-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Character not found</h2>
          <p className="mb-6">This character may have been erased from reality by Rick.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Alive': return 'bg-green-500';
      case 'Dead': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="py-6">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-white hover:text-green-200 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Gallery
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="md:flex">
            <div className="md:w-2/5 lg:w-1/3 relative">
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 rounded-full px-3 py-1 flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(character.status)}`}></span>
                <span>{character.status}</span>
              </div>
            </div>
            
            <div className="md:w-3/5 lg:w-2/3 p-6 md:p-8">
              <h1 className="text-4xl font-bold mb-2">{character.name}</h1>
              <div className="text-green-400 text-lg mb-6">{character.species} • {character.gender}</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Origin</h3>
                    <p className="text-gray-300">{character.origin.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Current Location</h3>
                    <p className="text-gray-300">{character.location.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Film className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Episodes</h3>
                    <p className="text-gray-300">Appeared in {episodeCount} episode{episodeCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">First Seen</h3>
                    <p className="text-gray-300">{new Date(character.created).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {character.type && (
                  <div className="flex items-start">
                    <User className="h-6 w-6 text-green-500 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Type</h3>
                      <p className="text-gray-300">{character.type}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {relatedCharacters.length > 0 && (
                <div>
                  <div className="flex items-center mb-4">
                    <Users className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="font-semibold text-lg">Other characters at {character.location.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {relatedCharacters.map(related => (
                      <div 
                        key={related.id}
                        onClick={() => loadCharacter(related.id)}
                        className="bg-slate-700 rounded-lg overflow-hidden cursor-pointer hover:bg-slate-600 transition-colors"
                      >
                        <img
                          src={related.image}
                          alt={related.name}
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-2 text-center truncate">
                          {related.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-slate-800 text-white py-6 mt-12">
        <div className="container mx-auto text-center px-4">
          <p className="mb-2">Rick and Morty Character Explorer</p>
          <div className="text-sm text-gray-400">Data provided by Rick and Morty API</div>
          <div className="mt-4 text-green-400 font-mono text-sm">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </footer>
    </div>
  );
}