export enum WarehouseStates {
    Idle = 0, // Het magazijn is klaar om te bewegen.
    Moving_1 = 1, // Het magazijn beweegt naar de startpositie.
    Action_1 = 2, // Het magazijn pakt het blokje op.
    Moving_2 = 3, // Het magazijn beweegt naar de assignment positie.
    Action_2 = 4, // Het magazijn zet het blokje weg/pakt een nieuw blokje op.
    Moving_3 = 5, // Het magazijn beweegt terug naar de start positie.
    Action_3 = 6, // Het magazijn zet het blokje neer.
    Moving_4 = 7, // Het magazijn beweegt terug naar standaard positie.
}

export enum WarehouseActions {
    Take = 0, // Haal een blokje op uit het magazijn
    Store = 1 // Plaats een blokje terug in het magazijn.
}

export interface Destination {
    row: number;
    col: number;
}