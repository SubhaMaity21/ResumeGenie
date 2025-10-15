import { create } from "zustand";

interface PdfStore {
    title: string;
    paragraph: string;
    summary: string;
    setPdfData: (title: string, paragraph: string, summary: string) => void;
    clearPdfData: () => void;
}

export const usePdfStore = create<PdfStore>((set) => ({
    title: "",
    paragraph: "",
    summary: "",
    setPdfData: (title, paragraph, summary) => set({ title, paragraph, summary }),
    clearPdfData: () => set({ title: "", paragraph: "", summary: "" }),
}));
