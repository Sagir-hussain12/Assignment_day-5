import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function CharacterGallery() {
  const [characters, setCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://rickandmortyapi.com/api/character?page=${currentPage}`
        );
        const data = await response.json();
        setCharacters(data.results);
        setFilteredCharacters(data.results);
        setTotalPages(data.info.pages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching characters:', error);
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCharacters(characters);
    } else {
      const filtered = characters.filter(character => 
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCharacters(filtered);
    }
  }, [searchTerm, characters]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
      setSelectedCharacter(null);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
      setSelectedCharacter(null);
    }
  };

  const viewCharacter = (character) => {
    setSelectedCharacter(character);
    window.scrollTo(0, 0);
  };

  const closeCharacterDetail = () => {
    setSelectedCharacter(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Alive': return 'bg-green-500';
      case 'Dead': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-900 text-white">
        <Loader2 className="h-12 w-12 animate-spin text-green-400 mb-4" />
        <p className="text-lg font-medium">Loading characters from the multiverse...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold text-center mb-6">Rick and Morty Universe</h1>
          
          <div className="max-w-md mx-auto relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search characters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 bg-opacity-90 backdrop-blur-sm border border-green-400 border-opacity-50 rounded-full py-3 px-5 pl-12 text-green-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-green-400" />
      </div>
    </div>
        </div>
      </div>

      <main className="container mx-auto py-12 px-4">
        {selectedCharacter ? (
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={closeCharacterDetail}
              className="flex items-center mb-6 text-green-400 hover:text-green-300 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Gallery
            </button>
            
            <div className="bg-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h2 className="text-3xl font-bold mb-4">{selectedCharacter.name}</h2>
                  
                  <div className="flex items-center mb-6">
                    <span className={`inline-block w-4 h-4 rounded-full mr-2 ${getStatusColor(selectedCharacter.status)}`}></span>
                    <span className="text-lg">{selectedCharacter.status} - {selectedCharacter.species}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-green-400 text-sm font-semibold uppercase tracking-wider mb-1">Gender</h3>
                      <p className="text-lg">{selectedCharacter.gender}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-green-400 text-sm font-semibold uppercase tracking-wider mb-1">Origin</h3>
                      <p className="text-lg">{selectedCharacter.origin.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-green-400 text-sm font-semibold uppercase tracking-wider mb-1">Last Known Location</h3>
                      <p className="text-lg">{selectedCharacter.location.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-green-400 text-sm font-semibold uppercase tracking-wider mb-1">First Seen</h3>
                      <p className="text-lg">{new Date(selectedCharacter.created).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {filteredCharacters.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl">No characters found matching "{searchTerm}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCharacters.map((character) => (
                  <div 
                    key={character.id}
                    onClick={() => viewCharacter(character)}
                    className="group bg-slate-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
                  >
                    <div className="relative">
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h2 className="text-xl font-bold">{character.name}</h2>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(character.status)}`}></span>
                          <span className="text-gray-300">{character.status}</span>
                        </div>
                        <span className="text-gray-300">{character.species}</span>
                      </div>
                      <div className="text-sm text-gray-400">Last seen at:</div>
                      <div className="text-gray-300 truncate">{character.location.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } transition-colors`}
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Previous
              </button>
              
              <div className="px-4 py-2 bg-slate-800 rounded-lg">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } transition-colors`}
              >
                Next
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="bg-slate-800 text-white py-6">
        <div className="container mx-auto text-center">
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