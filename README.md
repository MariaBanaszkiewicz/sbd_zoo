# sbd_zoo

### Bugi:  
12. przy dodaniu do zespołu pracownika, który już w nim jest, dostajemy error "Podany pracownik jest już zatrudniony."  


### Errory:
Obowiązkowo:
1. po kliknięciu zapisz w każdym formularzu (tworzenie / update) (najczęsciej to błędy w stylu istniejącej już nazwy etc)
2. przy usuwaniu (szczególnie tam gdzie są zabezpieczenia przeciw cascade: klimaty, pracownicy, zagrody, gatunki)
3. przy wybieraniu z modala (np. dodawanie pracownika do zagrody/teamu lub klimatu do gatunku) (błąd np. gdy pracownik znajduje się już w teamie)  

Można też:
2. w widokach w których pobiera się dane z bazy wyświetlić error jeżeli się to nie powiodło
