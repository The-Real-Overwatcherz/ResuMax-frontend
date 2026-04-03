import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { MinusIcon, PlusIcon } from 'lucide-react'

export interface AccordionItemData {
  value: string;
  title: string;
  content: string;
}

interface Accordion4Props {
  items: AccordionItemData[];
}

const Accordion4 = ({ items }: Accordion4Props) => {
  return (
    <Accordion className='w-full space-y-2' type="multiple" defaultValue={[items[0].value]}>
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          className='rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-sm transition-shadow data-[state=open]:shadow-[0_0_20px_rgba(255,255,255,0.05)] overflow-hidden'
        >
          <AccordionTrigger className='px-5 [&_[data-slot=accordion-trigger-icon]]:hidden'>
            <span className='flex w-full items-center justify-between gap-4'>
              <span className="font-bold text-lg text-white">{item.title}</span>
              <span className='relative size-4 shrink-0 text-zinc-400'>
                <PlusIcon className='absolute inset-0 size-3 group-aria-expanded/accordion-trigger:hidden' />
                <MinusIcon className='absolute inset-0 hidden size-3 group-aria-expanded/accordion-trigger:block' />
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className='px-5 pb-5 text-sm md:text-base text-zinc-400 leading-relaxed font-medium'>
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default Accordion4
