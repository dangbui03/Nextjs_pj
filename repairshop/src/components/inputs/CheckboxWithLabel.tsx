"use client";

import { useFormContext } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormLabel,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

type Props<T> = {
    fieldTitle: string,
    nameInSchema: keyof T & string,
    message: string,
    disabled?: boolean,
} 

export function CheckboxWithLabel<T>({ 
    fieldTitle, nameInSchema, message, disabled = false
}: Props<T>) {
    const form = useFormContext();

    // animation for the label
    return (
        <FormField
            control={form.control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem className="w-full flex items-center gap-2">
                    <FormLabel
                        className="text-base w-1/3 mt-2"
                        htmlFor={nameInSchema}
                        >
                            {fieldTitle}
                        </FormLabel>

                        <div className="flex items-center gap-2"> 
                            <FormControl>
                                <Checkbox
                                    id={nameInSchema}
                                    {...field}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                            {message}
                        </div>

                        <FormMessage />
                </FormItem>
            )}
        />
    )
}