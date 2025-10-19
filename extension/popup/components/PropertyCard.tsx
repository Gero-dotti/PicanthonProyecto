interface PropertyCardProps {
  source: string;
  url: string;
  title: string;
  price_usd?: number;
  location_area?: string;
  bedrooms?: number;
  bathrooms?: number;
  covered_m2?: number;
  score: number;
  reasons: string[];
  onAddToWishlist: (url: string) => void;
}

export function PropertyCard({
  source,
  url,
  title,
  price_usd,
  location_area,
  bedrooms,
  bathrooms,
  covered_m2,
  onAddToWishlist
}: PropertyCardProps) {

  const getSourceBadge = (source: string) => {
    const badges: Record<string, { name: string }> = {
      ml: { name: 'ML' },
      infocasas: { name: 'IC' },
      veocasas: { name: 'VC' }
    };
    const badge = badges[source] || badges.ml;
    return (
      <div className="bg-blue-500 px-2.5 py-1 rounded-lg backdrop-blur-md font-bold text-xs text-white shadow-lg">
        {badge.name}
      </div>
    );
  };

  const handleClick = async () => {
    // Open link in a new tab
    chrome.tabs.create({ url });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist(url);
  };

  return (
    <div
      className="glass-card rounded-2xl p-4 cursor-pointer hover-lift group"
      onClick={handleClick}
    >
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          {getSourceBadge(source)}
          {location_area && (
            <div className="glass px-2 py-0.5 rounded-lg flex items-center gap-1">
              <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-gray-600 font-medium">{location_area}</span>
            </div>
          )}
        </div>
        <h4 className="text-base font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {title || 'Propiedad Disponible'}
        </h4>
      </div>

      {/* Specs */}
      <div className="flex items-center gap-3 mb-3">
        {bedrooms !== undefined && bedrooms !== null && (
          <div className="glass px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs text-gray-700 font-medium">{bedrooms}</span>
          </div>
        )}
        {bathrooms !== undefined && bathrooms !== null && (
          <div className="glass px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-700 font-medium">{bathrooms}</span>
          </div>
        )}
        {covered_m2 !== undefined && covered_m2 !== null && (
          <div className="glass px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span className="text-xs text-gray-700 font-medium">{covered_m2}m²</span>
          </div>
        )}
      </div>

      {/* Price */}
      {price_usd !== undefined && price_usd !== null && (
        <div className="glass-strong rounded-xl px-3 py-2 mb-3 inline-block">
          <p className="text-lg font-bold text-blue-600">
            USD {price_usd.toLocaleString('es-UY')}
          </p>
        </div>
      )}

      {/* View Property Button */}
      <button
        className="w-full rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 hover-lift transition-all bg-white text-gray-900 hover:bg-gray-50 border-2 border-gray-300 shadow-sm"
        onClick={handleClick}
      >
        <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Ver Propiedad Completa
      </button>

      {/* Wishlist Button - Secondary */}
      <button
        className="w-full rounded-xl px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 hover-lift mt-2 transition-all bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
        onClick={handleWishlistClick}
      >
        <svg className="w-3 h-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        Guardar
      </button>
    </div>
  );
}
