'use client'

import { usePlayerSocket } from '@/hooks/usePlayerSocket'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUp, Check, ChevronLeft, ChevronRight, Hourglass } from "lucide-react"
import toast from 'react-hot-toast'

const DrawerTest = ({ deck, sendCard }: { deck: string[], sendCard: (card: string) => void }) => {
  const [selected, setSelected] = useState("")

  return (
    <>
      {selected && <Check onClick={() => sendCard(selected)} className='z-10 cursor-pointer bg-white text-green-500 p-3 size-12 rounded-full border border-neutral-300 shadow-sm absolute bottom-8 left-1/2 -translate-x-1/2' />}
      <Drawer>
        <DrawerTrigger>
          {!selected && <ArrowUp className='z-10 bg-white p-3 size-12 rounded-full border border-neutral-300 shadow-sm absolute bottom-8 left-1/2 -translate-x-1/2' />}
          {selected && <span className='left-1/2 -translate-x-1/2 bottom-0 translate-y-1/4 text-start text-sm md:text-base rounded-xl p-4 font-semibold border border-neutral-300 bg-neutral-50 text-neutral-800 absolute h-[300px] w-[200px]'>{selected}</span>}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Qual atrocidade você dirá hoje?</DrawerTitle>
            <DrawerDescription>Relaxa, o pior que pode acontecer é a Policia Federal descobrir ;)</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className='h-[400px]'>
            <ul className='grid grid-cols-2 px-4 gap-4'>
              {deck?.map((card, key) => (
                <DrawerClose key={key}>
                  <li onClick={() => setSelected(card)} className='cursor-pointer select-none border border-neutral-300 h-28 text-start text-xs md:text-sm p-4 rounded shadow'>{card}</li>
                </DrawerClose>
              ))}
            </ul>
          </ScrollArea>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button className='md:py-6'>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

const VotingSection = ({votingMap, voteFnc}: {votingMap: object, voteFnc: (card: string) => void}) => {
  const [index, setIndex] = useState(0)
  const cards = Object.entries(votingMap).map(([card, {author}]) => ({card, author}))

  const nextCard = () => setIndex(index !== cards.length-1 ? index+1 : 0)
  const previousCard = () => setIndex(index !== 0 ? index-1 : cards.length-1)
  return (
      <div className='select-none'>
        {cards[index] && 
        <span className='bottom-12 right-1/2 translate-x-1/2 text-start text-sm md:text-base rounded-xl p-4 font-semibold border border-neutral-300 bg-neutral-50 text-neutral-800 absolute h-[300px] w-[200px]'>
          {cards[index].card}
          <p className="absolute bottom-4 text-sm font-normal italic right-4">- {cards[index].author}</p>
        </span>
        }
        {!cards[index] && <Hourglass className='size-16 animate-pulse text-slate-400 absolute right-1/2 translate-x-1/2 bottom-1/4 -translate-y-1/2'/>}
        <ChevronLeft onClick={previousCard} className='md:left-[calc(50%_-_150px)] md:-translate-x-1/2 md:bottom-1/3 left-8 bottom-1/2 translate-y-1/2 cursor-pointer z-10 bg-white p-3 size-12 rounded-full border border-neutral-300 shadow-sm absolute'/>
        <ChevronRight onClick={nextCard} className='md:right-[calc(50%_-_150px)] md:translate-x-1/2 md:bottom-1/3 right-8 bottom-1/2 translate-y-1/2 cursor-pointer z-10 bg-white p-3 size-12 rounded-full border border-neutral-300 shadow-sm absolute'/>
        <Check onClick={() => voteFnc(cards[index].card)} className='md:right-[calc(50%_-_150px)] md:translate-x-1/2 md:bottom-28 bottom-12 right-8 cursor-pointer z-10 bg-white p-3 size-12 rounded-full border border-neutral-300 shadow-sm absolute text-green-500'/>
      </div>
  )
}

export default function Home() {
  const params = useSearchParams()
  const id = params.get("id")
  const room = params.get("room")

  const [question, setQuestion] = useState('')
  const [cards, setCards] = useState<string[]>([])
  const [votingFase, setVotingFase] = useState({})
  const [hasSended, setHasSended] = useState(false)

  const socket = usePlayerSocket({ query: { roomId: room, id: id } });

  const sendCard = (card: string) => {
    setHasSended(true)
    socket.emit("sendCard", id, card)
  }

  const voteCard = (card: string) => {
    setQuestion('')
    setCards([])
    setHasSended(false)
    socket.emit("vote", id, card)
  }

  const showWinner = (winners: string[][]) => {
    winners.forEach(([card, author]) => {
      toast.success(`${author} venceu com: "${card}"`, {position: 'bottom-center'})
    })
  }

  useEffect(() => {
    socket?.on("newRound", (question: string) => {
      setQuestion(question)
      socket?.emit("getCards", room, id, setCards)
    })
    socket?.on("votingFase", setVotingFase)
    socket?.on("winner", showWinner)
    return () => { socket?.emit("unregister", id) }
  }, [socket, id, room])

  return (
    <main className="w-full h-[100dvh] bg-neutral-200 text-black">
      <span className='whitespace-pre-line select-none left-1/2 -translate-x-1/2 shadow-lg top-6 text-sm md:text-base rounded-xl p-4 font-semibold bg-neutral-900 text-neutral-200 absolute h-[300px] w-[200px]'>{question}</span>
      {!question && <Hourglass className='size-16 animate-pulse text-slate-400 absolute right-1/2 translate-x-1/2 bottom-1/4 -translate-y-1/2'/>}
      {!hasSended && <DrawerTest deck={cards} sendCard={sendCard} />}
      {hasSended && <VotingSection voteFnc={voteCard} votingMap={votingFase}/>}
    </main>
  )
}
