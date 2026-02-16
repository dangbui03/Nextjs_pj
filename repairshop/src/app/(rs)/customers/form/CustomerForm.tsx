"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { InputWithLabels } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"

import { insertCustomerSchema, type insertCustomerSchemaType, type selectCustomerSchemaType } from "@/zod-schemas/customer";

import { useAction } from "next-safe-action/hooks";
import { saveCustomerAction } from "@/app/actions/saveCustomerAction";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";

import { StatesArray } from "@/constants/StatesArray";

type Props = {
    customer?: selectCustomerSchemaType;
}

export default function CustomerForm({ customer }: Props) {
    const { getPermission, isLoading } = useKindeBrowserClient();
    const isManager = !isLoading && getPermission('manager')?.isGranted;

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
        active: customer?.active || true,
    }
    const form = useForm<insertCustomerSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(insertCustomerSchema),
        defaultValues,
    });

    const {
        execute: executeSave,
        result: saveResult,
        isPending: isSaving,
        reset: resetSaveAction,
    } = useAction(saveCustomerAction, {
        onSuccess({ data }) {
            if (data?.message) {
                toast.success("Success!!", {
                    description: data?.message || "Customer saved successfully.",
                })
            }
        },
        onError({ error }) {
            toast.error("Error!!", {
                description: error?.serverError || "Failed to save customer.",
            })
        }
    });

    async function submitForm(data: insertCustomerSchemaType){
        // console.log(data);
        executeSave({ ...data, firstName: '', phone: '' });
    };

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <DisplayServerActionResponse result={saveResult} />
            <div>
                <h2 className="text-2xl font-bold">
                    {customer?.id ? "Edit" : "New"} Customer {customer?.id ? `#${customer.id}` : "From"}
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
                        {isLoading ? <p>Loading ...</p> : isManager && customer?.id ? (
                            <CheckboxWithLabel<insertCustomerSchemaType>
                                fieldTitle="Active"
                                nameInSchema="active"
                                message="Yes"
                                />
                            ) : null}

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                className="w-3/4"
                                variant="default"
                                title="Save"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <LoaderCircle className="animate-spin" /> Saving...
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="destructive"
                                title="Reset"
                                onClick={() => {
                                    form.reset(defaultValues);
                                    resetSaveAction();
                                }}
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