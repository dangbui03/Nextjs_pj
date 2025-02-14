"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { InputWithLabels } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";

import { insertTicketSchema, type insertTicketSchemaType, type selectTicketSchemaType } from "@/zod-schemas/ticket";
import { selectCustomerSchemaType } from "@/zod-schemas/customer";
import { custom } from "zod";

type Props = {
    customer: selectCustomerSchemaType,
    ticket?: selectTicketSchemaType,

}

export default function TicketForm({ 
    customer, ticket 
}: Props) {
    const defaultValues: insertTicketSchemaType = {
        id: ticket?.id || "(New)",
        customerId: ticket?.customerId ?? customer.id,
        title: ticket?.title || "",
        description: ticket?.description || "",
        completed: ticket?.completed || false,
        tech: ticket?.tech || "new-ticket@example.com",
    }

    const form = useForm<insertTicketSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(insertTicketSchema),
        defaultValues,
    });

    async function submitForm(data: insertTicketSchemaType){
            console.log(data);
        };
    
        return (
            <div className="flex flex-col gap-1 sm:px-8">
                <div>
                    <h2 className="text-2xl font-bold">
                        {ticket?.id ? "Edit" : "New"} Ticket {ticket?.id ? `# ${ticket.id}` : "Form"} 
                    </h2>
                </div>
                <Form {...form}>
                    <form
                        onSubmit = {form.handleSubmit(submitForm)}
                        className="flex flex-col md:flex-row gap-4 md:gap-8"
                    >
                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <InputWithLabels<insertTicketSchemaType>
                                fieldTitle="Title"
                                nameInSchema="title"
                                />
                            <InputWithLabels<insertTicketSchemaType>
                                fieldTitle="Tech"
                                nameInSchema="tech"
                                readOnly={true}
                                />

                            {/* check box */}

                            <div className="mt-4 space-y-2">
                                <h3 className="text-lg">Customer Info</h3>
                                <hr className="w=4/5" />
                                <p>{customer.firstName} {customer.lastName}</p>
                                <p>{customer.address1}</p>
                                {customer.address2 ? <p>{customer.address2}</p>: null}
                                <p>{customer.city}, {customer.state} {customer.zip}</p>
                                <hr className="w-4/5"/>
                                <p>{customer.email}</p>
                                <p>Phone: {customer.phone}</p>
                            </div>

                        </div>

                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            
                        </div>

                        {/* <p>
                            {JSON.stringify(form.getValues())}
                        </p> */}
                    </form>
                </Form>
            </div>
        )
}

