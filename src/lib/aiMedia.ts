export interface AiSuggestedMedia {
  url: string;
  caption: string;
  category: string;
  source: string;
}

const AI_NEWS_IMAGE_BANK: { keywords: string[]; images: AiSuggestedMedia[] }[] = [
  {
    keywords: ['metro', 'train', 'transit', 'rail', 'vande bharat', 'ट्रैन', 'मेट्रो'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
        caption: 'Modern high-speed metro train rakes undergoing technical testing.',
        category: 'Transit',
        source: 'AI News Media Bank / Metro Rail Corp'
      },
      {
        url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
        caption: 'Elevated urban transit corridor with state-of-the-art signaling infrastructure.',
        category: 'Infrastructure',
        source: 'AI News Media Bank'
      },
      {
        url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
        caption: 'Indian Railways electric express locomotive on newly electrified track.',
        category: 'Railways',
        source: 'AI News Media Bank'
      }
    ]
  },
  {
    keywords: ['vidhan sabha', 'assembly', 'cabinet', 'minister', 'cm', 'bjp', 'congress', 'chunav', 'election', 'विपक्ष', 'मंत्रिमंडल', 'कैबिनेट', 'विधानसभा', 'राजनीति'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=1200&q=80',
        caption: 'State Legislative Assembly hall during session and policy debate.',
        category: 'Politics',
        source: 'AI News Media Bank'
      },
      {
        url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
        caption: 'High-level ministerial cabinet briefing on administrative resolutions.',
        category: 'Governance',
        source: 'AI News Media Bank'
      },
      {
        url: 'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?auto=format&fit=crop&w=1200&q=80',
        caption: 'Government Secretariat building (Vallabh Bhawan) administrative headquarters.',
        category: 'State Govt',
        source: 'AI News Media Bank'
      }
    ]
  },
  {
    keywords: ['police', 'crime', 'arrest', 'court', 'high court', 'scam', 'investigation', 'थाना', 'पुलिस', 'कोर्ट', 'गिरफ्तार', 'अपराध'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
        caption: 'High Court bench gavel representing landmark judicial verdict and legal proceedings.',
        category: 'Judiciary',
        source: 'AI News Media Bank'
      },
      {
        url: 'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?auto=format&fit=crop&w=1200&q=80',
        caption: 'State Police patrol vehicle deployed during security check and law enforcement drive.',
        category: 'Police & Security',
        source: 'AI News Media Bank'
      }
    ]
  },
  {
    keywords: ['bhopal', 'lake', 'bhojtal', 'vip road', 'raja bhoj', 'भोपाल', 'बड़ा तालाब'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        caption: 'Picturesque view of Upper Lake (Bhojtal) and city waterfront in Bhopal.',
        category: 'Bhopal Local',
        source: 'AI News Media Bank'
      },
      {
        url: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Smart city intersection and arterial corridor in MP Nagar, Bhopal.',
        category: 'Bhopal Local',
        source: 'AI News Media Bank'
      }
    ]
  },
  {
    keywords: ['solar', 'energy', 'power', 'omkareshwar', 'green', 'renewable', 'ऊर्जा', 'सोलर'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
        caption: 'Mega floating solar panel array and clean energy generation facility.',
        category: 'Renewable Energy',
        source: 'AI News Media Bank'
      },
      {
        url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
        caption: 'High-voltage electric grid transmission towers delivering power.',
        category: 'Energy',
        source: 'AI News Media Bank'
      }
    ]
  },
  {
    keywords: ['business', 'rupee', 'bank', 'economy', 'market', 'share', 'budget', 'व्यापार', 'अर्थव्यवस्था', 'बजट', 'बैंक'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
        caption: 'Financial market exchange trends, currency indices and investment analytics.',
        category: 'Economy',
        source: 'AI News Media Bank'
      },
      {
        url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        caption: 'Industrial manufacturing plant and commerce trade operations.',
        category: 'Business',
        source: 'AI News Media Bank'
      }
    ]
  },
  {
    keywords: ['education', 'exam', 'school', 'college', 'university', 'student', 'result', 'परीक्षा', 'शिक्षा', 'छात्र', 'स्कूल', 'कॉलेज'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
        caption: 'Students in higher education campus participating in academic research and exams.',
        category: 'Education',
        source: 'AI News Media Bank'
      },
      {
        url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
        caption: 'Smart classroom digital learning initiative launched across state model schools.',
        category: 'Education',
        source: 'AI News Media Bank'
      }
    ]
  },
  {
    keywords: ['sports', 'cricket', 'hockey', 'match', 'medal', 'ipl', 'stadium', 'खेल', 'क्रिकेट', 'स्टेडियम', 'मैच'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1531415074868-036b107e7752?auto=format&fit=crop&w=1200&q=80',
        caption: 'Cricket match action under floodlights before cheering spectators.',
        category: 'Sports',
        source: 'AI News Media Bank'
      },
      {
        url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
        caption: 'Championship stadium grounds during national sports tournament.',
        category: 'Sports',
        source: 'AI News Media Bank'
      }
    ]
  },
  {
    keywords: ['health', 'hospital', 'doctor', 'aiims', 'medical', 'स्वास्थ्य', 'अस्पताल', 'डॉक्टर'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
        caption: 'Modern healthcare facility and super-specialty hospital infrastructure.',
        category: 'Health',
        source: 'AI News Media Bank'
      },
      {
        url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
        caption: 'Medical team conducting diagnostic consultations.',
        category: 'Healthcare',
        source: 'AI News Media Bank'
      }
    ]
  }
];

const DEFAULT_EDITORIAL_IMAGES: AiSuggestedMedia[] = [
  {
    url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    caption: 'News Target Central Editorial Bureau 24x7 verified news desk.',
    category: 'Breaking News',
    source: 'News Target Editorial Network'
  },
  {
    url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Special ground report and press conference coverage.',
    category: 'Top Headlines',
    source: 'News Target Special Dispatch'
  },
  {
    url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80',
    caption: 'National capital administrative corridor and policy briefing.',
    category: 'National Policy',
    source: 'News Target National Bureau'
  }
];

export function getAiSuggestedMediaList(title: string, category: string): AiSuggestedMedia[] {
  const query = `${title.toLowerCase()} ${category.toLowerCase()}`;
  const matched: AiSuggestedMedia[] = [];

  for (const group of AI_NEWS_IMAGE_BANK) {
    if (group.keywords.some(k => query.includes(k))) {
      matched.push(...group.images);
    }
  }

  if (matched.length === 0) {
    return DEFAULT_EDITORIAL_IMAGES;
  }

  // Combine with default images so admin always has multiple options to choose from
  return [...matched, ...DEFAULT_EDITORIAL_IMAGES];
}

