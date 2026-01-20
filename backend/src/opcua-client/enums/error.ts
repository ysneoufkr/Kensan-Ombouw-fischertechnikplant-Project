export enum Error {
    No_error = 0,
    Unknown_error = 1, // De error is niet gedefinieerd, zie de error message.
    Invalid_assignment = 2, // Er is een fout in de assignment.
    System_error = 3, // Er is iets fout gegaan in de code waardoor de actie niet kon worden voltooid.
    Machine_error = 4, // Er is een fout in de fabriek waardoor de actie niet kon worden voltooid.
    Calibration_error = 5, // De machine kan niet starten omdat deze nog niet is gekalibreerd
}