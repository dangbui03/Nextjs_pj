"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { InputWithLabels } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";

import { insertCustomerSchema, type insertCustomerSchemaType, type selectCustomerSchemaType } from "@/zod-schemas/customer";

import { StatesArray } from "@/constants/StatesArray";

type Props = {
    customer?: selectCustomerSchemaType;
}

export default function CustomerForm({ customer }: Props) {
    const defaultValues: insertCustomerSchemaType = {
        id: customer?.id || 0,
        firstName: customer?.firstName || "",
        lastName: customer?.lastName || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        address1: customer?.address1 || "",
        address2: customer?.address2 || "",
        city: customer?.city || "",
        state: customer?.state || "",
        zip: customer?.zip || "",
        notes: customer?.notes || "",
    }
    const form = useForm<insertCustomerSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(insertCustomerSchema),
        defaultValues,
    });

    async function submitForm(data: insertCustomerSchemaType){
        console.log(data);
    };

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <div>
                <h2 className="text-2xl font-bold">
                    {customer?.id ? "Edit" : "New"} Customer Form
                </h2>
            </div>
            <Form {...form}>
                <form
                    onSubmit = {form.handleSubmit(submitForm)}
                    className="flex flex-col md:flex-row gap-4 md:gap-8"
                >
                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <InputWithLabels<insertCustomerSchemaType>
                            fieldTitle="First Name"
                            nameInSchema="firstName"
                            />
                        <InputWithLabels<insertCustomerSchemaType>
                            fieldTitle="Last Name"
                            nameInSchema="lastName"
                            />
                        <InputWithLabels<insertCustomerSchemaType>
                            fieldTitle="Address 1"
                            nameInSchema="address1"
                            />
                        <InputWithLabels<insertCustomerSchemaType>
                            fieldTitle="Address 2"
                            nameInSchema="address2"
                            />
                        <InputWithLabels<insertCustomerSchemaType>
                            fieldTitle="City"
                            nameInSchema="city"
                            />
                        <SelectWithLabel<insertCustomerSchemaType>
                            fieldTitle="State"
                            nameInSchema="state"
                            data={StatesArray}
                            />
                    </div>

                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <InputWithLabels<insertCustomerSchemaType>
                            fieldTitle="Zip Code"
                            nameInSchema="zip"
                            />
                        <InputWithLabels<insertCustomerSchemaType>
                            fieldTitle="Email"
                            nameInSchema="email"
                            />
                        <InputWithLabels<insertCustomerSchemaType>
                            fieldTitle="Phone"
                            nameInSchema="phone"
                            />

                        <TextAreaWithLabel<insertCustomerSchemaType>
                            fieldTitle="Notes"
                            nameInSchema="notes"
                            className="h-40"
                            />

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                className="w-3/4"
                                variant="default"
                                title="Save"
                            >
                                Save
                            </Button>

                            <Button
                                type="button"
                                variant="destructive"
                                title="Reset"
                                onClick={() => form.reset(defaultValues)}
                            >
                                Reset    
                            </Button>
                        </div>

                    </div>

                    {/* <p>
                        {JSON.stringify(form.getValues())}
                    </p> */}
                </form>
            </Form>
        </div>
    )
}