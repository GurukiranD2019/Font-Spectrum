import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Type, Download, Heart, Copy, Check } from 'lucide-react';
import './App.css';

// Comprehensive font list with categories and descriptions
const FONTS = [
  // Serif Fonts
  { name: 'Playfair Display', category: 'Serif', description: 'Elegant display serif for headings', family: "'Playfair Display', serif" },
  { name: 'Times New Roman', category: 'Serif', description: 'Classic serif for documents', family: "'Times New Roman', serif" },
  { name: 'Georgia', category: 'Serif', description: 'Web-friendly serif font', family: "Georgia, serif" },
  { name: 'Baskerville', category: 'Serif', description: 'Traditional transitional serif', family: "Baskerville, serif" },
  { name: 'Garamond', category: 'Serif', description: 'Old-style serif typeface', family: "Garamond, serif" },
  
  // Sans-Serif Fonts
  { name: 'Inter', category: 'Sans-Serif', description: 'Modern UI font designed for screens', family: "'Inter', sans-serif" },
  { name: 'Roboto', category: 'Sans-Serif', description: 'Google\'s signature Android font', family: "'Roboto', sans-serif" },
  { name: 'Open Sans', category: 'Sans-Serif', description: 'Friendly and readable humanist font', family: "'Open Sans', sans-serif" },
  { name: 'Lato', category: 'Sans-Serif', description: 'Semi-rounded details humanist font', family: "'Lato', sans-serif" },
  { name: 'Montserrat', category: 'Sans-Serif', description: 'Urban typography inspired by Buenos Aires', family: "'Montserrat', sans-serif" },
  { name: 'Poppins', category: 'Sans-Serif', description: 'Geometric sans-serif with rounded forms', family: "'Poppins', sans-serif" },
  { name: 'Source Sans Pro', category: 'Sans-Serif', description: 'Clean and simple professional font', family: "'Source Sans Pro', sans-serif" },
  { name: 'Raleway', category: 'Sans-Serif', description: 'Elegant sans-serif family', family: "'Raleway', sans-serif" },
  { name: 'Helvetica', category: 'Sans-Serif', description: 'Swiss design classic', family: "Helvetica, sans-serif" },
  { name: 'Arial', category: 'Sans-Serif', description: 'Widely used web-safe font', family: "Arial, sans-serif" },
  
  // Monospace Fonts
  { name: 'Fira Code', category: 'Monospace', description: 'Programming font with ligatures', family: "'Fira Code', monospace" },
  { name: 'Monaco', category: 'Monospace', description: 'Apple\'s monospace font', family: "Monaco, monospace" },
  { name: 'Consolas', category: 'Monospace', description: 'Microsoft\'s coding font', family: "Consolas, monospace" },
  { name: 'Courier New', category: 'Monospace', description: 'Classic typewriter font', family: "'Courier New', monospace" },
  { name: 'Source Code Pro', category: 'Monospace', description: 'Adobe\'s programming font', family: "'Source Code Pro', monospace" },
  
  // Display Fonts
  { name: 'Oswald', category: 'Display', description: 'Bold condensed display font', family: "'Oswald', sans-serif" },
  { name: 'Impact', category: 'Display', description: 'Strong display typeface', family: "Impact, sans-serif" },
  { name: 'Bebas Neue', category: 'Display', description: 'All caps display font', family: "'Bebas Neue', sans-serif" },
  
  // Script Fonts
  { name: 'Brush Script MT', category: 'Script', description: 'Casual brush script', family: "'Brush Script MT', cursive" },
  { name: 'Pacifico', category: 'Script', description: 'Fun casual script font', family: "'Pacifico', cursive" },
  { name: 'Dancing Script', category: 'Script', description: 'Lively casual script', family: "'Dancing Script', cursive" },
];

const FontItem = ({ font, isSelected, onClick, searchTerm }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const sampleText = "The quick brown fox jumps over the lazy dog";

  const highlightText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    return text.split(regex).map((part, index) => 
      regex.test(part) ? <span key={index} className="highlight">{part}</span> : part
    );
  };

  const handleCopyFontName = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(font.name);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <div 
      className={`font-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="font-header">
        <div className="font-info">
          <h3 className="font-name">{highlightText(font.name, searchTerm)}</h3>
          <span className="font-category">{font.category}</span>
        </div>
        <div className="font-actions">
          <button 
            className={`action-btn ${isFavorited ? 'favorited' : ''}`}
            onClick={handleFavorite}
            title="Add to favorites"
          >
            <Heart size={16} />
          </button>
          <button 
            className="action-btn"
            onClick={handleCopyFontName}
            title="Copy font name"
          >
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>
      
      <p className="font-description">{font.description}</p>
      
      <div className="font-preview" style={{ fontFamily: font.family }}>
        {sampleText}
      </div>
      
      <div className="font-sizes">
        <div className="size-demo" style={{ fontFamily: font.family, fontSize: '24px' }}>
          Aa
        </div>
        <div className="size-demo" style={{ fontFamily: font.family, fontSize: '18px' }}>
          Typography
        </div>
        <div className="size-demo" style={{ fontFamily: font.family, fontSize: '14px' }}>
          Sample Text
        </div>
      </div>
    </div>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const searchInputRef = useRef(null);

  const categories = ['All', ...new Set(FONTS.map(font => font.category))];

  const filteredFonts = useMemo(() => {
    return FONTS.filter(font => {
      const matchesSearch = font.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           font.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || font.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && e.metaKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Type className="logo-icon" />
            <h1>Font Spectrum</h1>
          </div>
          <p className="tagline">Discover fonts from around the world</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Search and Filters */}
        <div className="controls">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search fonts... (⌘ + / to focus)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Font Grid */}
        <div className="content-grid">
          {/* Font List */}
          <div className="font-list">
            <div className="list-header">
              <h2>Fonts ({filteredFonts.length})</h2>
            </div>
            <div className="font-scroll-container">
              {filteredFonts.length > 0 ? (
                filteredFonts.map((font) => (
                  <FontItem
                    key={font.name}
                    font={font}
                    isSelected={selectedFont.name === font.name}
                    onClick={() => setSelectedFont(font)}
                    searchTerm={searchTerm}
                  />
                ))
              ) : (
                <div className="no-results">
                  <Type size={48} />
                  <h3>No fonts found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>

          {/* Font Detail Panel */}
          <div className="font-detail">
            <div className="detail-header">
              <h2>{selectedFont.name}</h2>
              <span className="detail-category">{selectedFont.category}</span>
            </div>
            
            <div className="detail-content" style={{ fontFamily: selectedFont.family }}>
              <div className="preview-section">
                <h3>Preview</h3>
                <div className="large-preview">
                  The Quick Brown Fox Jumps Over The Lazy Dog
                </div>
              </div>
              
              <div className="alphabet-section">
                <h3>Character Set</h3>
                <div className="alphabet">
                  <div className="alphabet-line">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
                  <div className="alphabet-line">abcdefghijklmnopqrstuvwxyz</div>
                  <div className="alphabet-line">1234567890!@#$%^&*()</div>
                </div>
              </div>
              
              <div className="size-variations">
                <h3>Size Variations</h3>
                <div className="size-examples">
                  <div style={{ fontSize: '48px' }}>Display</div>
                  <div style={{ fontSize: '32px' }}>Heading</div>
                  <div style={{ fontSize: '18px' }}>Body Text</div>
                  <div style={{ fontSize: '14px' }}>Caption</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
