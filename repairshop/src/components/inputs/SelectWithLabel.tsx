"use client";

import { useFormContext } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormLabel,
    FormItem,
    FormMessage,
} from '@/components/ui/form';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DataObject = {
    id: string,
    description: string,
};

type Props<T> = {
    fieldTitle: string,
    nameInSchema: keyof T & string,
    data: DataObject[],
    className?: string,
};

export function SelectWithLabel<T>({ 
    fieldTitle, nameInSchema, data, className
}: Props<T>) {
    const form = useFormContext();

    // animation for the label
    return (
        <FormField
            control={form.control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem>
                    <FormLabel
                        className="text-base"
                        htmlFor={nameInSchema}
                        >
                            {fieldTitle}
                        </FormLabel>

                        <Select
                            {...field}
                            onValueChange={field.onChange}
                        >

                            <FormControl>
                                <SelectTrigger
                                    id={nameInSchema}
                                    className={`w-full max-w-xs ${className}`}
                                    >
                                        <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                                {data.map(item => (
                                    <SelectItem 
                                        key={`${nameInSchema}_${item.id}`}
                                        value={item.id}
                                        >
                                            {item.description}
                                        </SelectItem>
                                ))}
                            </SelectContent>

                        </Select>
                        <FormMessage />
                </FormItem>
            )}
        />
    )
}