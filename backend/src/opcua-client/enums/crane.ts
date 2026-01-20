export enum CraneStates {
    idle = 0, // Kraan is idle en klaar voor opdracht
    moving_1 = 1, // Kraan beweegt naar eerste punt
    grabbing = 2, // Kraan is op eerste punt en pakt blokje op
    moving_2 = 3, // Kraan beweegt van eerste naar tweede punt
    depositing = 4, // Kraan legt blokje neer
    moving_3 = 5, // Kraan beweegt naar veilige positie.
    startup = 100, // Kraan is opgestart
    calibration = 200 // Kraan is gekalibreerd 
}

export enum CraneDestinations {
    unknown = 0,
    idle = 1,
    oven = 2,
    warehouse = 3,
    sorter_left = 4,
    sorter_mid = 5,
    sorter_right = 6
}