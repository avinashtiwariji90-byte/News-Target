import { Article } from './types';

export type LanguageCode = 'hi' | 'en';

export function getArticleLanguageContent(article: Article, lang: LanguageCode) {
  if (lang === 'hi') {
    return {
      title: article.titleHi || article.title,
      summary: article.summaryHi || article.summary,
      content: article.contentHi || article.content,
      readTimeLabel: `${article.readingTimeMinutes} मिनट पढ़ने में`,
      authorPrefix: 'द्वारा:',
      categoryLabel: getCategoryHindiName(article.categoryName),
      shareWhatsAppText: `📰 *${article.titleHi || article.title}*\n\nभारत बुलेटिन पर पूरी ख़बर पढ़ें:`,
      sourceLabel: 'प्रामाणिक स्रोत एवं संदर्भ',
      highlightsLabel: 'मुख्य समाचार बिंदु',
      recommendedLabel: 'संबंधित मुख्य समाचार'
    };
  }

  return {
    title: article.title,
    summary: article.summary,
    content: article.content,
    readTimeLabel: `${article.readingTimeMinutes} min read`,
    authorPrefix: 'By:',
    categoryLabel: article.categoryName,
    shareWhatsAppText: `📰 *${article.title}*\n\nRead full report on News Target:`,
    sourceLabel: 'Original Source & Reference',
    highlightsLabel: 'Key Story Highlights',
    recommendedLabel: `Recommended Stories in ${article.categoryName}`
  };
}

export function getCategoryHindiName(englishName: string): string {
  const map: Record<string, string> = {
    'All News': 'सभी समाचार',
    'Madhya Pradesh': 'मध्य प्रदेश',
    'Bhopal': 'भोपाल',
    'India': 'देश / भारत',
    'Politics': 'राजनीति',
    'AI': 'आर्टिफिशियल इंटेलिजेंस (AI)',
    'Technology': 'तकनीक व विज्ञान',
    'Business': 'व्यापार व बाज़ार',
    'Education': 'शिक्षा',
    'Sports': 'खेल',
    'World': 'विश्व समाचार',
    'Entertainment': 'मनोरंजन'
  };

  return map[englishName] || englishName;
}
