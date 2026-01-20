export enum OvenStates {
    Idle = 0, // De oven is klaar om te starten.
    Doors_1 = 1, // De voorste deuren van de oven openen/sluiten.
    Action_1 = 2, // De oven heeft een blokje in de oven.
    Doors_2 = 3, // De achterste deuren van de oven openen/sluiten.
    Moving_1 = 4, // Het blokje beweegt naar de bewerkingsplaats met de zuignap.
    Action_2 = 5, // Een blokje is aan het bewerken.
    Moving_2 = 6, // Het blokje wordt naar de loopband verplaats met de zuignap.
    Action_3 = 7, // De oven heeft het blokje op de loopband gelegd.
}