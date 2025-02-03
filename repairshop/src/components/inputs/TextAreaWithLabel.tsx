"use client";

import { useFormContext } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormLabel,
    FormItem,
    FormMessage,
} from '@/components/ui/form';

import { Textarea } from "@/components/ui/textarea";
import { TextareaHTMLAttributes } from "react";

type Props<T> = {
    fieldTitle: string,
    nameInSchema: keyof T & string,
    className?: string,
} & TextareaHTMLAttributes<HTMLTextAreaElement>;


export function TextAreaWithLabel<T>({
    fieldTitle, nameInSchema, className, ...props
}: Props<T>) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem>
                    <FormLabel
                        className="text-base mb-2"
                        htmlFor={nameInSchema}
                        >
                            {fieldTitle}
                        </FormLabel>

                        <FormControl>
                            <Textarea
                                id={nameInSchema}
                                className={className}
                                {...props}
                                {...field}
                            />
                        </FormControl>

                        <FormMessage />
                </FormItem>
            )}
        />
    )
}