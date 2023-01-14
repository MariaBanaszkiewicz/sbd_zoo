drop table if exists zwierzęta,gatunek_klimat,gatunki,jedzenia,klimaty,leczenia,porcje,pracownicy,pracownik_zagroda,pracownik_zespol,zadania, zagrody, zespoły cascade;

CREATE TABLE gatunek_klimat (
    gatunek CHAR(40 ) NOT NULL,
    klimat  CHAR(40) NOT NULL
);

ALTER TABLE gatunek_klimat ADD CONSTRAINT gatunek_klimat_pk PRIMARY KEY ( gatunek,
                                                                          klimat );

CREATE TABLE gatunki (
    nazwa   CHAR(40 ) NOT NULL,
    gromada CHAR(40 ) NOT NULL
);

ALTER TABLE gatunki ADD CONSTRAINT gatunki_pk PRIMARY KEY ( nazwa );

CREATE TABLE jedzenia (
    nazwa     CHAR(20 ) NOT NULL,
    typ       CHAR(20 ) NOT NULL,
    jednostka CHAR(10) NOT NULL
);

ALTER TABLE jedzenia ADD CONSTRAINT jedzenia_pk PRIMARY KEY ( nazwa );

CREATE TABLE Klimaty 
    (
    nazwa       CHAR(40) NOT NULL,
    roślinnność CHAR(255 ) NOT NULL,
    średnia_temp_dobowa_C   INTEGER  NOT NULL,
    wilgotność_powietrza INTEGER NOT NULL
) 
;

ALTER TABLE klimaty ADD CONSTRAINT klimaty_pk PRIMARY KEY ( nazwa );

CREATE TABLE leczenia (
    choroba CHAR(40 ) NOT NULL,
    data    DATE NOT NULL,
    opis    CHAR(1024 ) NOT NULL,
    zwierze INTEGER NOT NULL
);

ALTER TABLE leczenia
    ADD CONSTRAINT leczenia_pk PRIMARY KEY ( zwierze,
                                             choroba,
                                             data );

CREATE TABLE porcje (
    ilość    INTEGER NOT NULL,
    zwierzę  INTEGER NOT NULL,
    jedzenie CHAR(20 ) NOT NULL
);

ALTER TABLE porcje ADD CONSTRAINT porcje_pk PRIMARY KEY ( zwierzę,
                                                          jedzenie );

CREATE TABLE pracownicy (
    pesel             CHAR(11) NOT NULL,
    imię              CHAR(20) NOT NULL,
    nazwisko          CHAR(20) NOT NULL ,
    data_zatrudnienia DATE NOT NULL default current_date
);

ALTER TABLE pracownicy ADD CONSTRAINT pracownicy_pk PRIMARY KEY ( pesel );

CREATE TABLE pracownik_zagroda (
    pracownik CHAR(11) NOT NULL,
    zagroda   VARCHAR(20) NOT NULL
);

ALTER TABLE pracownik_zagroda ADD CONSTRAINT pracownik_zagroda_pk PRIMARY KEY ( pracownik,
                                                                                zagroda );

CREATE TABLE pracownik_zespol (
    pracownik CHAR(11) NOT NULL,
    zespół    CHAR(40) NOT NULL
);

ALTER TABLE pracownik_zespol ADD CONSTRAINT pracownik_zespol_pk PRIMARY KEY ( pracownik,
                                                                              zespół );

CREATE TABLE zadania (
    opis      CHAR(1024 ) NOT NULL,
    pracownik CHAR(11) NOT NULL
);

ALTER TABLE zadania ADD CONSTRAINT zadania_pk PRIMARY KEY ( pracownik,
                                                            opis );

CREATE TABLE zagrody (
    nazwa_zagrody VARCHAR(20) NOT NULL,
    rozmiar       INTEGER NOT NULL,
    klimat        CHAR(40) NOT NULL
);

ALTER TABLE zagrody ADD CONSTRAINT zagrody_pk PRIMARY KEY ( nazwa_zagrody );

CREATE TABLE zespoły (
    nazwa CHAR(40) NOT NULL,
    typ   CHAR(40) NOT NULL
);

ALTER TABLE zespoły ADD CONSTRAINT zespoły_pk PRIMARY KEY ( nazwa );

CREATE TABLE zwierzęta (
    numer_identyfikacyjny INTEGER generated always as identity,
    imię                  CHAR(20) NOT NULL,
    data_urodzenia        DATE,
    data_przybycia_do_zoo DATE default current_date,
    gatunek               CHAR(40) NOT NULL,
    zagroda               VARCHAR(20) NOT NULL,
    pracownik             CHAR(11) NOT NULL
);

ALTER TABLE zwierzęta ADD CONSTRAINT zwierzęta_pk PRIMARY KEY ( numer_identyfikacyjny );

ALTER TABLE gatunek_klimat
    ADD CONSTRAINT gatunek_klimat_gatunki_fk FOREIGN KEY ( gatunek )
        REFERENCES gatunki ( nazwa ) ON DELETE CASCADE;

ALTER TABLE gatunek_klimat
    ADD CONSTRAINT gatunek_klimat_klimaty_fk FOREIGN KEY ( klimat )
        REFERENCES klimaty ( nazwa ) ON DELETE CASCADE;

ALTER TABLE leczenia
    ADD CONSTRAINT leczenia_zwierzęta_fk FOREIGN KEY ( zwierze )
        REFERENCES zwierzęta ( numer_identyfikacyjny ) ON DELETE CASCADE;

ALTER TABLE porcje
    ADD CONSTRAINT porcje_jedzenia_fk FOREIGN KEY ( jedzenie )
        REFERENCES jedzenia ( nazwa ) ON DELETE CASCADE;

ALTER TABLE porcje
    ADD CONSTRAINT porcje_zwierzęta_fk FOREIGN KEY ( zwierzę )
        REFERENCES zwierzęta ( numer_identyfikacyjny ) ON DELETE CASCADE;

ALTER TABLE pracownik_zagroda
    ADD CONSTRAINT pracownik_zagroda_prac_fk FOREIGN KEY ( pracownik )
        REFERENCES pracownicy ( pesel ) ON DELETE CASCADE;

ALTER TABLE pracownik_zagroda
    ADD CONSTRAINT pracownik_zagroda_zagrody_fk FOREIGN KEY ( zagroda )
        REFERENCES zagrody ( nazwa_zagrody ) ON DELETE CASCADE;

ALTER TABLE pracownik_zespol
    ADD CONSTRAINT pracownik_zespol_pracownicy_fk FOREIGN KEY ( pracownik )
        REFERENCES pracownicy ( pesel ) ON DELETE CASCADE;

ALTER TABLE pracownik_zespol
    ADD CONSTRAINT pracownik_zespol_zespoły_fk FOREIGN KEY ( zespół )
        REFERENCES zespoły ( nazwa ) ON DELETE CASCADE;

ALTER TABLE zadania
    ADD CONSTRAINT zadania_pracownicy_fk FOREIGN KEY ( pracownik )
        REFERENCES pracownicy ( pesel ) ON DELETE CASCADE;

ALTER TABLE zagrody
    ADD CONSTRAINT zagrody_klimaty_fk FOREIGN KEY ( klimat )
        REFERENCES klimaty ( nazwa ) ON DELETE CASCADE;

ALTER TABLE zwierzęta
    ADD CONSTRAINT zwierzęta_gatunki_fk FOREIGN KEY ( gatunek )
        REFERENCES gatunki ( nazwa ) ON DELETE CASCADE;

ALTER TABLE zwierzęta
    ADD CONSTRAINT zwierzęta_pracownicy_fk FOREIGN KEY ( pracownik )
        REFERENCES pracownicy ( pesel ) ON DELETE CASCADE;

ALTER TABLE zwierzęta
    ADD CONSTRAINT zwierzęta_zagrody_fk FOREIGN KEY ( zagroda )
        REFERENCES zagrody ( nazwa_zagrody ) ON DELETE CASCADE;
		
--drop function sprawdz_jadlospis;
create or replace function sprawdz_jadlospis (id_zw integer)
returns table (nazwa char, ilość integer, jednostka char)
AS $$
BEGIN
return query select j.nazwa,p.ilość, j.jednostka from porcje p left join jedzenia j 
on p.jedzenie=j.nazwa where p.zwierzę=id_zw;
END; $$
language 'plpgsql';

create or replace procedure przekaz_zadania (od_prac char(11), do_prac char(11))
language sql
begin atomic
update zadania set pracownik=do_prac where pracownik=od_prac;
end;

insert into gatunki values ('Lew','Ssaki');
insert into klimaty values ('Równoleżnikowy-suchy', 'Sucha',20,40);
insert into zagrody values ('Safari',50,'Równoleżnikowy-suchy');
insert into pracownicy values ('12345678900','Zbyszek', 'Konewka');
insert into pracownicy values ('23456789001','Jan', 'Kula');
insert into zwierzęta (imię,gatunek,zagroda,pracownik) values ('Leon','Lew','Safari','12345678900');
insert into zwierzęta (imię,gatunek,zagroda,pracownik) values ('Simba','Lew','Safari','12345678900');
insert into jedzenia values ('Wolowina','Mieso','kg');
insert into jedzenia values ('Otreby','Suche','g');
insert into porcje values (5,1,'Wolowina');
insert into porcje values (100,1,'Otreby');
insert into zadania values('Sprzatanie alejek','12345678900');

select * from sprawdz_jadlospis(1);
call przekaz_zadania('12345678900','23456789001');
