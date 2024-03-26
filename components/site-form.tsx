"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { checkUrl } from "@/lib/wordpress";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";

const httpRegex = /^(http|https):/
const completeUrlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/

const FormSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: "Please enter a name for your site."
        })
        .max(255, {
            message: "Name must be less than 255 characters."
        }),
    url: z
        .string()
        .min(1, {
            message: "Please enter a URL for your site."
        })
        .max(255, {
            message: "URL must be less than 255 characters."
        })
        .transform((val, ctx) => {
            let completeUrl = val;
            // Prepend https:// if the URL 
            // doesn't start with http:// or https:// 
            if (!httpRegex.test(completeUrl)) {
                completeUrl = `https://${completeUrl}`;
            }
            // If the URL is still invalid, display an error message
            // and pass the fatal flag to abort the validation process early
            // This prevents unnecessary requests to the server to check
            // if the URL is a WordPress site
            if (!completeUrlRegex.test(completeUrl)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    fatal: true,
                    message: "Please enter a valid URL",
                });
                return z.NEVER;
            }
            return completeUrl;
        })
        // This refinement checks if the URL is a WordPress site
        // It only runs if the URL is valid
        .refine(async (completeUrl) => 
            completeUrl && await checkUrl(completeUrl), { 
                message: "Uh oh! That doesn't look like a WordPress site.",
        })
});

export const SiteForm = () => {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            url: "",
        },
        mode: "onChange"
    })

    const { 
        getFieldState, 
        setValue,
        trigger,
        handleSubmit,
        clearErrors,
        register,
        unregister,
        control,
        formState,
        formState: { 
            isValidating,
        } 
    } = form;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: keyof z.infer<typeof FormSchema>
    ) => {
        const { value } = e.target;
        setValue(fieldName, value, { shouldDirty: true, shouldValidate: true });
        console.log(`${fieldName}: `, value);
    }; 

    const onSubmit = (values: z.infer<typeof FormSchema>) => {
        console.log(values, "values")
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Create Your Website</CardTitle>
                        <CardDescription>Tell us about your new site to get started.</CardDescription>
                        <CardContent className="py-6 px-0 space-y-4">
                            <FormField 
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                onChange={(e) => handleChange(e, field.name)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field} 
                                                onChange={(e) => handleChange(e, field.name)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="justify-end py-0 px-0">
                            <Button>Get Started</Button>
                        </CardFooter>
                    </CardHeader>
                </Card>
            </form>
        </Form>
    )
}