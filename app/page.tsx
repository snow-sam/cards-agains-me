import * as React from "react"

import { InputForm } from "@/components/Form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardWithForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Bem-vindo ao Cards Against Me!</CardTitle>
        <CardDescription className="text-xs">Esta é sua chance de calar quem acreditou em você.</CardDescription>
      </CardHeader>
      <CardContent>
        <InputForm/>
      </CardContent>
    </Card>
  )
}


const Home = () => {
  return (
    <main className="w-full p-4 h-[100dvh] bg-neutral-100 text-black flex flex-col items-center justify-center">
      <CardWithForm />
    </main>
  )
}
export default Home