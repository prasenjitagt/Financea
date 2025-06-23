import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface UrlsShowToolTipProps {
    originalNote: string,
    slicedNote: string
}

export default function NotesShowToolTip({ originalNote, slicedNote }: UrlsShowToolTipProps) {

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="font-semibold">{slicedNote}</TooltipTrigger>
                <TooltipContent>
                    <p >{originalNote}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
