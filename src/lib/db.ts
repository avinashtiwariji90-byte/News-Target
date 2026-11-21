import { Article, ArticleStatus, AuditLog, BreakingNews, Category, ScheduledFeed, User } from './types';

// Pre-seeded Categories as per prompt requirements
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-all', name: 'All News', slug: 'all', description: 'Latest updates from all sectors', color: '#dc2626', order: 0, isVisible: true },
  { id: 'cat-mp', name: 'Madhya Pradesh', slug: 'madhya-pradesh', description: 'Comprehensive state-wide coverage across MP', color: '#ea580c', order: 1, isVisible: true },
  { id: 'cat-bhopal', name: 'Bhopal', slug: 'bhopal', description: 'City news, municipal affairs, Lake city updates', color: '#0284c7', order: 2, isVisible: true },
  { id: 'cat-india', name: 'India', slug: 'india', description: 'National news, policy, defense, governance', color: '#16a34a', order: 3, isVisible: true },
  { id: 'cat-politics', name: 'Politics', slug: 'politics', description: 'Parliament, elections, political analysis', color: '#9333ea', order: 4, isVisible: true },
  { id: 'cat-business', name: 'Business', slug: 'business', description: 'Markets, economy, startups, banking, GST', color: '#ca8a04', order: 5, isVisible: true },
  { id: 'cat-education', name: 'Education', slug: 'education', description: 'Universities, entrance exams, UGC, skill missions', color: '#e11d48', order: 8, isVisible: true },
  { id: 'cat-sports', name: 'Sports', slug: 'sports', description: 'Cricket, Olympics, hockey, athletics', color: '#059669', order: 9, isVisible: true },
  { id: 'cat-world', name: 'World', slug: 'world', description: 'International diplomacy, geopolitics, global events', color: '#2563eb', order: 10, isVisible: true },
  { id: 'cat-entertainment', name: 'Entertainment', slug: 'entertainment', description: 'Cinema, OTT, culture, arts, literature', color: '#db2777', order: 11, isVisible: true }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Rajesh Sharma',
    email: 'admin@bharatbulletin.in',
    role: 'ADMIN',
    bureau: 'Central Editorial Desk (New Delhi)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+91 98110 22334',
    isActive: true,
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'user-reporter-1',
    name: 'Priya Nair',
    email: 'reporter@bharatbulletin.in',
    role: 'REPORTER',
    bureau: 'Bhopal City Bureau',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    phone: '+91 94250 11223',
    isActive: true,
    createdAt: '2026-02-01T10:00:00Z'
  },
  {
    id: 'user-reporter-2',
    name: 'Vikram Chouhan',
    email: 'vikram@bharatbulletin.in',
    role: 'REPORTER',
    bureau: 'Madhya Pradesh State Bureau',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '+91 97550 44556',
    isActive: true,
    createdAt: '2026-02-10T11:00:00Z'
  }
];

export const INITIAL_BREAKING_NEWS: BreakingNews[] = [
  {
    id: 'break-1',
    title: 'ISRO successfully activates high-resolution optical payload on Next-Gen Earth Observation Satellite',
    category: 'Technology',
    priority: 'FLASH',
    url: '/article/isro-nextgen-earth-observation-satellite-live',
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  },
  {
    id: 'break-2',
    title: 'Bhopal Metro Phase-2 trial run flag-off announced; commercial operations scheduled for next month',
    category: 'Bhopal',
    priority: 'URGENT',
    url: '/article/bhopal-metro-phase-2-trials',
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString()
  },
  {
    id: 'break-3',
    title: 'India launches sovereign AI Compute mission "BharatGen" with 10,000 GPU cluster for universities',
    category: 'AI',
    priority: 'HIGH',
    url: '/article/india-sovereign-ai-compute-cluster-launch',
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  }
];

export const INITIAL_SCHEDULED_FEEDS: ScheduledFeed[] = [
  {
    id: 'feed-pib',
    name: 'Press Information Bureau (PIB) India',
    feedUrl: 'https://pib.gov.in/RssMain.aspx',
    category: 'India',
    frequencyMinutes: 15,
    lastFetchedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: 'ACTIVE',
    itemsProcessed: 142
  },
  {
    id: 'feed-mpinfo',
    name: 'Madhya Pradesh Info Bureau (MPPR)',
    feedUrl: 'https://mpinfo.org/rss/news_feed.aspx',
    category: 'Madhya Pradesh',
    frequencyMinutes: 20,
    lastFetchedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    status: 'ACTIVE',
    itemsProcessed: 89
  },
  {
    id: 'feed-ddnews',
    name: 'DD News National & Science Feed',
    feedUrl: 'https://ddnews.gov.in/en/rss/feeds',
    category: 'Technology',
    frequencyMinutes: 30,
    lastFetchedAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    status: 'ACTIVE',
    itemsProcessed: 116
  },
  {
    id: 'feed-bhopal',
    name: 'Bhopal Municipal Corporation & Urban Affairs',
    feedUrl: 'https://bhopal.nic.in/en/feed/rss/',
    category: 'Bhopal',
    frequencyMinutes: 60,
    lastFetchedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'ACTIVE',
    itemsProcessed: 54
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'india-sovereign-ai-compute-cluster-launch',
    title: 'India Launches Sovereign AI Compute Mission "BharatGen" with 10,000 GPU Supercomputing Cluster',
    titleHi: 'भारत ने 10,000 जीपीयू क्लस्टर के साथ संप्रभु एआई मिशन "भारत-जेन" किया लॉन्च',
    summary: 'The Ministry of Electronics and IT has inaugurated the nationwide BharatGen sovereign AI infrastructure, granting subsidized high-performance compute to Indian researchers, startups, and academic institutions across 22 scheduled languages.',
    summaryHi: 'इलेक्ट्रॉनिक्स और आईटी मंत्रालय ने राष्ट्रीय भारत-जेन संप्रभु एआई अवसंरचना का उद्घाटन किया है, जिससे 22 अनुसूचित भाषाओं में भारतीय शोधकर्ताओं, स्टार्टअप्स और अकादमिक संस्थानों को उच्च-प्रदर्शन कंप्यूटिंग उपलब्ध होगी।',
    content: `NEW DELHI — In a historic leap towards technological self-reliance, the Union Government on Tuesday officially commissioned the first phase of the national 'BharatGen' computing initiative, establishing an indigenous 10,000-GPU artificial intelligence supercomputing cluster.

The state-of-the-art facility, housed across distributed data centres in Bengaluru, Pune, and Bhopal, is purpose-built to accelerate foundational AI models trained natively on Indian linguistic and cultural nuances. 

Speaking at the launch ceremony in New Delhi, the IT Minister emphasized that the platform will provide subsidized compute tokens to over 450 accredited universities and 2,000 emerging deep-tech startups.

"India cannot remain a mere consumer of imported AI frameworks. Through BharatGen, our scholars, agricultural scientists, and healthcare researchers will have access to frontier-grade computing power right here on Indian soil, adhering strictly to our national data sovereignty laws," the Minister stated.

The initial models developed under this initiative focus on diagnostic medical imaging for rural clinics, weather prediction for monsoon micro-climates, and real-time audio translation across 22 official Indian languages.`,
    contentHi: `नई दिल्ली — तकनीकी आत्मनिर्भरता की दिशा में ऐतिहासिक कदम बढ़ाते हुए केंद्र सरकार ने मंगलवार को राष्ट्रीय 'भारत-जेन' कंप्यूटिंग पहल के पहले चरण का औपचारिक शुभारंभ किया, जिसके तहत 10,000-जीपीयू वाला स्वदेशी आर्टिफिशियल इंटेलिजेंस सुपरकंप्यूटिंग क्लस्टर स्थापित किया गया है।

बेंगलुरु, पुणे और भोपाल स्थित डेटा केंद्रों में स्थापित यह अत्याधुनिक सुविधा भारतीय भाषाई और सांस्कृतिक संदर्भों पर प्रशिक्षित एआई मॉडल विकसित करने के लिए बनाई गई है।

नई दिल्ली में उद्घाटन समारोह को संबोधित करते हुए आईटी मंत्री ने स्पष्ट किया कि इस मंच के माध्यम से 450 से अधिक मान्यता प्राप्त विश्वविद्यालयों और 2,000 उभरते डीप-टेक स्टार्टअप्स को रियायती कंप्यूटिंग उपलब्ध कराई जाएगी।

मंत्री ने कहा, "भारत केवल आयातित विदेशी एआई फ्रेमवर्क का उपभोक्ता बनकर नहीं रह सकता। भारत-जेन के माध्यम से हमारे वैज्ञानिकों, कृषि विशेषज्ञों और स्वास्थ्य शोधकर्ताओं को भारतीय धरती पर ही डेटा संप्रभुता कानूनों के तहत अत्याधुनिक कंप्यूटिंग शक्ति मिलेगी।"

इस पहल के तहत विकसित होने वाले शुरुआती मॉडल ग्रामीण क्लीनिकों के लिए डायग्नोस्टिक मेडिकल इमेजिंग, मानसूनी मौसम की सूक्ष्म भविष्यवाणी और 22 आधिकारिक भारतीय भाषाओं में रीयल-टाइम अनुवाद पर केंद्रित हैं।`,
    categoryId: 'cat-ai',
    categoryName: 'AI',
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    caption: 'Supercomputing server racks commissioned for the BharatGen sovereign AI mission in New Delhi.',
    authorId: 'user-admin',
    authorName: 'Rajesh Sharma',
    authorRole: 'ADMIN',
    status: 'PUBLISHED',
    isAiGenerated: false,
    tags: ['AI', 'BharatGen', 'Technology', 'Supercomputing', 'MeitY'],
    viewsCount: 14820,
    sharesCount: 1240,
    isBreaking: true,
    isFeatured: true,
    readingTimeMinutes: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    reviewedBy: 'Rajesh Sharma'
  },
  {
    id: 'art-2',
    slug: 'bhopal-metro-phase-2-trials',
    title: 'Bhopal Metro Phase-2 Trial Runs Begin Across Subhash Nagar to Karond Route',
    titleHi: 'भोपाल मेट्रो फेज़-2: सुभाष नगर से करोंद रूट पर ट्रायल रन शुरू',
    summary: 'Bhopal Metro authorities have commenced technical trial runs for the high-priority corridor, promising rapid urban transit for over 2.5 lakh daily commuters once commercial operations commence.',
    summaryHi: 'भोपाल मेट्रो रेल प्रशासन ने उच्च प्राथमिकता वाले कॉरिडोर पर तकनीकी परीक्षण शुरू कर दिया है, जिससे वाणिज्यिक संचालन शुरू होने के बाद प्रतिदिन 2.5 लाख यात्रियों को तेज व सुरक्षित आवागमन मिलेगा।',
    content: `BHOPAL — Commuters across the state capital witnessed a major milestone on Tuesday as trial trains rolled along the newly electrified viaducts connecting Subhash Nagar depot with Karond Square.

The Madhya Pradesh Metro Rail Corporation Limited (MPMRCL) deployed modern, lightweight aluminum coach trains equipped with automatic train supervision (ATS) and regenerative braking systems. 

Senior engineers confirmed that track geometry, emergency braking calibration, and platform screen integration tests were executed with complete precision during the inaugural run.

District administration officials indicated that after mandatory safety certifications from the Commissioner of Metro Rail Safety (CMRS), the line will be thrown open to the public in phases, substantially decongesting key commercial choke points near Bhopal Junction and Karond Mandi.`,
    contentHi: `भोपाल — मध्य प्रदेश की राजधानी के नागरिकों ने मंगलवार को एक महत्वपूर्ण पड़ाव देखा, जब सुभाष नगर डिपो से करोंद चौराहे को जोड़ने वाले नवनिर्मित विद्युतीकृत ट्रैक पर पहली बार मेट्रो ट्रेनों का ट्रायल रन सफलतापूर्वक संपन्न हुआ।

मध्य प्रदेश मेट्रो रेल कॉर्पोरेशन लिमिटेड (MPMRCL) ने स्वचालित ट्रेन पर्यवेक्षण और ऊर्जा बचत वाली रीजेनेरेटिव ब्रेकिंग प्रणाली से लैस आधुनिक हल्के एल्यूमीनियम कोच तैनात किए हैं।

वरिष्ठ इंजीनियरों ने पुष्टि की कि ट्रैक ज्यामिति, आपातकालीन ब्रेकिंग अंशांकन और प्लेटफॉर्म स्क्रीन समन्वय परीक्षण पूरी सटीकता के साथ पूरे किए गए।

जिला प्रशासन के अधिकारियों ने बताया कि मेट्रो रेलवे सुरक्षा आयुक्त (CMRS) से अनिवार्य सुरक्षा मंजूरी मिलने के उपरांत इस लाइन को आम जनता के लिए चरणबद्ध तरीके से खोला जाएगा, जिससे भोपाल जंक्शन और करोंद मंडी के आसपास यातायात दबाव में भारी कमी आएगी।`,
    categoryId: 'cat-bhopal',
    categoryName: 'Bhopal',
    coverImage: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    caption: 'Modern metro rakes undergoing test runs on the elevated corridor in Bhopal.',
    authorId: 'user-reporter-1',
    authorName: 'Priya Nair',
    authorRole: 'REPORTER',
    status: 'PUBLISHED',
    isAiGenerated: false,
    sourceUrl: 'https://mpinfo.org/bhopal-metro-update',
    sourceName: 'MP Metro Rail Corp Press Briefing',
    tags: ['Bhopal', 'Metro', 'Urban Transit', 'Madhya Pradesh', 'Infrastructure'],
    viewsCount: 9240,
    sharesCount: 610,
    isBreaking: false,
    isFeatured: true,
    readingTimeMinutes: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    reviewedBy: 'Rajesh Sharma'
  },
  {
    id: 'art-3',
    slug: 'madhya-pradesh-green-corridor-solar-parks',
    title: 'Madhya Pradesh Expands Rewa Model with 1,500 MW Floating Solar Array on Omkareshwar Reservoir',
    titleHi: 'मध्य प्रदेश: ओंकारेश्वर जलाशय पर 1,500 मेगावाट फ्लोटिंग सोलर प्रोजेक्ट का हुआ विस्तार',
    summary: 'The MP New and Renewable Energy Department has energized the next stage of the Omkareshwar floating solar project, cementing the state\'s position as India\'s premier clean energy leader.',
    summaryHi: 'नवीन एवं नवीकरणीय ऊर्जा विभाग ने ओंकारेश्वर फ्लोटिंग सोलर प्रोजेक्ट के नए चरण को सफलतापूर्वक ग्रिड से जोड़ा, जिससे मध्य प्रदेश देश का सबसे बड़ा तैरता हुआ सौर ऊर्जा केंद्र बन गया है।',
    content: `BHOPAL/KHANDWA — In an exemplary convergence of engineering and ecological preservation, Madhya Pradesh has expanded operations at the Omkareshwar floating solar power installation, adding 350 MW of clean generation capacity to the state grid.

Built across the backwaters of the Omkareshwar dam on the Narmada river, the project employs specialized moisture-resistant photovoltaic panels mounted on recyclable high-density polyethylene pontoons.

Official reports highlight two key environmental dividends: the floating array minimizes water evaporation from the reservoir by an estimated 32% annually while utilizing zero arable agricultural land.

State Energy Department officials stated that electricity from this expansion is being transmitted to Delhi Metro and industrial hubs across central India under existing long-term clean power purchase agreements.`,
    contentHi: `भोपाल/खंडवा — इंजीनियरिंग और पर्यावरण संरक्षण के अनूठे संगम के रूप में मध्य प्रदेश ने ओंकारेश्वर फ्लोटिंग सौर ऊर्जा संयंत्र का विस्तार करते हुए राज्य ग्रिड में 350 मेगावाट स्वच्छ ऊर्जा क्षमता और जोड़ी है।

नर्मदा नदी पर ओंकारेश्वर बांध के बैकवाटर में स्थापित यह परियोजना रिसाइकल करने योग्य उच्च घनत्व पॉलीथीन पोंटून पर नमी-प्रतिरोधी विशेष फोटोवोल्टिक पैनलों का उपयोग करती है।

आधिकारिक रिपोर्टों के अनुसार, यह तैरता हुआ सौर संयंत्र जलाशय से प्रतिवर्ष लगभग 32% पानी के वाष्पीकरण को रोकता है और इसमें एक इंच भी उपजाऊ कृषि भूमि का उपयोग नहीं होता।

ऊर्जा विभाग के अधिकारियों ने बताया कि इस संयंत्र से उत्पादित स्वच्छ बिजली दिल्ली मेट्रो और मध्य भारत के प्रमुख औद्योगिक केंद्रों को दीर्घकालिक समझौतों के तहत आपूर्ति की जा रही है।`,
    categoryId: 'cat-mp',
    categoryName: 'Madhya Pradesh',
    coverImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    caption: 'Panoramic view of floating solar arrays deployed on the Omkareshwar reservoir in MP.',
    authorId: 'user-reporter-2',
    authorName: 'Vikram Chouhan',
    authorRole: 'REPORTER',
    status: 'PUBLISHED',
    isAiGenerated: false,
    sourceUrl: 'https://mpinfo.org/energy-sector-announcement',
    sourceName: 'Department of Energy, MP',
    tags: ['Madhya Pradesh', 'Solar Energy', 'Omkareshwar', 'Green Power', 'Renewable Energy'],
    viewsCount: 7850,
    sharesCount: 430,
    isBreaking: false,
    isFeatured: true,
    readingTimeMinutes: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
    reviewedBy: 'Rajesh Sharma'
  },
  {
    id: 'art-4',
    slug: 'rbi-digital-rupee-offline-expansion',
    title: 'RBI Rolls Out Offline Tap-and-Pay Feature for Central Bank Digital Currency (CBDC)',
    titleHi: 'आरबीआई ने डिजिटल रुपये (CBDC) के लिए बिना इंटरनेट वाला ऑफलाइन टैप-एंड-पे फीचर किया जारी',
    summary: 'The Reserve Bank of India has introduced proximity NFC offline transaction capabilities for the digital Rupee, enabling seamless peer-to-peer and merchant payments even in zero-internet zones.',
    summaryHi: 'भारतीय रिज़र्व बैंक ने डिजिटल रुपये (e₹) के लिए ऑफलाइन एनएफसी भुगतान सुविधा शुरू की है, जिससे बिना मोबाइल नेटवर्क या इंटरनेट वाले क्षेत्रों में भी निर्बाध लेन-देन संभव होगा।',
    content: `MUMBAI — In a pivotal development for India\'s fintech ecosystem, Reserve Bank Governor Shaktikanta Das announced the nationwide deployment of offline transaction capabilities for the Digital Rupee (e₹).

The upgrade enables citizens in hilly, rural, or subterranean settings without cellular connectivity to exchange digital currency tokens via encrypted Near Field Communication (NFC) and sound-wave protocols.

The transactions settle securely on device hardware secure elements, synchronizing with the central banking ledger once either device reconnects to a telecommunications network.

Financial inclusion analysts noted that this capability will bridge the last-mile digital divide across tribal belts in Madhya Pradesh, Odisha, and Northeast states, allowing farmers and small vendors to transact with absolute certainty.`,
    contentHi: `मुंबई — भारत के फिनटेक क्षेत्र में ऐतिहासिक कदम उठाते हुए रिज़र्व बैंक के गवर्नर ने डिजिटल रुपये (e₹) के लिए देशव्यापी ऑफलाइन भुगतान प्रणाली शुरू करने की घोषणा की।

यह सुविधा नागरिकों को पहाड़ी, दूरदराज के ग्रामीण या बिना नेटवर्क वाले क्षेत्रों में भी एनएफसी और साउंड-वेव तकनीक के माध्यम से डिजिटल मुद्रा टोकन का सुरक्षित आदान-प्रदान करने में सक्षम बनाती है।

यह लेन-देन मोबाइल के हार्डवेयर सिक्योर एलिमेंट पर सुरक्षित रूप से दर्ज होता है और जैसे ही दोनों में से कोई भी डिवाइस नेटवर्क से जुड़ता है, केंद्रीय बैंक के बहीखाते में स्वतः अपडेट हो जाता है।

विशेषज्ञों का कहना है कि यह सुविधा मध्य प्रदेश, ओडिशा और पूर्वोत्तर राज्यों के जनजातीय अंचलों में वित्तीय समावेशन को नई गति देगी।`,
    categoryId: 'cat-business',
    categoryName: 'Business',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    caption: 'Mobile banking terminal executing offline e-Rupee digital settlement.',
    authorId: 'user-admin',
    authorName: 'Rajesh Sharma',
    authorRole: 'ADMIN',
    status: 'PUBLISHED',
    isAiGenerated: false,
    sourceUrl: 'https://rbi.org.in/pressreleases/cbdc-offline-2026',
    sourceName: 'RBI Monetary Policy Statement',
    tags: ['Business', 'RBI', 'Digital Rupee', 'Fintech', 'Banking', 'Economy'],
    viewsCount: 11200,
    sharesCount: 890,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 620).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    reviewedBy: 'Rajesh Sharma'
  },
  {
    id: 'art-5',
    slug: 'ai-news-draft-pib-isro-gaganyaan-life-support',
    title: 'AI Draft: ISRO Validates Human-Rated Environmental Control and Life Support System for Gaganyaan Mission',
    summary: 'ISRO and defense research labs have successfully completed endurance validation of the atmospheric revitalization assembly designed to maintain cabin pressure and oxygen concentration for Indian astronauts.',
    content: `BENGALURU/NEW DELHI — According to an authorized press release issued by the Press Information Bureau, the Indian Space Research Organisation (ISRO) has achieved a benchmark milestone in its Gaganyaan human spaceflight programme.

Engineers at the Vikram Sarabhai Space Centre (VSSC) in Thiruvananthapuram and the Institute of Aerospace Medicine in Bengaluru conducted extensive 72-hour continuous simulations of the Environmental Control and Life Support System (ECLSS).

The test evaluated:
1. Active carbon-dioxide scrubbers under simulated astronaut metabolic workloads.
2. Humidity regulation in closed-loop microgravity conditions.
3. Rapid decompression emergency safety override valves.

All telemetry parameters stayed within designated human-rating flight tolerance bands. The development brings India closer to launching its first crewed orbital mission into a 400-km low Earth orbit.

[EDITORIAL NOTE: This is an automated AI draft ingested from Press Information Bureau RSS release PIB-DELHI-ISRO-2026-09. All technical metrics have been cross-checked against ISRO mission parameters. Human review and editorial sign-off are required before publication.]`,
    categoryId: 'cat-tech',
    categoryName: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    caption: 'Orbital module test setup undergoing environmental life-support validation.',
    authorId: 'ai-engine',
    authorName: 'Bharat AI Newsbot',
    authorRole: 'AI_SYSTEM',
    status: 'PENDING_REVIEW',
    isAiGenerated: true,
    aiConfidenceScore: 96,
    factCheckNotes: 'Corroborated with PIB Release ID 198421 and ISRO Mission Directorate official bulletin. Zero conflicting claims identified.',
    conflictingFlags: [],
    sourceUrl: 'https://pib.gov.in/PressReleasePage.aspx?PRID=198421',
    sourceName: 'Press Information Bureau (PIB)',
    tags: ['ISRO', 'Gaganyaan', 'Space', 'PIB', 'Science', 'Technology'],
    viewsCount: 0,
    sharesCount: 0,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 75).toISOString()
  },
  {
    id: 'art-6',
    slug: 'ai-news-draft-mp-bhopal-upper-lake-wetlands',
    title: 'AI Draft: Ramsar Wetland Protection: MP Cabinet Clears ₹180 Crore Conservation Plan for Bhopal Bhojtal',
    summary: 'The Madhya Pradesh Council of Ministers has sanctioned an integrated eco-restoration project for the Bhoj Wetland (Upper Lake), focusing on automated water quality monitoring and catchment protection.',
    content: `BHOPAL — Drawing from official announcements published through the Madhya Pradesh Public Relations Department, the state government has approved a dedicated ₹180 crore budgetary allocation for the conservation of Bhopal's historical Bhoj Wetland.

Known locally as the Upper Lake (Bada Talaab), the 11th-century reservoir created by Raja Bhoj is the primary drinking water source for over 40% of the city and serves as a vital Ramsar ecological site.

Key elements of the cabinet-approved conservation master plan include:
- Establishment of 12 real-time solar-powered water quality telemetry buoys across Kolans river inflow channels.
- Construction of bio-shield vegetative barriers to curb agricultural runoff and silt deposition.
- Strict geo-fenced enforcement against illegal construction within the full-tank boundary.

[FACT-CHECK FLAG]: The project timeline mentioned in the initial press release contains two conflicting completion dates (2027 vs 2028). The editorial desk is advised to verify the gazette notification with the Urban Development & Environment Department before public release.`,
    categoryId: 'cat-bhopal',
    categoryName: 'Bhopal',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    caption: 'Morning mist over the scenic Upper Lake (Bhojtal) in Bhopal.',
    authorId: 'ai-engine',
    authorName: 'Bharat AI Newsbot',
    authorRole: 'AI_SYSTEM',
    status: 'PENDING_REVIEW',
    isAiGenerated: true,
    aiConfidenceScore: 89,
    factCheckNotes: 'Primary data from MPPR Cabinet Bulletin. Note conflict regarding completion year in paragraph 4.',
    conflictingFlags: ['Conflicting completion timeline: 2027 vs 2028 noted in secondary media'],
    sourceUrl: 'https://mpinfo.org/cabinet-decisions-wetland-protection',
    sourceName: 'MP Information & Public Relations',
    tags: ['Bhopal', 'Bhojtal', 'Madhya Pradesh', 'Environment', 'Wetlands', 'Conservation'],
    viewsCount: 0,
    sharesCount: 0,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString()
  },
  {
    id: 'art-7',
    slug: 'reporter-submission-aiims-bhopal-robotic-surgery',
    title: 'Reporter Submission: AIIMS Bhopal Performs Landmark Robotic Cardiac Surgery on 12-Year-Old Patient',
    summary: 'A team of pediatric surgeons and cardiologists at AIIMS Bhopal has successfully carried out a minimally invasive atrial septal defect repair using an advanced multi-arm robotic surgical system.',
    content: `BHOPAL — In a medical milestone for central India, doctors at the All India Institute of Medical Sciences (AIIMS) Bhopal have successfully performed a high-precision robotic heart surgery on a 12-year-old child from Vidisha district.

The patient, who had been diagnosed with a congenital atrial septal defect (hole in the heart), was discharged within 48 hours with minimal scarring and zero post-operative complications.

Dr. Alok Verma, lead cardiac surgeon, explained that the high-definition 3D camera and articulating instruments allowed millimeter-scale maneuvering without requiring conventional open-chest sternotomy.

"The patient's recovery trajectory is astounding. Robotic interventions minimize blood loss and drastically cut intensive care stays, which is a blessing for young children," the institute director stated during a press briefing today.`,
    categoryId: 'cat-education',
    categoryName: 'Education',
    coverImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    caption: 'Robotic surgical console utilized for advanced procedures at AIIMS Bhopal.',
    authorId: 'user-reporter-1',
    authorName: 'Priya Nair',
    authorRole: 'REPORTER',
    status: 'PENDING_REVIEW',
    isAiGenerated: false,
    sourceUrl: 'https://aiimsbhopal.edu.in/press/cardiac-robotic-surgery',
    sourceName: 'AIIMS Bhopal Medical Bulletin & Surgeon On-Record Interview',
    editorialNotes: 'Submitted by Priya Nair from Bhopal Bureau. Verified with hospital press spokesperson Dr. Sharma.',
    tags: ['Bhopal', 'AIIMS', 'Healthcare', 'Robotics', 'Madhya Pradesh', 'Medical News'],
    viewsCount: 0,
    sharesCount: 0,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString()
  },
  {
    id: 'art-8',
    slug: 'reporter-draft-bhopal-smart-city-ev-charging',
    title: 'Reporter Draft: Bhopal Smart City Deploys 50 Ultra-Fast Solar-Assisted EV Charging Hubs',
    summary: 'Work in progress: Mapping location clusters along Hoshangabad Road and VIP Road for the upcoming public rollout of green charging stations.',
    content: `Draft notes:
- Surveying 50 charging nodes planned under Bhopal Smart City Mission.
- Target completion: Q3 2026.
- Talking to BMC commissioner tomorrow regarding tariff structure for two-wheelers vs commercial fleet cabs.
- Need high-res image of Hoshangabad road hub.`,
    categoryId: 'cat-bhopal',
    categoryName: 'Bhopal',
    coverImage: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
    authorId: 'user-reporter-1',
    authorName: 'Priya Nair',
    authorRole: 'REPORTER',
    status: 'DRAFT',
    isAiGenerated: false,
    tags: ['Bhopal', 'EV', 'Smart City', 'Draft'],
    viewsCount: 0,
    sharesCount: 0,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 'art-9',
    slug: 'reporter-rejected-sample-story',
    title: 'Unverified Claim on Foreign Semiconductor Plant Near Mandideep',
    summary: 'Informal social media rumor alleging a multi-billion dollar foreign chip fabrication fab without official government MoU or cabinet clearance.',
    content: `Reports circulating on social media claim that a leading Taiwanese semiconductor consortium has chosen Mandideep industrial area near Bhopal for a 3nm wafer fabrication plant...`,
    categoryId: 'cat-business',
    categoryName: 'Business',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    authorId: 'user-reporter-2',
    authorName: 'Vikram Chouhan',
    authorRole: 'REPORTER',
    status: 'REJECTED',
    isAiGenerated: false,
    rejectionReason: 'REJECTED BY EDITORIAL DESK: Unsubstantiated rumor. MP Industrial Development Corporation (MPIDC) confirmed no such MoU or proposal has been received. Please verify on-the-record statements with official ministry channels before filing.',
    editorialNotes: 'Story rejected on 27 Oct by Admin Rajesh Sharma.',
    tags: ['Business', 'Semiconductors', 'Rejected'],
    viewsCount: 0,
    sharesCount: 0,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 250).toISOString()
  },
  {
    id: 'art-indore-1',
    slug: 'indore-cleanest-city-ai-waste-management-record',
    title: 'Indore Achieves 100% Automated Waste Sorting with New AI-Powered Bioremediation Facility',
    titleHi: 'इंदौर का नया कमाल: देश के सबसे स्वच्छ शहर ने शुरू किया 100% एआई-संचालित बायो-वेस्ट प्लांट',
    summary: 'India\'s cleanest city inaugurates a zero-landfill automated processing complex capable of segregating municipal solid waste across 6 streams using computer vision.',
    summaryHi: 'इंदौर नगर निगम ने एशिया के सबसे बड़े स्वचालित सेग्रिगेशन प्लांट का शुभारंभ किया, जो आर्टिफिशियल इंटेलिजेंस और सेंसर से कचरे को 6 श्रेणियों में अलग करता है।',
    content: `INDORE — Continuing its stellar dominance as India's cleanest metropolis for the eighth consecutive term, Indore has officially launched a next-generation automated waste processing complex powered by computer vision robotics.
    
The facility, located on the outskirts of Devguradia, eliminates manual sorting by deploying multi-spectral sensors and high-speed robotic suction arms capable of processing 500 metric tonnes of municipal dry waste daily.
    
Indore Municipal Commissioner stated that the facility operates entirely on captive solar power and converts 95% of incoming biodegradable waste into compressed bio-methane gas used to fuel local city buses.`,
    contentHi: `इंदौर — लगातार 8वीं बार देश का सबसे स्वच्छ शहर रहने के बाद इंदौर ने अब एक और बड़ा मुकाम हासिल किया है। शहर ने हाई-टेक कंप्यूटर विज़न रोबोटिक्स से लैस पूरी तरह से स्वचालित कचरा प्रसंस्करण संयंत्र शुरू किया है।
    
यह संयंत्र रोजाना 500 मीट्रिक टन सूखे कचरे को बिना इंसानी हाथ लगाए ऑटोमैटिक रूप से 6 अलग-अलग रीसाइक्लिंग श्रेणियों में विभाजित करने में सक्षम है।
    
निगम अधिकारियों के अनुसार यह संयंत्र ग्रीन एनर्जी पर चलता है और इसके बायो-सीएनजी आउटपुट से शहर की सिटी बसें सफलतापूर्वक संचालित की जा रही हैं।`,
    categoryId: 'cat-mp',
    categoryName: 'Madhya Pradesh',
    coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
    authorId: 'user-reporter-1',
    authorName: 'Priya Nair',
    authorRole: 'REPORTER',
    status: 'PUBLISHED',
    isAiGenerated: false,
    tags: ['Madhya Pradesh', 'Indore', 'Cleanest City', 'Swachh Bharat', 'AI Waste Management'],
    viewsCount: 14200,
    sharesCount: 890,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString()
  },
  {
    id: 'art-gwalior-1',
    slug: 'gwalior-rajmata-vijayaraje-scindia-terminal-expansion',
    title: 'Gwalior Airport Modern Terminal Catapults Chambal Region into Global Tourism Circuit',
    titleHi: 'ग्वालियर नया एयर टर्मिनल: चंबल और बुंदेलखंड को मिली अंतरराष्ट्रीय हवाई कनेक्टिविटी',
    summary: 'The newly commissioned eco-friendly passenger terminal at Gwalior airport begins operating direct commercial services to Bengaluru, Hyderabad, and Ahmedabad.',
    summaryHi: 'राजमाता विजयाराजे सिंधिया एयरपोर्ट टर्मिनल के विस्तार से ग्वालियर सीधे दक्षिण और पश्चिमी भारत के प्रमुख व्यापारिक शहरों से जुड़ गया है।',
    content: `GWALIOR — The historical city of Gwalior witnessed a major transport landmark as direct regular flights to Bengaluru, Hyderabad, and Ahmedabad commenced operations from the modern passenger terminal.
    
Engineered with indigenous stone architecture and certified GRIHA-4 green infrastructure ratings, the new terminal accommodates over 1,400 passengers during peak traffic hours.
    
Local tourism guilds noted a 40% surge in heritage bookings across Gwalior Fort, Tansen Tomb, and nearby Bateshwar temple clusters within the first month of expanded regional connectivity.`,
    categoryId: 'cat-mp',
    categoryName: 'Madhya Pradesh',
    coverImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    authorId: 'user-reporter-2',
    authorName: 'Vikram Chouhan',
    authorRole: 'REPORTER',
    status: 'PUBLISHED',
    isAiGenerated: false,
    tags: ['Madhya Pradesh', 'Gwalior', 'Aviation', 'Chambal', 'Tourism'],
    viewsCount: 9600,
    sharesCount: 420,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString()
  },
  {
    id: 'art-jabalpur-1',
    slug: 'jabalpur-bhedaghat-narmada-corridor-conservation',
    title: 'Jabalpur High Court Approves Eco-Heritage Corridor for Bhedaghat Marble Rocks',
    titleHi: 'जबलपुर: भेड़ाघाट संगमरमर वादियों के संरक्षण के लिए ग्रीन कॉरिडोर परियोजना को मिली मंजूरी',
    summary: 'The Madhya Pradesh High Court at Jabalpur grants clearance for an integrated riverfront protection masterplan along Dhuandhar falls with electric-only boating.',
    summaryHi: 'नर्मदा नदी के प्रसिद्ध भेड़ाघाट और धुआंधार जलप्रपात के आसपास शून्य-प्रदूषण इलेक्ट्रिक बोटिंग और हेरिटेज संरक्षण योजना लागू की जाएगी।',
    content: `JABALPUR — In a landmark environmental ruling, the Principal Bench of the MP High Court at Jabalpur has formally approved the Bhedaghat Eco-Heritage Masterplan, ordering strict conservation protocols along the world-renowned marble gorges of river Narmada.
    
The plan phases out all combustion engine tourist boats in favor of silent lithium-ion catamarans and establishes an uninterrupted 14-kilometer pedestrian riverfront walkway lined with indigenous tree species.`,
    categoryId: 'cat-mp',
    categoryName: 'Madhya Pradesh',
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    authorId: 'user-reporter-1',
    authorName: 'Priya Nair',
    authorRole: 'REPORTER',
    status: 'PUBLISHED',
    isAiGenerated: false,
    tags: ['Madhya Pradesh', 'Jabalpur', 'Bhedaghat', 'High Court', 'Narmada'],
    viewsCount: 6800,
    sharesCount: 310,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 280).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 260).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 260).toISOString()
  },
  {
    id: 'art-ujjain-1',
    slug: 'ujjain-mahakal-lok-smart-crowd-ai-management',
    title: 'Ujjain Mahakal Corridor Deploys Real-Time AI Heatmaps for Seamless Pilgrim Management',
    titleHi: 'उज्जैन श्री महाकाल महालोक: AI और फेशियल रिकग्निशन से श्रद्धालुओं के लिए बना सुगम दर्शन तंत्र',
    summary: 'Over 2.5 lakh devotees experience zero-wait transit through the second phase of Mahakal Lok enabled by multi-camera predictive flow algorithms.',
    summaryHi: 'उज्जैन में महाकाल महालोक कॉरिडोर के दूसरे चरण में एआई आधारित क्राउड मैनेजमेंट सिस्टम ने 2.5 लाख से अधिक श्रद्धालुओं का दर्शन समय 70% तक घटाया।',
    content: `UJJAIN — The holy city of Ujjain has successfully instituted a world-class predictive crowd orchestration system across the sprawling Shri Mahakal Mahalok corridor, setting a benchmark for spiritual tourism infrastructure.`,
    categoryId: 'cat-mp',
    categoryName: 'Madhya Pradesh',
    coverImage: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
    authorId: 'user-reporter-2',
    authorName: 'Vikram Chouhan',
    authorRole: 'REPORTER',
    status: 'PUBLISHED',
    isAiGenerated: false,
    tags: ['Madhya Pradesh', 'Ujjain', 'Mahakal', 'Smart City', 'Tourism'],
    viewsCount: 11400,
    sharesCount: 780,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 290).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 290).toISOString()
  },
  {
    id: 'art-up-1',
    slug: 'uttar-pradesh-noida-jewar-international-airport-trials',
    title: 'Uttar Pradesh: Noida International Airport at Jewar Enters Final Calibration Flight Trials',
    titleHi: 'उत्तर प्रदेश: जेवर इंटरनेशनल एयरपोर्ट पर रनवे कैलिब्रेशन ट्रायल सफल, जल्द शुरू होंगी वाणिज्यिक उड़ानें',
    summary: 'The Directorate General of Civil Aviation clears instrumental landing validation as NCR gets its second world-class aviation gateway.',
    summaryHi: 'डीजीसीए और एएआई की टीम ने जेवर अंतरराष्ट्रीय हवाई अड्डे के पहले रनवे पर इंस्ट्रूमेंटल लैंडिंग सिस्टम (ILS) का सफल परीक्षण पूरा कर लिया है।',
    content: `LUCKNOW/NOIDA — In a massive boost to northern India's logistics and transit infrastructure, Uttar Pradesh has marked a crucial milestone as the Noida International Airport at Jewar successfully concluded its first round of CAT-III ILS calibration flight trials.
    
Once operational, Jewar Airport will serve as the premier cargo and multi-modal transit hub for western Uttar Pradesh, directly linked via high-speed expressway corridors to Delhi, Agra, and Mathura.`,
    categoryId: 'cat-india',
    categoryName: 'India',
    coverImage: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=1200&q=80',
    authorId: 'user-admin',
    authorName: 'Rajesh Sharma',
    authorRole: 'ADMIN',
    status: 'PUBLISHED',
    isAiGenerated: false,
    tags: ['Uttar Pradesh', 'UP', 'Noida', 'Jewar Airport', 'Aviation', 'Infrastructure'],
    viewsCount: 15300,
    sharesCount: 940,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 'art-rajasthan-1',
    slug: 'rajasthan-thar-desert-mega-solar-and-green-hydrogen-grid',
    title: 'Rajasthan Commissions 2,000 MW Solar Park in Thar Desert, Bolstering Green Hydrogen Vision',
    titleHi: 'राजस्थान: थार मरुस्थल में 2,000 मेगावाट का नया सोलर पार्क शुरू, ग्रीन हाइड्रोजन को मिला बल',
    summary: 'Jaisalmer and Bikaner solar clusters achieve record generation capacity as Rajasthan leads national renewable energy charts.',
    summaryHi: 'जैसलमेर में 2,000 मेगावाट के नए सौर ऊर्जा संयंत्र ने पूर्ण उत्पादन शुरू कर दिया है, जिससे राजस्थान देश में 25 गीगावाट सौर क्षमता पार करने वाला पहला राज्य बना।',
    content: `JAIPUR/JAISALMER — Solidifying its status as the green powerhouse of India, Rajasthan on Monday synchronized an additional 2,000 MW ultra-mega solar array in the Thar desert grid, earmarked for green hydrogen and ammonia synthesis complexes.`,
    categoryId: 'cat-india',
    categoryName: 'India',
    coverImage: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
    authorId: 'user-admin',
    authorName: 'Rajesh Sharma',
    authorRole: 'ADMIN',
    status: 'PUBLISHED',
    isAiGenerated: false,
    tags: ['Rajasthan', 'Solar Power', 'Jaisalmer', 'Clean Energy', 'Thar'],
    viewsCount: 12100,
    sharesCount: 620,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 190).toISOString()
  },
  {
    id: 'art-bihar-1',
    slug: 'bihar-patna-metro-underground-tunneling-milestone',
    title: 'Bihar: Patna Metro Completes Landmark Twin Underground Tunneling Under Historic Old City',
    titleHi: 'बिहार: पटना मेट्रो ने ऐतिहासिक पुराने शहर के नीचे पहली ट्विन टनल की सफल खुदाई पूरी की',
    summary: 'The Patna Metro Rail Corporation finishes breakthrough tunneling for Corridor-2, connecting Patna Junction to Rajendra Nagar Terminal.',
    summaryHi: 'पटना जंक्शन से राजेंद्र नगर के बीच पहली भूमिगत मेट्रो सुरंग की सफल खुदाई पूरी कर ली गई है। 2027 तक कमर्शियल परिचालन का लक्ष्य रखा गया है।',
    content: `PATNA — In a major urban transit milestone, the Patna Metro Rail Project successfully executed a twin-tunnel breakthrough beneath the historic and densely populated old quarters of Patna, connecting major arterial railway transit nodes.`,
    categoryId: 'cat-india',
    categoryName: 'India',
    coverImage: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    authorId: 'user-admin',
    authorName: 'Rajesh Sharma',
    authorRole: 'ADMIN',
    status: 'PUBLISHED',
    isAiGenerated: false,
    tags: ['Bihar', 'Patna', 'Patna Metro', 'Infrastructure', 'Urban Transit'],
    viewsCount: 8900,
    sharesCount: 450,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 350).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 310).toISOString()
  },
  {
    id: 'art-delhi-1',
    slug: 'delhi-ncr-100-electric-bus-fleet-transition-record',
    title: 'Delhi NCR Surpasses 3,000 Zero-Emission Electric Buses in Public Transit Network',
    titleHi: 'दिल्ली NCR: 3,000 इलेक्ट्रिक बसों का नया रिकॉर्ड, सार्वजनिक परिवहन बना देश में सबसे हरित',
    summary: 'Delhi Transport Corporation achieves the highest density of green intra-city buses among global capital cities, slashing commuter emissions.',
    summaryHi: 'दिल्ली सरकार ने डीटीसी बेड़े में 500 नई लो-फ्लोर इलेक्ट्रिक बसें जोड़ीं। अब शहर में 3,000 से अधिक ई-बसें संचालित हो रही हैं।',
    content: `NEW DELHI — Marking a significant stride towards atmospheric pollution reduction in the National Capital Region, Delhi has expanded its zero-emission electric bus fleet to exceed 3,000 vehicles across all municipal zones.`,
    categoryId: 'cat-india',
    categoryName: 'India',
    coverImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    authorId: 'user-admin',
    authorName: 'Rajesh Sharma',
    authorRole: 'ADMIN',
    status: 'PUBLISHED',
    isAiGenerated: false,
    tags: ['Delhi', 'Delhi NCR', 'Electric Bus', 'Clean Air', 'Green Mobility'],
    viewsCount: 16800,
    sharesCount: 980,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString()
  },
  {
    id: 'art-maharashtra-1',
    slug: 'maharashtra-navi-mumbai-international-airport-trials',
    title: 'Maharashtra: Commercial Flights Scheduled at Navi Mumbai International Airport by Year-End',
    titleHi: 'महाराष्ट्र: नवी मुंबई इंटरनेशनल एयरपोर्ट पर कमर्शियल ऑपरेशंस की तैयारियां अंतिम चरण में',
    summary: 'CIDCO and Adani Airport Holdings confirm terminal readiness and rapid transit connectivity with the Atal Setu sea bridge.',
    summaryHi: 'अटल सेतु (MTHL) से सीधे जुड़े नवी मुंबई इंटरनेशनल एयरपोर्ट का पहला चरण पूरा, मुंबई के छत्रपति शिवाजी टर्मिनल का लोड 40% कम होगा।',
    content: `MUMBAI/NAVI MUMBAI — Aviation capacity in the Mumbai Metropolitan Region is set to double as the greenfield Navi Mumbai International Airport (NMIAL) entered its final phase of operational readiness testing.`,
    categoryId: 'cat-india',
    categoryName: 'India',
    coverImage: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80',
    authorId: 'user-admin',
    authorName: 'Rajesh Sharma',
    authorRole: 'ADMIN',
    status: 'PUBLISHED',
    isAiGenerated: false,
    tags: ['Maharashtra', 'Mumbai', 'Navi Mumbai', 'Aviation', 'Infrastructure'],
    viewsCount: 13900,
    sharesCount: 810,
    isBreaking: false,
    isFeatured: false,
    readingTimeMinutes: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 170).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 170).toISOString()
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    actorName: 'Rajesh Sharma',
    actorRole: 'ADMIN',
    action: 'PUBLISH_ARTICLE',
    targetTitle: 'India Launches Sovereign AI Compute Mission "BharatGen"',
    details: 'Approved and published to featured lead position on homepage.'
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 250).toISOString(),
    actorName: 'Rajesh Sharma',
    actorRole: 'ADMIN',
    action: 'REJECT_ARTICLE',
    targetTitle: 'Unverified Claim on Foreign Semiconductor Plant Near Mandideep',
    details: 'Reason: Unsubstantiated rumor not verified by MPIDC officials.'
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    actorName: 'Bharat AI Newsbot',
    actorRole: 'AI_SYSTEM',
    action: 'INGEST_RSS_DRAFT',
    targetTitle: 'ISRO Validates Human-Rated Environmental Control and Life Support System',
    details: 'Ingested from PIB Delhi feed. Status set to PENDING_REVIEW (Auto-publish prohibited).'
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    actorName: 'Bharat AI Newsbot',
    actorRole: 'AI_SYSTEM',
    action: 'INGEST_RSS_DRAFT',
    targetTitle: 'Ramsar Wetland Protection: MP Cabinet Clears ₹180 Crore Conservation Plan',
    details: 'Ingested from MPPR feed. Flagged conflicting timeline for editorial review.'
  },
  {
    id: 'log-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    actorName: 'Rajesh Sharma',
    actorRole: 'ADMIN',
    action: 'CREATE_BREAKING_NEWS',
    targetTitle: 'ISRO optical payload activation',
    details: 'Broadcasting FLASH alert to top breaking news ticker.'
  }
];

// Persistent state singleton for the Node server runtime
class DatabaseService {
  private articles: Article[] = [...INITIAL_ARTICLES];
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private breakingNews: BreakingNews[] = [...INITIAL_BREAKING_NEWS];
  private scheduledFeeds: ScheduledFeed[] = [...INITIAL_SCHEDULED_FEEDS];
  private auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  private users: User[] = [...INITIAL_USERS];

  // Articles
  public getArticles(filters?: {
    status?: ArticleStatus | 'ALL';
    categoryId?: string;
    isAiGenerated?: boolean;
    search?: string;
    authorId?: string;
  }): Article[] {
    return this.articles.filter(article => {
      if (filters?.status && filters.status !== 'ALL') {
        if (article.status !== filters.status) return false;
      }
      if (filters?.categoryId && filters.categoryId !== 'cat-all' && filters.categoryId !== 'all') {
        if (article.categoryId !== filters.categoryId && article.categoryName.toLowerCase() !== filters.categoryId.toLowerCase()) {
          return false;
        }
      }
      if (filters?.isAiGenerated !== undefined) {
        if (article.isAiGenerated !== filters.isAiGenerated) return false;
      }
      if (filters?.authorId) {
        if (article.authorId !== filters.authorId) return false;
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesSummary = article.summary.toLowerCase().includes(q);
        const matchesContent = article.content.toLowerCase().includes(q);
        const matchesCategory = article.categoryName.toLowerCase().includes(q);
        const matchesTags = article.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesContent && !matchesCategory && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getArticleBySlug(slug: string): Article | undefined {
    return this.articles.find(a => a.slug === slug || a.id === slug);
  }

  public getArticleById(id: string): Article | undefined {
    return this.articles.find(a => a.id === id);
  }

  public createArticle(data: Partial<Article>, actor?: { name: string; role: string }): Article {
    const slug = data.slug || (data.title || 'untitled')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);

    const newArticle: Article = {
      id: 'art-' + (Date.now()),
      slug,
      title: data.title || 'Untitled Article',
      summary: data.summary || '',
      content: data.content || '',
      categoryId: data.categoryId || 'cat-india',
      categoryName: data.categoryName || 'India',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
      caption: data.caption || '',
      videoUrl: data.videoUrl,
      gallery: data.gallery || (data.coverImage ? [data.coverImage] : []),
      videos: data.videos || (data.videoUrl ? [data.videoUrl] : []),
      authorId: data.authorId || (actor?.role === 'ADMIN' ? 'user-admin' : 'user-reporter-1'),
      authorName: data.authorName || actor?.name || 'Reporter Priya Nair',
      authorRole: (data.authorRole as any) || (actor?.role as any) || 'REPORTER',
      status: data.status || 'DRAFT',
      isAiGenerated: !!data.isAiGenerated,
      aiConfidenceScore: data.aiConfidenceScore,
      factCheckNotes: data.factCheckNotes,
      conflictingFlags: data.conflictingFlags || [],
      sourceUrl: data.sourceUrl,
      sourceName: data.sourceName,
      tags: data.tags || ['India', 'News'],
      rejectionReason: data.rejectionReason,
      editorialNotes: data.editorialNotes,
      viewsCount: 0,
      sharesCount: 0,
      isBreaking: !!data.isBreaking,
      isFeatured: !!data.isFeatured,
      readingTimeMinutes: Math.max(1, Math.round((data.content || '').split(/\s+/).length / 180)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: data.status === 'PUBLISHED' ? new Date().toISOString() : undefined,
      reviewedBy: data.reviewedBy
    };

    this.articles.unshift(newArticle);

    this.addAuditLog({
      actorName: actor?.name || newArticle.authorName,
      actorRole: actor?.role || newArticle.authorRole,
      action: newArticle.isAiGenerated ? 'AI_DRAFT_CREATED' : 'CREATE_ARTICLE',
      targetId: newArticle.id,
      targetTitle: newArticle.title,
      details: `Created story with status: ${newArticle.status}`
    });

    return newArticle;
  }

  public updateArticle(id: string, updates: Partial<Article>, actor?: { name: string; role: string }): Article | null {
    const index = this.articles.findIndex(a => a.id === id);
    if (index === -1) return null;

    const existing = this.articles[index];
    const updatedStatus = updates.status !== undefined ? updates.status : existing.status;
    const isNowPublished = existing.status !== 'PUBLISHED' && updatedStatus === 'PUBLISHED';

    const updated: Article = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      publishedAt: isNowPublished ? new Date().toISOString() : (updates.publishedAt || existing.publishedAt)
    };

    this.articles[index] = updated;

    this.addAuditLog({
      actorName: actor?.name || 'Editor Desk',
      actorRole: actor?.role || 'ADMIN',
      action: isNowPublished ? 'PUBLISH_ARTICLE' : updates.status === 'REJECTED' ? 'REJECT_ARTICLE' : 'UPDATE_ARTICLE',
      targetId: updated.id,
      targetTitle: updated.title,
      details: updates.rejectionReason 
        ? `Rejection feedback: ${updates.rejectionReason}`
        : `Updated story. Status now: ${updated.status}`
    });

    return updated;
  }

  public deleteArticle(id: string, actor?: { name: string; role: string }): boolean {
    const index = this.articles.findIndex(a => a.id === id);
    if (index === -1) return false;
    const removed = this.articles.splice(index, 1)[0];

    this.addAuditLog({
      actorName: actor?.name || 'Administrator',
      actorRole: actor?.role || 'ADMIN',
      action: 'DELETE_ARTICLE',
      targetId: removed.id,
      targetTitle: removed.title,
      details: `Article removed from archive.`
    });

    return true;
  }

  public incrementViews(id: string): void {
    const article = this.articles.find(a => a.id === id || a.slug === id);
    if (article) {
      article.viewsCount += 1;
    }
  }

  public incrementShares(id: string): void {
    const article = this.articles.find(a => a.id === id || a.slug === id);
    if (article) {
      article.sharesCount += 1;
    }
  }

  // Categories
  public getCategories(): Category[] {
    return [...this.categories].sort((a, b) => a.order - b.order);
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.categories[index] = { ...this.categories[index], ...updates };
    return this.categories[index];
  }

  // Breaking News
  public getBreakingNews(): BreakingNews[] {
    return this.breakingNews
      .filter(b => b.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addBreakingNews(item: Omit<BreakingNews, 'id' | 'createdAt'>): BreakingNews {
    const created: BreakingNews = {
      id: 'break-' + Date.now(),
      createdAt: new Date().toISOString(),
      ...item
    };
    this.breakingNews.unshift(created);
    this.addAuditLog({
      actorName: 'Admin Desk',
      actorRole: 'ADMIN',
      action: 'ADD_BREAKING_NEWS',
      targetTitle: created.title,
      details: `Priority: ${created.priority}, Category: ${created.category}`
    });
    return created;
  }

  public toggleBreakingNews(id: string, isActive: boolean): boolean {
    const item = this.breakingNews.find(b => b.id === id);
    if (!item) return false;
    item.isActive = isActive;
    return true;
  }

  public deleteBreakingNews(id: string): boolean {
    const index = this.breakingNews.findIndex(b => b.id === id);
    if (index === -1) return false;
    this.breakingNews.splice(index, 1);
    return true;
  }

  // Feeds
  public getScheduledFeeds(): ScheduledFeed[] {
    return [...this.scheduledFeeds];
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const log: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.auditLogs.unshift(log);
    // Keep last 100 logs
    if (this.auditLogs.length > 100) {
      this.auditLogs.pop();
    }
  }

  // Users
  public getUsers(): User[] {
    return [...this.users];
  }

  // AI Feed Discovery Simulator / Real Fetcher
  public async triggerAiNewsDiscovery(): Promise<Article[]> {
    // Curated high-integrity authorized Indian news source templates
    const candidateStories = [
      {
        title: 'Bhopal Smart City to Launch AI Traffic Signals Across 45 Major Junctions',
        summary: 'Bhopal Traffic Police in coordination with the Smart City Development Corporation has finalized deployment of camera-integrated adaptive traffic controllers to reduce peak hour congestion by 35%.',
        categoryName: 'Bhopal',
        categoryId: 'cat-bhopal',
        sourceName: 'Bhopal Municipal Press Release',
        sourceUrl: 'https://bhopal.nic.in/smart-traffic-rollout-2026',
        coverImage: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1200&q=80',
        content: `BHOPAL — In a major modernization drive, the Bhopal Smart City Development Corporation Limited (BSCDCL) on Tuesday issued formal work orders for installing Artificial Intelligence-driven Adaptive Traffic Control Systems (ATCS) across 45 primary intersections.

The system relies on real-time computer vision sensors that gauge vehicle queue lengths, dynamically adjusting green signal intervals to alleviate bottlenecks at MP Nagar Board Office Square, Roshanpura, and Polytechnic Square.

Emergency ambulances and fire tenders will receive automated green wave preemption via GPS transponders installed in civic emergency fleets.

Municipal engineers affirmed that the project is slated for commissioning before the monsoon quarter, establishing Bhopal as a central Indian benchmark for intelligent urban transit.`,
        tags: ['Bhopal', 'Smart City', 'AI', 'Traffic', 'Madhya Pradesh'],
        confidence: 94,
        notes: 'Verified via Bhopal Municipal tender notification No. BSCDCL/2026/TR-89. Official sources confirmed on record.'
      },
      {
        title: 'India Semiconductor Mission Approves 2 New Commercial Packaging Facilities in Central India',
        summary: 'The Union Cabinet has accorded approval to two high-density advanced semiconductor packaging projects, unlocking ₹7,200 crore in collaborative investments.',
        categoryName: 'Technology',
        categoryId: 'cat-tech',
        sourceName: 'PIB Electronic Sector Bulletin',
        sourceUrl: 'https://pib.gov.in/PressReleaseISM-2026',
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        content: `NEW DELHI — Expanding India's sovereign electronics manufacturing footprint, the Union Cabinet chaired by the Prime Minister has cleared two advanced semiconductor packaging and assembly proposals under the India Semiconductor Mission (ISM).

The approved facilities will focus on Silicon Carbide (SiC) and Gallium Nitride (GaN) power modules catering to electric vehicles, high-speed rail converters, and 5G/6G telecom base stations.

Government subsidies covering up to 50% of the project capital expenditure will be disbursed on a pari-passu basis subject to milestone verification.

Industry leaders highlighted that establishing indigenous testing and packaging capacity reduces supply-chain exposure to geopolitical disruptions in East Asia.`,
        tags: ['Semiconductors', 'India Semiconductor Mission', 'Technology', 'Economy'],
        confidence: 97,
        notes: 'Full cabinet resolution verified via PIB Delhi release. Zero conflicting claims.'
      },
      {
        title: 'Madhya Pradesh Tourism Wins Global Ecotourism Award for Panna & Kanha Tiger Corridors',
        summary: 'The MP Tourism Board has received the United Nations Sustainable Ecotourism accolade in Berlin, recognizing community-led tiger reserve conservation and tribal homestay empowerment.',
        categoryName: 'Madhya Pradesh',
        categoryId: 'cat-mp',
        sourceName: 'MP Forest Dept & Tourism Bureau',
        sourceUrl: 'https://mpinfo.org/tourism-global-ecotourism-panna',
        coverImage: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
        content: `BERLIN/BHOPAL — Madhya Pradesh, widely celebrated as the Tiger State of India, has clinched the prestigious Global Sustainable Tourism Award at the International Tourism Bourse (ITB) in Berlin.

The jury commended the state's pioneering buffer-zone community tourism model across Panna, Kanha, and Bandhavgarh National Parks, where over 60% of guide and hospitality revenues directly benefit local indigenous families.

Forest Department officials noted that tiger numbers across MP reserves have maintained steady growth while zero poaching incidents have been recorded in the past 18 months, attributing success to solar-fenced perimeter monitoring and village participatory committees.`,
        tags: ['Madhya Pradesh', 'Panna', 'Kanha', 'Wildlife', 'Ecotourism', 'Tourism'],
        confidence: 93,
        notes: 'Cross-checked with ITB Berlin awards register and MP Tourism statement.'
      }
    ];

    const generatedArticles: Article[] = [];

    for (const item of candidateStories) {
      // Check if duplicate already exists by title
      const exists = this.articles.some(a => a.title.toLowerCase().includes(item.title.toLowerCase().slice(0, 30)));
      if (!exists) {
        // ALWAYS SAVED AS PENDING_REVIEW as per prompt rules!
        const newArt = this.createArticle({
          title: `AI Draft: ${item.title}`,
          summary: item.summary,
          content: item.content,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          coverImage: item.coverImage,
          authorId: 'ai-engine',
          authorName: 'Bharat AI Newsbot',
          authorRole: 'AI_SYSTEM',
          status: 'PENDING_REVIEW', // CRITICAL: NEVER AUTO-PUBLISHED!
          isAiGenerated: true,
          aiConfidenceScore: item.confidence,
          factCheckNotes: item.notes,
          conflictingFlags: [],
          sourceUrl: item.sourceUrl,
          sourceName: item.sourceName,
          tags: item.tags,
          isBreaking: false,
          isFeatured: false
        }, { name: 'Bharat AI Engine', role: 'AI_SYSTEM' });

        generatedArticles.push(newArt);
      }
    }

    // Update scheduled feeds timestamp
    this.scheduledFeeds.forEach(feed => {
      feed.lastFetchedAt = new Date().toISOString();
      feed.itemsProcessed += Math.floor(Math.random() * 3) + 1;
    });

    return generatedArticles;
  }
}

// Global singleton across hot reloads in Next.js development
const globalForDb = global as unknown as { dbService: DatabaseService };
export const db = globalForDb.dbService || new DatabaseService();
if (process.env.NODE_ENV !== 'production') globalForDb.dbService = db;
