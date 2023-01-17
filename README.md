# sbd_zoo

### Plan prezentacji:

1. widok pulpitu (opowiedzenie o apce)
2. prezetnacja dostępnych funkcji  
	2.1 widok zwierzęta  

		2.1.1 wyszukiwanie / filtrowanie etc  
		2.1.2 widok szegółów (wraz z porcjami oraz leczeniem)  - porcje to funkcja
		2.1.3 dodanie zwierzęcia   (pokazanie, że są dropdowny oraz obowiązkowe pola)

	2.2 widok pracownicy  

		2.2.1 lista pracowników
		2.2.2 szczegóły pracownika (przekazanie zadań innemu)

	2.3 widok zagrody

		2.3.1 taby
		2.3.2 dodanie pracownika
		2.3.3 usunięcie zagrody (zabezpieczenie przed kaskadowym usunięciem)

	2.4 widok klimatów + jedzenia + gatunków

		2.4.1 listy
        2.4.2 pokazanie zabezpieczenia przy dodaniu o tej samej nazwie
        2.4.3 pokazanie zabezpieczenia przed wartościami literowymi (w klimatach)

	2.5 widok zespołów

		2.5.1 taby
		2.5.2 dodawanie pracowników (pokazanie, że nie można dodać 2x tego samego)

3. podsumowanie


### Bugi:  


### Errory:
Obowiązkowo:
1. po kliknięciu zapisz w każdym formularzu (tworzenie / update) (najczęsciej to błędy w stylu istniejącej już nazwy etc)
2. przy usuwaniu (szczególnie tam gdzie są zabezpieczenia przeciw cascade: klimaty, pracownicy, zagrody, gatunki)
3. przy wybieraniu z modala (np. dodawanie pracownika do zagrody/teamu lub klimatu do gatunku) (błąd np. gdy pracownik znajduje się już w teamie)  

Można też:
2. w widokach w których pobiera się dane z bazy wyświetlić error jeżeli się to nie powiodło
