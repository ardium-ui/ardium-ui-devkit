import { compareTwoStrings, findBestMatch } from 'string-similarity';

export function findBestSuggestions<T extends string>(toMatch: string, suggestions: Readonly<T[]>): T[];
export function findBestSuggestions<T extends Exclude<any, string>>(toMatch: string, suggestions: Readonly<T[]>, mapFn: (v: T) => string): T[];
export function findBestSuggestions<T>(toMatch: string, suggestions: Readonly<T[]>, mapFn?: (v: T) => string): T[] {
  //map non-string values to strings, if needed
  const suggestionStrings = suggestions.map(v => (typeof v == 'string' ? v : mapFn!(v)));

  //* alternative method for single-char strings
  //the similarity algorithm always returns zero in this case
  if (toMatch.length == 1) {
    return (
      suggestionStrings
        //remember the original indexes
        .map((v, index) => ({ str: v, index }))
        //pick only the ones starting with the character to match
        .filter(v => v.str.startsWith(toMatch))
        //map to string length and index
        .map(v => ({ rating: v.str.length, index: v.index }))
        //sort by length, ascending
        .sort((a, b) => a.rating - b.rating)
        //map to original values
        .map(v => suggestions[v.index])
    );
  }

  //* standard method
  return (
    suggestionStrings
      //map to ratings of similarity between the string and toMatch
      .map((v, index) => {
        //always include if starts with the value to match
        if (new RegExp(`^${toMatch}`, 'i').test(v)) return { rating: 1_000 - v.length, index };

        //calculate conditional similarity
        const similarity = compareTwoStrings(toMatch, v);
        const foundTerm = v.match(new RegExp(toMatch, 'ig'))?.[0];
        const foundIndex = foundTerm ? v.indexOf(foundTerm) : -1;
        const canBeFound = foundIndex != -1;
        const foundIndexModifier = canBeFound ? (Math.cos((foundIndex / 90) * Math.PI) + 1) ** 2 / 1.5 : 1;
        const rating = similarity * foundIndexModifier;
        return {
          rating,
          index,
        };
      })
      //keep only ratings above or equal to 0.45
      .filter(v => v.rating >= 0.45)
      //sort descending
      .sort((a, b) => b.rating - a.rating)
      //map to original values
      .map(v => suggestions[v.index])
  );
}

export function findBestAutocomplate(toMatch: string, autocompletes: string[]): string {
  const autocompletesStartingWith = autocompletes.filter(v => new RegExp(`^${toMatch}`, 'i').test(v));
  return findBestMatch(toMatch, autocompletesStartingWith).bestMatch.target;
}
