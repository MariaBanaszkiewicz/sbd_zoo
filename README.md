# sbd_zoo

### Bugi:  
6. [PRZENIESIONE NA BACKEND] przed wysłaniem zamiana na UPPERCASE lub case z pierwsza wielka litera  - które dane mają tak być przesłane?  - najlepiej wszystkie tekstowe, żeby było case insensitiv, wszystko też wtedy możemy prezentować z dużej litery  
10. todo w forms animal  
11. wyświetlanie errorów  
12. przy pierwszym uruchomieniu nie dziala wyszukiwanie (w issues zdjecie)  
13. podczas updatowania leczenia w adresie PUT musi być podana stara data (a nie nowa w przypadku jej zmiany)  
14. id zwierzęcia powinno się wyświetlać w tabeli (jako że dopuszczamy te same imiona itd)  
15. po edycji peselu u pracownika przenosi do strony /starypesel zamiast /nowypesel  
16. dodanie jednostek w romiarze zagrody oraz % przy wilgotnosci powietrza w klimatach (tak jak przy temp. jest [ C ])  


### Errory:
Obowiązkowo:
1. po kliknięciu zapisz w każdym formularzu (tworzenie / update) (najczęsciej to błędy w stylu istniejącej już nazwy etc)
2. przy usuwaniu (szczególnie tam gdzie są zabezpieczenia przeciw cascade: klimaty, pracownicy, zagrody, gatunki)
3. przy wybieraniu z modala (np. dodawanie pracownika do zagrody/teamu lub klimatu do gatunku) (błąd np. gdy pracownik znajduje się już w teamie)
Można też:
2. w widokach w których pobiera się dane z bazy wyświetlić error jeżeli się to nie powiodło
