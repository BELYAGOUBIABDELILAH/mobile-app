import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const APP_URL = 'https://id-preview--8d2e14ae-9780-495c-92ff-a09ea8668d86.lovable.app';

interface EmergencyCard {
  blood_group: string | null;
  allergies: string[] | null;
  chronic_conditions: string[] | null;
  current_medications: string[] | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
}

export function Popup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [bloodGroup, setBloodGroup] = useState<string | null>(null);
  const [emergencyCard, setEmergencyCard] = useState<EmergencyCard | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchEmergencyCard(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchEmergencyCard(session.user.id);
    });

    chrome.storage.local.get(['bloodGroup'], (result) => {
      if (result.bloodGroup) setBloodGroup(result.bloodGroup);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchEmergencyCard(userId: string) {
    const { data } = await supabase
      .from('emergency_health_cards')
      .select('blood_group, allergies, chronic_conditions, current_medications, emergency_contact_name, emergency_contact_phone')
      .eq('user_id', userId)
      .maybeSingle();

    if (data) {
      setEmergencyCard(data as EmergencyCard);
      setBloodGroup(data.blood_group || null);
      chrome.storage.local.set({ bloodGroup: data.blood_group, userId });
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setBloodGroup(null);
    setEmergencyCard(null);
    chrome.storage.local.remove(['bloodGroup', 'userId']);
  }

  function openSearch() {
    const q = encodeURIComponent(searchQuery);
    chrome.tabs.create({ url: `${APP_URL}/recherche${q ? `?q=${q}` : ''}` });
  }

  function openTriage() {
    chrome.tabs.create({ url: `${APP_URL}/assistant-medical` });
  }

  function openOptions() {
    chrome.runtime.openOptionsPage();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px] w-[350px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
      </div>
    );
  }

  // --- Login screen ---
  if (!user) {
    return (
      <div className="w-[350px] min-h-[500px] flex flex-col bg-white">
        <header className="bg-sky-500 text-white px-4 py-5 text-center">
          <h1 className="text-lg font-bold tracking-tight">🏥 CityHealth</h1>
          <p className="text-xs opacity-80 mt-1">Companion Extension</p>
        </header>

        <form onSubmit={handleLogin} className="flex-1 flex flex-col gap-3 p-5">
          <h2 className="text-sm font-semibold text-gray-700">Connexion</h2>

          {authError && (
            <p className="text-xs text-red-500 bg-red-50 rounded p-2">{authError}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <button
            type="submit"
            className="bg-sky-500 text-white rounded-md py-2 text-sm font-medium hover:bg-sky-600 transition-colors"
          >
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  // --- Main screen ---
  return (
    <div className="w-[350px] min-h-[500px] flex flex-col bg-white">
      <header className="bg-sky-500 text-white px-4 py-3 flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-base font-bold">🏥 CityHealth</h1>
          <p className="text-[11px] opacity-75 truncate max-w-[180px]">{user.email}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={openOptions}
            title="Préférences"
            className="p-1.5 rounded hover:bg-white/20 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button
            onClick={handleLogout}
            className="text-[11px] bg-white/20 hover:bg-white/30 rounded px-2 py-1 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-3 p-4 overflow-y-auto">
        {/* Emergency card toggle */}
        <button
          onClick={() => setShowCard(!showCard)}
          className="w-full bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between hover:bg-red-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🩸</span>
            <div className="text-left">
              <p className="text-[11px] text-gray-500">Groupe Sanguin</p>
              <p className="text-base font-bold text-red-600">
                {bloodGroup || '—'}
                <span className="text-[10px] font-normal text-gray-400 ml-1">(Synchronisé)</span>
              </p>
            </div>
          </div>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform ${showCard ? 'rotate-180' : ''}`}
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        {/* Emergency card details */}
        {showCard && emergencyCard && (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 text-sm shadow-sm">
            <CardRow emoji="💊" label="Allergies" items={emergencyCard.allergies} />
            <CardRow emoji="🩺" label="Conditions chroniques" items={emergencyCard.chronic_conditions} />
            <CardRow emoji="💉" label="Médicaments actuels" items={emergencyCard.current_medications} />
            {(emergencyCard.emergency_contact_name || emergencyCard.emergency_contact_phone) && (
              <div className="px-3 py-2.5">
                <p className="text-[11px] text-gray-400 mb-0.5">📞 Contact d'urgence</p>
                <p className="text-xs font-medium text-gray-700">
                  {emergencyCard.emergency_contact_name || '—'}
                  {emergencyCard.emergency_contact_phone && (
                    <span className="text-gray-400 ml-1">· {emergencyCard.emergency_contact_phone}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {showCard && !emergencyCard && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-700 text-center">
            Aucune carte d'urgence trouvée. Créez-en une sur CityHealth.
          </div>
        )}

        {/* Search */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            🔍 Trouver un professionnel
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cardiologue, pharmacie…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && openSearch()}
              className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button
              onClick={openSearch}
              className="bg-sky-500 text-white rounded-md px-3 text-sm font-medium hover:bg-sky-600 transition-colors"
            >
              Go
            </button>
          </div>
        </div>

        {/* Triage button */}
        <button
          onClick={openTriage}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg py-3 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
        >
          🤖 Assistant Triage IA
        </button>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={() => chrome.tabs.create({ url: `${APP_URL}/don-de-sang` })}
            className="bg-gray-100 text-gray-500 rounded-md py-2 text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            🩸 Don de sang
          </button>
          <button
            onClick={() => chrome.tabs.create({ url: `${APP_URL}/urgences` })}
            className="bg-gray-100 text-gray-500 rounded-md py-2 text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            🚨 Urgences
          </button>
        </div>
      </div>
    </div>
  );
}

function CardRow({ emoji, label, items }: { emoji: string; label: string; items: string[] | null }) {
  const list = items?.filter(Boolean) || [];
  return (
    <div className="px-3 py-2.5">
      <p className="text-[11px] text-gray-400 mb-0.5">{emoji} {label}</p>
      {list.length > 0 ? (
        <div className="flex flex-wrap gap-1 mt-1">
          {list.map((item, i) => (
            <span key={i} className="bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-full">{item}</span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-300 italic">Aucun</p>
      )}
    </div>
  );
}
