export enum ConveyerStates {
    Idle = 0, // De loopband is klaar om te starten.
    Action_1 = 1, // De loopband heeft een blokje ontvangen en is gestart met bewegen.
    Action_2 = 2, // De loopband heeft een kleur gedetecteerd.
    Action_3 = 3, // De loopband is het blokje aan het sorteren.
}

export enum Colors {
    Red = 0,
    White = 1,
    Blue = 2,
}