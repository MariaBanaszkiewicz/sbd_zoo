# sbd_zoo

### Bugi:  
18. podczas przypisywania klimatu do gatunku nie wyświeta się error z backendu (widok szczegółów gatunku)
19. przycisk do edycji klimatu (w widoku szczegółów gatunku) przenosi do modala wyboru klimatu a nie do jego edycji  
20. update porcji nie działa (po stronie backendu)
21. nie wyświetla się error przychodziący z backendu w modalu porcji - to samo dotyczy się innych modali np dodawanie/update treatments oraz dodawanie zadań
22. randomowo pojawiający się bug opisany w issue


### Errory:
Obowiązkowo:
1. po kliknięciu zapisz w każdym formularzu (tworzenie / update) (najczęsciej to błędy w stylu istniejącej już nazwy etc)
2. przy usuwaniu (szczególnie tam gdzie są zabezpieczenia przeciw cascade: klimaty, pracownicy, zagrody, gatunki)
3. przy wybieraniu z modala (np. dodawanie pracownika do zagrody/teamu lub klimatu do gatunku) (błąd np. gdy pracownik znajduje się już w teamie)  

Można też:
2. w widokach w których pobiera się dane z bazy wyświetlić error jeżeli się to nie powiodło
