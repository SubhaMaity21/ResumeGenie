import {z} from "zod";

export const formSchema = z.object({
    title: z.string().min(2, "Title is required"),
    file: z
        .any()
        .refine((file) => file?.[0], "Please select a PDF file")
        .refine(
            (file) => file?.[0]?.type === "application/pdf",
            "Only PDF files allowed"
        ),
});