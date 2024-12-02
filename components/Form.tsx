"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Usuário é obrigatório (Deve conter mais de duas letras).",
    }),
    roomId: z.coerce.number().min(1, {
        message: "Digite um valor númerico para a sala (1-100)"
    })
})

export function InputForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            roomId: 1
        }
    })
    const router = useRouter();
    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        console.log(data)
        const params = new URLSearchParams({
            id: data.username,
            room: `room-${data.roomId}`,
          });
          router.push(`/purgatory?${params.toString()}`);
        return
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col gap-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Apelido carinhoso" {...field} />
                            </FormControl>
                            <FormDescription>
                                Este será o seu nome durante o jogo.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="roomId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>RoomID</FormLabel>
                            <FormControl>
                                <Input type="tel" placeholder="N° da sala" {...field} />
                            </FormControl>
                            <FormDescription>
                                A sala que seus amigos estão te esperando (Esperamos que você tenha amigos)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="ml-auto" type="submit">Invadir</Button>
            </form>
        </Form>
    )
}