import { create } from "zustand";

export interface ISort{
    sortValue:string,
    setSortValue:()=>void
}

export const useSortStore=create((set)=>(
{
    sortValue:"",
    setSortValue:(newSortValue:string)=>set({sortValue:newSortValue})
}
))