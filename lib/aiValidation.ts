import { supabase } from './supabase';

const categoryKeywords: Record<string, string[]> = {
  'Electronics': ['phone', 'laptop', 'computer', 'tablet', 'camera', 'tv', 'monitor', 'keyboard', 'mouse', 'headphones', 'speaker'],
  'Furniture': ['chair', 'table', 'sofa', 'bed', 'desk', 'cabinet', 'shelf', 'couch', 'dresser'],
  'Clothes': ['shirt', 'pants', 'dress', 'jacket', 'shoes', 'boots', 'hat', 'sweater', 'jeans', 'coat'],
  'Books': ['book', 'novel', 'magazine', 'textbook', 'comic', 'journal', 'manual', 'guide'],
  'Home Appliances': ['refrigerator', 'microwave', 'oven', 'washer', 'dryer', 'dishwasher', 'blender', 'toaster'],
  'Vehicles': ['car', 'motorcycle', 'bike', 'bicycle', 'truck', 'van', 'scooter', 'vehicle'],
  'Tools': ['hammer', 'drill', 'saw', 'wrench', 'screwdriver', 'toolbox', 'ladder', 'pliers'],
  'Sports & Fitness': ['gym', 'weights', 'treadmill', 'ball', 'bike', 'yoga', 'fitness', 'exercise', 'sports'],
  'Others': []
};

export async function validateListingCategory(
  title: string,
  description: string,
  selectedCategoryId: string
): Promise<{ isValid: boolean; suggestedCategoryId?: string; suggestedCategoryName?: string }> {
  try {
    const { data: selectedCategory } = await supabase
      .from('categories')
      .select('name')
      .eq('id', selectedCategoryId)
      .single();

    if (!selectedCategory) {
      return { isValid: false };
    }

    const text = `${title} ${description}`.toLowerCase();

    const selectedKeywords = categoryKeywords[selectedCategory.name] || [];
    const hasMatchingKeyword = selectedKeywords.some(keyword =>
      text.includes(keyword.toLowerCase())
    );

    if (hasMatchingKeyword || selectedCategory.name === 'Others') {
      return { isValid: true };
    }

    let bestMatch = '';
    let bestMatchScore = 0;

    for (const [categoryName, keywords] of Object.entries(categoryKeywords)) {
      const matchCount = keywords.filter(keyword =>
        text.includes(keyword.toLowerCase())
      ).length;

      if (matchCount > bestMatchScore) {
        bestMatchScore = matchCount;
        bestMatch = categoryName;
      }
    }

    if (bestMatch && bestMatchScore > 0) {
      const { data: suggestedCategory } = await supabase
        .from('categories')
        .select('id, name')
        .eq('name', bestMatch)
        .single();

      if (suggestedCategory) {
        return {
          isValid: false,
          suggestedCategoryId: suggestedCategory.id,
          suggestedCategoryName: suggestedCategory.name
        };
      }
    }

    return { isValid: true };
  } catch (error) {
    console.error('AI validation error:', error);
    return { isValid: true };
  }
}
