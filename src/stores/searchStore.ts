import {create} from "zustand";

export interface ISearch{
    query:string,
    setQuery:()=>void,
    clearQuery:()=>void
}
// Following is the store I created to handle the search bar functionality.
// Note the structure for future references!
export const useSearchStore = create((set) => ({
    query: '',
    setQuery: (newQuery:string) => set({ query: newQuery }),
    clearQuery:()=>set({query:''})
  }));