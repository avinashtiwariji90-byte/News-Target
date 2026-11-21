'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, Check, ChevronRight } from 'lucide-react';

export interface StateOption {
  id: string;
  name: string;
  nameHi: string;
  category: 'mp' | 'all-india';
  keywords: string[];
}

export const ALL_STATES_AND_DISTRICTS: StateOption[] = [
  // MP Special - All MP
  { id: 'all-mp', name: 'All Madhya Pradesh', nameHi: 'पूरा मध्य प्रदेश (All MP)', category: 'mp', keywords: ['madhya pradesh', 'mp'] },

  // Madhya Pradesh Key Districts
  { id: 'bhopal', name: 'Bhopal', nameHi: 'भोपाल', category: 'mp', keywords: ['bhopal', 'भोपाल', 'भोजताल', 'बड़ा तालाब'] },
  { id: 'indore', name: 'Indore', nameHi: 'इंदौर', category: 'mp', keywords: ['indore', 'इंदौर', 'स्वच्छ', 'राजवाड़ा'] },
  { id: 'gwalior', name: 'Gwalior', nameHi: 'ग्वालियर', category: 'mp', keywords: ['gwalior', 'ग्वालियर', 'चंबल', 'सिंधिया'] },
  { id: 'jabalpur', name: 'Jabalpur', nameHi: 'जबलपुर', category: 'mp', keywords: ['jabalpur', 'जबलपुर', 'भेड़ाघाट', 'नर्मदा'] },
  { id: 'ujjain', name: 'Ujjain', nameHi: 'उज्जैन', category: 'mp', keywords: ['ujjain', 'उज्जैन', 'महाकाल', 'महालोक'] },
  { id: 'rewa', name: 'Rewa', nameHi: 'रीवा', category: 'mp', keywords: ['rewa', 'रीवा', 'ओंकारेश्वर', 'सोलर'] },
  { id: 'sagar', name: 'Sagar', nameHi: 'सागर', category: 'mp', keywords: ['sagar', 'सागर', 'बुंदेलखंड'] },
  { id: 'satna', name: 'Satna', nameHi: 'सतना', category: 'mp', keywords: ['satna', 'सतना', 'मैहर'] },
  { id: 'ratlam', name: 'Ratlam', nameHi: 'रतलाम', category: 'mp', keywords: ['ratlam', 'रतलाम', 'मालवा'] },
  { id: 'chhindwara', name: 'Chhindwara', nameHi: 'छिंदवाड़ा', category: 'mp', keywords: ['chhindwara', 'छिंदवाड़ा'] },
  { id: 'vidisha', name: 'Vidisha', nameHi: 'विदिशा', category: 'mp', keywords: ['vidisha', 'विदिशा', 'सांची'] },
  { id: 'sehore', name: 'Sehore', nameHi: 'सीहोर', category: 'mp', keywords: ['sehore', 'सीहोर', 'बुधनी'] },
  { id: 'khargone', name: 'Khargone', nameHi: 'खरगोन', category: 'mp', keywords: ['khargone', 'खरगोन', 'महेश्वर'] },
  { id: 'khandwa', name: 'Khandwa', nameHi: 'खंडवा', category: 'mp', keywords: ['khandwa', 'खंडवा', 'ओंकारेश्वर'] },
  { id: 'dhar', name: 'Dhar', nameHi: 'धार (मांडू)', category: 'mp', keywords: ['dhar', 'धार', 'मांडू'] },
  { id: 'dewas', name: 'Dewas', nameHi: 'देवास', category: 'mp', keywords: ['dewas', 'देवास'] },
  { id: 'mandsaur', name: 'Mandsaur', nameHi: 'मंदसौर', category: 'mp', keywords: ['mandsaur', 'मंदसौर'] },
  { id: 'neemuch', name: 'Neemuch', nameHi: 'नीमच', category: 'mp', keywords: ['neemuch', 'नीमच'] },
  { id: 'morena', name: 'Morena', nameHi: 'मुरैना', category: 'mp', keywords: ['morena', 'मुरैना'] },
  { id: 'bhind', name: 'Bhind', nameHi: 'भिंड', category: 'mp', keywords: ['bhind', 'भिंड'] },
  { id: 'shivpuri', name: 'Shivpuri', nameHi: 'शिवपुरी', category: 'mp', keywords: ['shivpuri', 'शिवपुरी'] },
  { id: 'guna', name: 'Guna', nameHi: 'गुना', category: 'mp', keywords: ['guna', 'गुना'] },
  { id: 'datia', name: 'Datia', nameHi: 'दतिया (पीताम्बरा)', category: 'mp', keywords: ['datia', 'दतिया'] },
  { id: 'damoh', name: 'Damoh', nameHi: 'दमोह', category: 'mp', keywords: ['damoh', 'दमोह'] },
  { id: 'chhatarpur', name: 'Chhatarpur', nameHi: 'छतरपुर (खजुराहो)', category: 'mp', keywords: ['chhatarpur', 'छतरपुर', 'खजुराहो'] },
  { id: 'panna', name: 'Panna', nameHi: 'पन्ना', category: 'mp', keywords: ['panna', 'पन्ना'] },
  { id: 'singrauli', name: 'Singrauli', nameHi: 'सिंगरौली', category: 'mp', keywords: ['singrauli', 'सिंगरौली'] },
  { id: 'shahdol', name: 'Shahdol', nameHi: 'शहडोल', category: 'mp', keywords: ['shahdol', 'शहडोल'] },
  { id: 'katni', name: 'Katni', nameHi: 'कटनी', category: 'mp', keywords: ['katni', 'कटनी'] },
  { id: 'balaghat', name: 'Balaghat', nameHi: 'बालाघाट', category: 'mp', keywords: ['balaghat', 'बालाघाट'] },
  { id: 'hoshangabad', name: 'Narmadapuram', nameHi: 'नर्मदापुरम (होशंगाबाद)', category: 'mp', keywords: ['narmadapuram', 'hoshangabad', 'होशंगाबाद', 'पचमढ़ी'] },
  { id: 'betul', name: 'Betul', nameHi: 'बैतूल', category: 'mp', keywords: ['betul', 'बैतूल'] },

  // All Major States of India
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश (UP)', category: 'all-india', keywords: ['uttar pradesh', 'up', 'लखनऊ', 'नोएडा', 'जेवर', 'अयोध्या', 'वाराणसी'] },
  { id: 'rajasthan', name: 'Rajasthan', nameHi: 'राजस्थान', category: 'all-india', keywords: ['rajasthan', 'राजस्थान', 'जयपुर', 'जैसलमेर', 'जोधपुर'] },
  { id: 'bihar', name: 'Bihar', nameHi: 'बिहार', category: 'all-india', keywords: ['bihar', 'बिहार', 'पटना', 'बोधगया', 'नालंदा'] },
  { id: 'delhi', name: 'Delhi NCR', nameHi: 'दिल्ली NCR', category: 'all-india', keywords: ['delhi', 'ncr', 'दिल्ली', 'राजधानी'] },
  { id: 'maharashtra', name: 'Maharashtra', nameHi: 'महाराष्ट्र', category: 'all-india', keywords: ['maharashtra', 'महाराष्ट्र', 'मुंबई', 'नवी मुंबई', 'पुणे'] },
  { id: 'gujarat', name: 'Gujarat', nameHi: 'गुजरात', category: 'all-india', keywords: ['gujarat', 'गुजरात', 'अहमदाबाद', 'सूरत', 'गांधीनगर'] },
  { id: 'chhattisgarh', name: 'Chhattisgarh', nameHi: 'छत्तीसगढ़', category: 'all-india', keywords: ['chhattisgarh', 'छत्तीसगढ़', 'रायपुर', 'बिलासपुर'] },
  { id: 'haryana', name: 'Haryana', nameHi: 'हरियाणा', category: 'all-india', keywords: ['haryana', 'हरियाणा', 'गुरुग्राम', 'फरीदाबाद'] },
  { id: 'punjab', name: 'Punjab', nameHi: 'पंजाब', category: 'all-india', keywords: ['punjab', 'पंजाब', 'अमृतसर', 'लुधियाना'] },
  { id: 'uttarakhand', name: 'Uttarakhand', nameHi: 'उत्तराखंड', category: 'all-india', keywords: ['uttarakhand', 'उत्तराखंड', 'देहरादून', 'हरिद्वार'] },
  { id: 'himachal', name: 'Himachal Pradesh', nameHi: 'हिमाचल प्रदेश', category: 'all-india', keywords: ['himachal', 'हिमाचल', 'शिमला', 'मनाली'] },
  { id: 'jharkhand', name: 'Jharkhand', nameHi: 'झारखंड', category: 'all-india', keywords: ['jharkhand', 'झारखंड', 'रांची', 'जमशेदपुर'] },
  { id: 'west-bengal', name: 'West Bengal', nameHi: 'पश्चिम बंगाल', category: 'all-india', keywords: ['bengal', 'कोलकाता', 'बंगाल'] }
];

interface StateDropdownListProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStateId: string;
  onSelectState: (state: StateOption) => void;
  articleCounts?: Record<string, number>;
}

export default function StateDropdownList({
  isOpen,
  onClose,
  selectedStateId,
  onSelectState,
  articleCounts = {}
}: StateDropdownListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'mp' | 'all-india'>('all');

  const filteredItems = useMemo(() => {
    let items = ALL_STATES_AND_DISTRICTS;
    if (activeTab === 'mp') {
      items = items.filter(i => i.category === 'mp');
    } else if (activeTab === 'all-india') {
      items = items.filter(i => i.category === 'all-india');
    }

    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase().trim();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.nameHi.toLowerCase().includes(query)
    );
  }, [activeTab, searchQuery]);

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop to dismiss when clicking anywhere outside */}
      <div 
        className="fixed inset-0 z-40 bg-transparent"
        onClick={onClose}
      />

      {/* Floating Dropdown Menu Card */}
      <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col max-h-[460px] animate-in fade-in slide-in-from-top-2 duration-150">
        
        {/* Header with Title & Filter Input */}
        <div className="p-3 bg-slate-900 text-white space-y-2 shrink-0 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              राज्य / शहर चुनें (Select State or City)
            </span>
            <span className="text-[10px] text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded">
              {filteredItems.length} उपलब्ध
            </span>
          </div>

          {/* Quick Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="राज्य या जिले का नाम लिखें (उदा. इंदौर, UP)..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-800 text-white placeholder-slate-400 text-xs rounded-lg border border-slate-700 focus:outline-hidden focus:border-red-500"
              autoFocus
            />
          </div>

          {/* Category Tabs */}
          <div className="grid grid-cols-3 gap-1 pt-0.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`py-1 rounded text-center transition ${
                activeTab === 'all'
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              सभी (All)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mp')}
              className={`py-1 rounded text-center transition ${
                activeTab === 'mp'
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              मध्य प्रदेश
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('all-india')}
              className={`py-1 rounded text-center transition ${
                activeTab === 'all-india'
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              अन्य राज्य
            </button>
          </div>
        </div>

        {/* Scrollable List of States and Cities */}
        <div className="overflow-y-auto divide-y divide-slate-100 flex-1 overscroll-contain">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              कोई राज्य या जिला नहीं मिला।
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSelected = selectedStateId === item.id;
              const count = articleCounts[item.id] || 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectState(item);
                    onClose();
                  }}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-xs transition group ${
                    isSelected
                      ? 'bg-red-50/80 text-red-700 font-bold'
                      : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-red-600' : 'bg-slate-300 group-hover:bg-red-400'} transition`} />
                    <span className="font-medium text-slate-800 group-hover:text-red-600">
                      {item.nameHi}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({item.name})
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {count} खबरें
                      </span>
                    )}
                    {isSelected && <Check className="w-3.5 h-3.5 text-red-600" />}
                    {!isSelected && <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-2 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-500 font-medium">
          किसी भी राज्य/जिले पर क्लिक करें — तुरंत ताज़ा खबरें लोड होंगी
        </div>
      </div>
    </>
  );
}

