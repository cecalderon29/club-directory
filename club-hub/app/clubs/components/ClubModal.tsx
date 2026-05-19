import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  BellRing,
  Mail, 
  DollarSign, 
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Heart
} from 'lucide-react';
import { Club } from '../../data/clubs';

interface ClubModalProps {
  club: Club;
  currentImageIndex: number;
  favorites: number[];
  onClose: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onNextImage: (e: React.MouseEvent) => void;
  onPrevImage: (e: React.MouseEvent) => void;
  onImageIndexChange: (index: number) => void;
}

const InstagramLogo = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9Zm9.9 1.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
  </svg>
);

const FacebookLogo = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V9c0-.9.2-1.5 1.5-1.5h1.7V4.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.4v1.8H7.5V14H10v8h3.5Z" />
  </svg>
);

const TwitterLogo = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.9 2H22l-6.7 7.7L23 22h-6l-4.7-6-5.3 6H4l7.1-8.1L1 2h6.2l4.2 5.4L18.9 2Zm-1 18h1.7L6.4 3.9H4.6L17.9 20Z" />
  </svg>
);

const ClubModalComponent = ({ 
  club, 
  currentImageIndex, 
  favorites,
  onClose, 
  onToggleFavorite,
  onNextImage,
  onPrevImage,
  onImageIndexChange
}: ClubModalProps) => {
  const isFavorite = favorites.includes(club.id);
  const normalizeHandle = (value: string) => value.replace(/^@/, '').trim();
  const instagramUrl = club.socials?.instagram ? `https://instagram.com/${normalizeHandle(club.socials.instagram)}` : null;
  const twitterUrl = club.socials?.twitter ? `https://twitter.com/${normalizeHandle(club.socials.twitter)}` : null;
  const facebookUrl = club.socials?.facebook ? `https://facebook.com/${normalizeHandle(club.socials.facebook)}` : null;
  const remindUrl = club.socials?.remind ? `https://www.remind.com/join/${normalizeHandle(club.socials.remind)}` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col rounded-[2rem] shadow-2xl transform transition-all scale-100 bg-[var(--surface-strong)] text-[var(--text-primary)] border border-[var(--border)]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-black/40 hover:bg-black/60 text-white backdrop-blur-md rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="modal-scrollbar max-h-[95vh] overflow-y-auto p-8 sm:p-10">
          {/* Modal Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">{club.name}</h2>
              <button 
                onClick={onToggleFavorite}
                className="p-2 rounded-full hover:bg-[var(--hover-surface)] transition-colors"
              >
                <Heart 
                  size={32} 
                  className={`transition-colors ${isFavorite ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} 
                />
              </button>
            </div>
            <div className="flex gap-3">
              <span className="px-5 py-2 text-sm font-black uppercase rounded-full tracking-wider inline-block bg-[var(--accent-soft)] text-[var(--accent)]">
                {club.category}
              </span>
              <span className="px-5 py-2 text-sm font-black uppercase rounded-full tracking-wider inline-block bg-[var(--surface-soft)] text-[var(--text-secondary)]">
                Social
              </span>
            </div>
          </div>

          {/* Photo Carousel */}
          <div className="relative mb-10 rounded-3xl overflow-hidden aspect-video bg-[var(--surface-soft)] shadow-inner group border border-[var(--border)]">
            {club.images && club.images.length > 0 ? (
              <>
                <img 
                  src={club.images[currentImageIndex]} 
                  alt={club.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                
                {club.images.length > 1 && (
                  <>
                    <button onClick={onPrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronLeft size={24} />
                    </button>
                    <button onClick={onNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronRight size={24} />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/20 backdrop-blur-sm rounded-full">
                      {club.images.map((_, i: number) => (
                        <div 
                          key={i} 
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                          onClick={() => onImageIndexChange(i)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">No photos available</div>
            )}
          </div>
          
          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column (Description & Events) */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-3">About Us</h3>
                <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                  {club.description}
                </p>
              </div>
              
              {club.events && club.events.length > 0 && (
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                    <CalendarDays size={20} className="text-[var(--accent)]" /> 
                    Upcoming Events
                  </h3>
                  <div className="space-y-3">
                    {club.events.map((evt: { name: string; date: string }, i: number) => (
                      <div key={i} className="flex justify-between items-center p-4 rounded-2xl border bg-[var(--surface-soft)] border-[var(--border)]">
                        <span className="font-bold">{evt.name}</span>
                        <span className="text-xs font-black text-[var(--accent)] uppercase tracking-widest">{evt.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (Logistics, Socials, Sponsor) */}
            <div className="space-y-6">
              {/* Logistics Box */}
              <div className="p-6 rounded-3xl space-y-5 border bg-[var(--surface-soft)] border-[var(--border)]">
                <div className="flex items-start gap-4">
                  <Clock size={20} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">Meets On</div>
                    <div className="font-bold text-sm">{club.day}</div>
                    <div className="font-medium text-sm text-[var(--text-secondary)]">{club.time}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">Room</div>
                    <div className="font-bold text-sm">{club.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <DollarSign size={20} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">Club Dues</div>
                    <div className="font-bold text-sm">{club.dues}</div>
                  </div>
                </div>
              </div>

              {/* Connect / Socials */}
              {club.socials && (
                <div className="p-6 rounded-3xl border bg-[var(--surface)] border-[var(--border)] shadow-sm">
                  <div className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mb-3">Connect With Us</div>
                  <div className="flex flex-wrap gap-3">
                    {instagramUrl && (
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl transition-all bg-pink-100 text-pink-600 hover:bg-pink-200"
                        title="Instagram"
                        aria-label="Open Instagram"
                      >
                        <InstagramLogo size={18} />
                      </a>
                    )}
                    {twitterUrl && (
                      <a
                        href={twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl transition-all bg-sky-100 text-sky-600 hover:bg-sky-200"
                        title="Twitter"
                        aria-label="Open Twitter"
                      >
                        <TwitterLogo size={18} />
                      </a>
                    )}
                    {facebookUrl && (
                      <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl transition-all bg-blue-100 text-blue-800 hover:bg-blue-200"
                        title="Facebook"
                        aria-label="Open Facebook"
                      >
                        <FacebookLogo size={18} />
                      </a>
                    )}
                    {remindUrl && (
                      <a
                        href={remindUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs transition-all bg-blue-100 text-blue-700 hover:bg-blue-200"
                        title="Remind"
                        aria-label="Open Remind"
                      >
                        <BellRing size={16} /> {club.socials.remind}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Sponsor */}
              {club.sponsor && (
                <div className="p-6 rounded-3xl border bg-[var(--surface)] border-[var(--border)] shadow-sm">
                  <div className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mb-2">Club Sponsor</div>
                  <div className="font-bold text-sm mb-1">{club.sponsor.name}</div>
                  <a href={`mailto:${club.sponsor.email}`} className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] hover:underline">
                    <Mail size={14} /> Email Sponsor
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export const ClubModal = React.memo(ClubModalComponent);
