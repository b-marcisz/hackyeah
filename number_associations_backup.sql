-- Complete backup of number_associations table
-- Created: 2025-01-27
-- Contains all inserts for number_associations table

-- Create table (if not exists)
CREATE TABLE IF NOT EXISTS number_associations (
    id SERIAL PRIMARY KEY,
    number INTEGER NOT NULL,
    hero VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    object VARCHAR(255) NOT NULL,
    explanation TEXT,
    is_primary BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add unique constraints
ALTER TABLE number_associations ADD CONSTRAINT IF NOT EXISTS unique_hero UNIQUE (hero);
ALTER TABLE number_associations ADD CONSTRAINT IF NOT EXISTS unique_action UNIQUE (action);
ALTER TABLE number_associations ADD CONSTRAINT IF NOT EXISTS unique_object UNIQUE (object);

-- Clear table before inserting
DELETE FROM number_associations;

-- Insert all records
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(85, 3, 'Tygrysek', 'pcha', 'Telefon', 'Scooby-Doo szuka trzech lizaków, które są tak słodkie jak liczba 3!', true, 0.0, 0, '2025-10-04 18:22:33.530');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(28, 14, 'Julius Caesar', 'wspina', 'a letter with warning', 'This association refers to the Ides of March, the 15th of March in Roman calendar, when Julius Caesar was assassinated. He was warned by a soothsayer to ''beware the Ides of March'', but he did not heed the warning. The number 14 here represents the day before that fateful event, the moment of receiving the warning.', false, 0.0, 0, '2025-10-04 17:54:07.961');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(133, 76, 'Bagheera', 'trzyma', 'Liść', 'Ariel śpiewa 76 piosenek w oceanie. Każda piosenka to małe kółko, a razem tworzą liczbę 76!', true, 0.0, 0, '2025-10-04 18:51:57.664');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(134, 77, 'Mowgli', 'nosi', 'Winogrono', 'Pocahontas tańczy z 77 zwierzętami w lesie. Każde zwierzę to małe kółko, a razem tworzą liczbę 77!', true, 0.0, 0, '2025-10-04 18:51:57.664');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(123, 78, 'Shere Khan', 'wkłada', 'Korona', 'Buzz Lightyear jest znaną postacią z bajki ''Toy Story''. Dzieci mogą łatwo wyobrazić sobie, jak przeleci przez 78 planet, co jest związane z liczbą 78. Wizualizacja Buzz''a przelatującego przez te planety może pomóc dzieciom zapamiętać tę liczbę.', true, 0.0, 0, '2025-10-04 18:42:17.345');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(122, 86, 'Minionek Bob', 'sprząta', 'Ciastko', 'Tweety jest małym, żółtym ptaszkiem, który uwielbia dbać o rośliny. W naszym skojarzeniu, Tweety podlewa 86 tulipanów w swoim ogrodzie. Liczba 86 wygląda trochę jak Tweety z kropelką wody nad głową i tulipanem w dłoni.', true, 0.0, 0, '2025-10-04 18:41:15.716');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(142, 87, 'Minionek Kevin', 'zamiata', 'Lizak', 'Ariel zbiera 87 muszli w oceanie. Każda muszla to małe kółko, a razem tworzą liczbę 87!', true, 0.0, 0, '2025-10-04 18:52:36.317');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(20, 5, 'Król Lew Simba', 'piszczy', 'Jabłko', 'King Arthur represents a heroic, iconic figure. His action of brandishing the Pentacle, a symbol often associated with the number 5, represents the powers of mind over matter. The five points of the Pentacle can be seen to symbolize the four elements of earth, air, fire, and water being dominated by the spirit or self. This metaphorically captures the essence of the number 5 as a symbol of balance, control, and human potential.', true, 0.0, 0, '2025-10-04 15:03:18.889');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(135, 79, 'Kung Fu Panda Po', 'zdejmuje', 'Gogle VR', 'Król Lew Simba bawi się z 79 małymi lwiątkami. Każde lwiątko to małe kółko, a razem tworzą liczbę 79!', true, 0.0, 0, '2025-10-04 18:52:05.295');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(136, 80, 'Tigress', 'ubiera', 'Śnieżynka', 'Kubuś Puchatek je 80 miodowych ciasteczek. Każde ciasteczko to małe kółko, a razem tworzą liczbę 80!', true, 0.0, 0, '2025-10-04 18:52:05.295');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(137, 81, 'Shifu', 'rozbiera', 'Wiadro z farbą', 'Myszka Miki gra na 81 instrumentach w orkiestrze. Każdy instrument to małe kółko, a razem tworzą liczbę 81!', true, 0.0, 0, '2025-10-04 18:52:05.295');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(138, 82, 'Pingwiny z Madagaskaru', 'czesze', 'Grzyb', 'Elsa buduje 82 bałwany swoją magią. Każdy bałwan to małe kółko, a razem tworzą liczbę 82!', true, 0.0, 0, '2025-10-04 18:52:05.295');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(91, 15, 'Ariel z Małej Syrenki', 'puszcza', 'Lustro', 'Harry Potter, znany młody czarodziej, siedzi w Hogwarcie i odczytuje 15 magicznych zaklęć z książki. Liczba 15 przypomina kształt magicznej różdżki, której używa Harry do rzucania zaklęć.', true, 0.0, 0, '2025-10-04 18:33:35.252');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(30, 16, 'Sebastian z Małej Syrenki', 'patrzy', 'Zamek', 'Królowa Elżbieta I wstąpiła na tron Anglii w wieku 16 lat, co symbolizuje przejście do dorosłości, siłę i autorytet liczby 16.', true, 0.0, 0, '2025-10-04 17:54:15.714');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(86, 17, 'Florek (rybka z Małej Syrenki)', 'wącha', 'Wiadro', 'Elsa używa swojej magii, aby zbudować siedemnaście bałwanów, które tańczą i bawią się na śniegu. Każdy bałwan wygląda jak cyfra 1 lub 7, tworząc razem liczbę 17!', true, 0.0, 0, '2025-10-04 18:23:06.691');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(32, 18, 'Złotowłosa', 'słucha', 'Łyżka', 'Zeus, jako władca bóg Olimpu, jest znany z rzucających błyskawice, które są symbolem jego potęgi. Liczba 18 jest często kojarzona z pełnoletniością, dorosłością i dojrzewaniem, co może być metaforą dla potężnej i dojrzewającej siły Zeusa.', true, 0.0, 0, '2025-10-04 17:54:38.148');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(33, 19, 'Kopciuszek', 'ogląda', 'Talerz', 'Robin Hood, znany ze swojej precyzji i umiejętności strzelania, strzela 19 strzałami w cel, co symbolizuje pełnię, kompletność i celność liczby 19.', true, 0.0, 0, '2025-10-04 17:54:41.558');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(139, 83, 'Król Julian', 'myje', 'Kamień', 'Spiderman łapie 83 przestępców w Nowym Jorku. Każdy przestępca to małe kółko, a razem tworzą liczbę 83!', true, 0.0, 0, '2025-10-04 18:52:05.295');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(140, 84, 'Maurice', 'suszy', 'Puchar', 'Królewna Śnieżka czyta 84 bajki siedmiu krasnoludkom. Każda bajka to małe kółko, a razem tworzą liczbę 84!', true, 0.0, 0, '2025-10-04 18:52:05.295');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(141, 85, 'Mort', 'prasuje', 'Lornetka', 'Batman ratuje 85 ludzi w Gotham City. Każdy człowiek to małe kółko, a razem tworzą liczbę 85!', true, 0.0, 0, '2025-10-04 18:52:05.295');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(79, 1, 'Kubuś Puchatek', 'dotyka', 'Klucz', 'Smerf podnosi jedno lody, które wyglądają jak liczba 1. Jest to zabawne, bo lody są większe niż Smerf!', true, 0.0, 0, '2025-10-04 18:18:49.191');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(80, 6, 'Nala z Króla Lwa', 'szepcze', 'Mleko', 'Winnie the Pooh zawsze jest głodny i uwielbia miód. Wyobraź sobie, jak siedzi i zjada 6 słoików miodu. Kształt słoika miodu przypomina kształt liczby 6.', true, 0.0, 0, '2025-10-04 18:19:23.055');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(34, 20, 'Król Artur', 'je', '20 Rycerzy Okrągłego Stołu', 'Liczba 20 jest często używana w kontekście zbioru lub gromadzenia wielu elementów razem, podobnie jak Król Artur zgromadził 20 Rycerzy Okrągłego Stołu, symbolizując jedność i siłę.', false, 0.0, 0, '2025-10-04 17:54:46.942');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(78, 20, 'Śpiąca Królewna', 'śmieje', 'Gitara', 'Myszka Miki, ulubiona postać wszystkich dzieci, karmi 20 małych, zielonych żółwi. Każdy żółw jest jak mały okrągły ''0'', a Myszka Miki jest jak duża ''2'', razem tworząc liczbę 20.', true, 0.0, 0, '2025-10-04 18:17:22.955');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(35, 21, 'Królewna Śnieżka', 'płacze', 'Aparat fotograficzny', 'Cesarz Nero jest znany z tego, że grał na lutni podczas wielkiego pożaru Rzymu. Tutaj, 21-strunowa lutnia symbolizuje liczby 21, podkreślając bogactwo i różnorodność dźwięków, które można na niej wydobyć, co jest metaforą dla różnorodności i bogactwa doświadczeń, które mogą nadejść po osiągnięciu pełnej dorosłości w wieku 21 lat.', true, 0.0, 0, '2025-10-04 17:54:51.851');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(84, 27, 'Biała Królowa', 'całuje', 'Garnek', 'SpongeBob bakes 27 cookies to share with his friends at the Bikini Bottom. Imagine the number 27 looks like two cookies, one round (2) and one with a bitten edge (7).', true, 0.0, 0, '2025-10-04 18:22:00.686');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(92, 28, 'Królowa Kier', 'gryzie', 'Świeca', 'Pikachu jest dobrze znanym Pokemonem, który potrafi łapać błyskawice. Dzieci mogą sobie wyobrazić, jak Pikachu łapie 28 błyskawic, przypominając sobie liczbę 28.', true, 0.0, 0, '2025-10-04 18:33:40.450');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(49, 32, 'Jiminy Świerszcz', 'smakuje', 'Samolot', 'SpongeBob SquarePants jest mistrzem grillowania! Wyobraź sobie, jak przyrządza 32 pyszne klopsiki na swoim grillu. Każdy klopsik reprezentuje jedną jednostkę liczby 32.', true, 0.0, 0, '2025-10-04 17:57:56.395');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(87, 33, 'Bambi', 'je', 'Samochód', 'Elsa z ''Krainy Lodu'' śpiewa, tworząc 33 śnieżki. Śnieżki są białe i okrągłe, przypominające kształt liczby 3, a jest ich dokładnie 33.', true, 0.0, 0, '2025-10-04 18:24:32.280');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(58, 41, 'Zygzak McQueen', 'pisze', 'Butelka', 'Shrek gotuje 4 duże marchewki i 1 ziemniaka do swojej ulubionej zupy, co przypomina liczbę 41.', true, 0.0, 0, '2025-10-04 17:59:23.998');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(14, 3, 'Trzy Świnki', 'śpiewa', 'trzy domy', 'Liczba 3 jest tutaj zastosowana w kontekście klasycznej bajki ''Trzy Świnki''. Świnki, będące bohaterami, budują trzy domy, co odzwierciedla istotę liczby 3. Każda świnia buduje swój własny dom, co dodaje aspektu indywidualności do każdej z trzech jednostek tworzących całość.', false, 0.0, 0, '2025-10-04 14:59:57.192');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(17, 0, 'Myszka Miki', 'uderza', 'Piłka', 'Magiczny krąg, stworzony przez czarodzieja Merlina, reprezentuje liczbę 0. Ma okrągły kształt, podobny do tej liczby, a także symbolizuje początek i koniec, co jest zgodne z koncepcją liczby 0.', true, 0.0, 0, '2025-10-04 15:03:07.273');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(18, 2, 'Prosiaczek', 'kopie', 'Parasol', 'Adam and Eve, the first two human beings, symbolize the concept of ''pair'' or ''couple'', which is directly related to number 2. The action of sharing an apple represents an interaction between two entities.', true, 0.0, 0, '2025-10-04 15:03:10.633');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(19, 4, 'Kłapouchy', 'łapie', 'Książka', 'Captain Planet is a hero who unites the four elements (Fire, Water, Earth, Air) to protect the Earth, symbolically representing the number 4''s connection to the four cardinal directions, seasons, and elements.', true, 0.0, 0, '2025-10-04 15:03:13.550');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(15, 7, 'Rafiki z Króla Lwa', 'krzyczy', 'Kubek', 'The number seven is often associated with magic and mystery, as in the tale of Snow White and the Seven Dwarfs. In this story, Snow White, a well-known fairy tale character, lives with seven dwarfs, which perfectly represents the number seven. This association also reflects the cultural significance of the number seven, which is often found in fairy tales and mythology.', true, 0.0, 0, '2025-10-04 15:00:06.146');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(22, 8, 'Timon', 'śpiewa', 'Krzesło', 'Spider-Man, known for his eight limbs, is spinning an infinity symbol, which resembles the number 8, indicating the endless possibilities and the infinite nature of this number.', true, 0.0, 0, '2025-10-04 15:03:26.072');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(90, 29, 'Pinokio', 'liże', 'Kwiat', 'Kaczor Donald, znany ze swojego kapelusza marynarza i charakterystycznego kaczego mówienia, jest teraz super tajnym agentem! W swojej najnowszej misji, szyfruje wiadomości do swoich przyjaciół na 29 kolorowych balonach. Te balony są rozmieszczone w taki sposób, że przypominają kształt liczby 29. To jest zabawne i łatwe do zapamiętania skojarzenie dla dzieci.', true, 0.0, 0, '2025-10-04 18:32:20.301');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(88, 34, 'Thumper (Kłapouchy królik z Bambi)', 'pije', 'Statek', 'Smerf Maruda, znanego z niezadowolonego wyrazu twarzy, wyobraź sobie jak siedzi i liczy 34 marchewki. Liczba 3 może wyglądać jak dwie marchewki leżące obok siebie, a liczba 4 może wyglądać jak marchewka z liśćmi na górze.', true, 0.0, 0, '2025-10-04 18:24:42.109');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(95, 35, 'Dumbo', 'smaży', 'Szalik', 'Garfield, słynny pomarańczowy kot z kreskówki, uwielbia jeść lasagne. Możemy go łatwo wyobrazić sobie, jak zjada 35 kawałków lasagne, co pomaga zapamiętać liczbę 35.', true, 0.0, 0, '2025-10-04 18:33:51.813');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(96, 36, 'Myszka Minnie', 'gotuje', 'List', 'Stitch z filmu ''Lilo&Stitch'' jest znanym surferem. Możemy go wyobrazić sobie surfującego na 36 różnokolorowych falach, co pomaga dzieciom zapamiętać liczbę 36.', true, 0.0, 0, '2025-10-04 18:33:57.032');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(41, 13, 'Kristoff', 'lepi', 'Ołówek', 'Spongebob, znany z miłości do gotowania, robi 13 pysznych pączków, które są ułożone tak, że wyglądają jak liczba 13.', true, 0.0, 0, '2025-10-04 17:57:05.775');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(42, 14, 'Sven', 'głaszcze', 'Szczotka', 'Spiderman skacze na trampolinie 14 razy, w górę i w dół, przypominając kształt liczby 14', true, 0.0, 0, '2025-10-04 17:57:14.405');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(36, 22, 'Książę z Bajki', 'mruga', 'Komputer', 'Hermes, the Greek god of messengers, is delivering two packages, symbolizing the number 22 in two parts. Also, Hermes is associated with communication, linking it to the 22 letters of the Hebrew alphabet, a significant cultural reference.', true, 0.0, 0, '2025-10-04 17:54:54.936');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(37, 23, 'Bella z Pięknej i Bestii', 'kicha', 'Zegar', 'Michael Jordan, who famously wore number 23, scores a basketball, representing the number''s association with achievement and success in sports.', true, 0.0, 0, '2025-10-04 17:54:57.996');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(38, 24, 'Bestia', 'kaszle', 'Młotek', 'Jack Bauer, bohater serialu ''24'', jest znanym postaciem, która ma 24 godziny na rozwiązanie zagadki. Zegar jest tu symbolem tych 24 godzin.', true, 0.0, 0, '2025-10-04 17:55:00.544');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(83, 25, 'Alicja z Krainy Czarów', 'ziewa', 'Nóż', 'Królewna Śnieżka tańczy z 25 krasnoludkami. Bawią się tak dobrze, że wygląda to jak wesołe 2 i 5 w ruchu!', true, 0.0, 0, '2025-10-04 18:21:21.338');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(40, 26, 'Cheshire Kot', 'cmoka', 'Widelec', 'The number 26 is half of 52, the total number of cards in a deck. Alice is often associated with cards through the Queen of Hearts character. The action of playing cards refers to the randomness and probability, aspects often linked with the number 26.', true, 0.0, 0, '2025-10-04 17:55:12.677');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(93, 30, 'Geppetto', 'żuje', 'Balon', 'Księżniczka Roszpunka ma bardzo długie, złote włosy. W naszym skojarzeniu czesze 30 z nich, co pomaga dzieciom visualizować liczbę 30.', true, 0.0, 0, '2025-10-04 18:33:44.439');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(94, 31, 'Dżepetto', 'połyka', 'Ryba', 'Pingwiny z Madagaskaru są znane z ich zabawnych i kreatywnych pomysłów. W naszym skojarzeniu, organizują oni 31 urodziny dla ich przyjaciela, króla Juliana. Liczba 31 przypomina kształt pingwina z boku z dużym brzuchem (3) i małą głową (1). To skojarzenie jest zabawne, kolorowe i łatwe do zapamiętania dla dzieci.', true, 0.0, 0, '2025-10-04 18:33:49.049');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(16, 3, 'Trzej Muszkieterowie', 'śpiewa', 'trzy miecze', 'Trzej Muszkieterowie są dobrze znanymi bohaterami, którzy zawsze działają razem, symbolizując jedność i solidarność. Walczą używając mieczy, co jest aktywnym i konkretnym działaniem. Trzy miecze odpowiadają liczbie 3, która jest istotna dla tych bohaterów i odnosi się do ich nazwy. Metaforycznie, liczba 3 może reprezentować jedność w różnorodności, ponieważ mimo że są trzej, działają jako jeden.', false, 0.0, 0, '2025-10-04 15:02:03.316');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(89, 37, 'Kaczor Donald', 'piecze', 'Portfel', 'Kot w Butach gra na skrzypcach, które mają 3 struny (jak trójka w 37). Podczas gry, Kot w Butach tańczy w rytm muzyki, a jego ogon tworzy kształt 7 (jak siódemka w 37). To zabawne i kolorowe skojarzenie pomaga dzieciom przypomnieć sobie liczbę 37.', true, 0.0, 0, '2025-10-04 18:29:36.544');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(97, 38, 'Kaczka Daisy', 'miesza', 'Kostka Rubika', 'Rozważmy króla Lwa Simbę, który troskliwie opiekuje się 38 młodymi lwiątkami. Kształt 3 przypomina głowę lwa, a 8 wygląda jak dwie małe lwiątka bawiące się ze sobą. Dzieci mogą sobie wyobrazić, jak troskliwy Król Lew Simba dba o swoje małe lwiątka, co pomoże im zapamiętać liczbę 38.', true, 0.0, 0, '2025-10-04 18:34:02.364');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(98, 39, 'Goofy', 'waży', 'Mydło', 'Księżniczka Ariel, znana z ''Małej Syrenki'', bawi się na morskim dnie i odkrywa 39 perł. Każda z nich świeci tak jasno, jak liczba 39 w naszych umysłach!', true, 0.0, 0, '2025-10-04 18:34:05.380');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(99, 40, 'Pluto', 'mierzy', 'Lody', 'Dinozaur Rex z Toy Story używa swojego długiego ogona jak łopaty, aby kopać 40 dziur w piasku. Dzieci mogą wyobrazić sobie, że każda dziura to cyfra 0, a 40 dziur to liczba 40.', true, 0.0, 0, '2025-10-04 18:34:11.470');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(100, 42, 'Złomek z Aut', 'czyta', 'Brelok', 'Frodo z ''Władca Pierścieni'' jest znanym bohaterem, który jest symbolem długiej podróży. 42 mil to odległość, którą Frodo mógłby pokonać w swojej podróży, co pomaga dzieciom zapamiętać liczbę 42.', true, 0.0, 0, '2025-10-04 18:34:21.523');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(101, 43, 'Buzz Astral z Toy Story', 'mówi', 'Pasta do zębów', 'Król Julian z Madagaskaru gra na wielkich skrzypcach, które mają 43 struny. Wizualizacja tej sceny pomaga dzieciom zapamiętać liczbę 43.', true, 0.0, 0, '2025-10-04 18:34:28.961');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(61, 44, 'Woody z Toy Story', 'pyta', 'Tort', 'Batman jeździ swoim batmobil, który ma 4 koła z przodu i 4 koła z tyłu, co przypomina nam liczbę 44.', true, 0.0, 0, '2025-10-04 17:59:34.004');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(102, 45, 'Jessie z Toy Story', 'odpowiada', 'Dzwonek', 'Czarodziejka Sabrina odczarowuje 45 żab, które niespodziewanie zamieniły się w książąt. Odczarowanie tylu żab to wielkie wyzwanie, ale Sabrina jest na to gotowa. Dzieci mogą łatwo zapamiętać tę liczbę, wyobrażając sobie, jak Sabrina wyczarowuje swoje zaklęcie, a potem jedna po drugiej żaby zamieniają się z powrotem w książąt.', true, 0.0, 0, '2025-10-04 18:34:35.433');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(63, 46, 'Rex z Toy Story', 'opowiada', 'Zdjęcie', 'Scooby Doo jada 46 hotdogów na wielkim konkursie jedzenia. 4 jest jak bułka hotdoga, a 6 jak kiełbasa w środku!', true, 0.0, 0, '2025-10-04 17:59:40.926');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(107, 51, 'Patryk Rozgwiazda', 'pakuje', 'Drzwi', 'Pippi Pończoszanka jest niesamowicie silna i zwinna, więc dla niej wejście na drabinę z 51 szczebelkami to żaden problem. Liczba 51 przypomina drabinę z 5 dużymi szczebelkami na dole (5) i 1 szczebelek na górze (1).', true, 0.0, 0, '2025-10-04 18:35:01.235');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(23, 9, 'Pumba', 'tańczy', 'Lampa', 'Cerberus, trzygłowy pies strzegący Hadesu, tutaj strzeże dziewięciogłowego smoka, symbolizując liczbę 9. W mitologii, dziewięć często kojarzone jest z wielkością i potęgą, a także z cyklicznością i odrodzeniem.', true, 0.0, 0, '2025-10-04 15:03:30.316');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(82, 11, 'Anna z Krainy Lodu', 'rysuje', 'Czapka', 'Tom i Jerry stoją między dwoma słupami, które przypominają kształt liczby 11.', true, 0.0, 0, '2025-10-04 18:19:42.717');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(105, 49, 'Forky', 'kroi', 'Chmura', 'Pocahontas, znana z jej umiejętności poruszania się z naturą, płynie na rzece na 49 liściach, co przypomina kształt liczby 49. Dzieci mogą łatwo sobie wyobrazić tę scenę, ponieważ Pocahontas często jest pokazywana podczas interakcji z elementami natury.', true, 0.0, 0, '2025-10-04 18:34:51.525');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(106, 50, 'SpongeBob Kanciastoporty', 'obiera', 'Dom', 'Bugs Bunny, znany królik z kreskówek, gra na fladze melodyjnie, a na tej fladze są 50 nut. To jest nasze kolorowe i zabawne skojarzenie dla liczby 50.', true, 0.0, 0, '2025-10-04 18:34:55.406');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(108, 52, 'Pan Krab', 'otwiera', 'Serce', 'Marta z bajki ''Marta Mówi'' jest inteligentną i ciekawą świata psicą. Dzieci często widzą Martę z książką, więc łatwo im będzie zapamiętać, że Marta czyta 52 książki. Można to łączyć z obrazem dużej biblioteki, w której Marta siedzi i czyta.', true, 0.0, 0, '2025-10-04 18:35:14.448');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(109, 53, 'Skalmarek', 'zamyka', 'Gwóźdź', 'Mulan, odważna bohaterka znanego filmu, używa swojej mądrości i siły, aby wspinać się na 53 kamienie, co przypomina kształt liczby 53. Jest to łatwe do wyobrażenia i zapamiętania dla dzieci, które mogą sobie wyobrazić Mulan, jak wspina się coraz wyżej i wyżej.', true, 0.0, 0, '2025-10-04 18:36:09.197');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(110, 54, 'Sandy Pysia', 'naciska', 'Bateria', 'Pinkie Pie z Kucyków Pony uwielbia piec babeczki. Wyobraź sobie, jak piecze 54 babeczki, które wyglądają jak liczba 54. Każda z nich jest kolorowa i pachnąca. To jest proste i zabawne skojarzenie dla liczby 54.', true, 0.0, 0, '2025-10-04 18:36:18.039');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(111, 55, 'Dora poznaje świat', 'kręci', 'Guzik', 'Król Lew Mufasa z dumą naucza 55 małych lwiat, jak być prawdziwymi królami, co przypomina kształt liczby 55, gdzie lwiaty tworzą obie ''piątki''.', true, 0.0, 0, '2025-10-04 18:36:22.621');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(77, 56, 'Butek (małpka Dory)', 'obraca', 'Torebka', 'Buzz Astral z Toy Story lata rakietą, która ma kształt podobny do liczby 5, a dym za rakietą tworzy kształt podobny do liczby 6. To jest zabawne, kolorowe i łatwe do zapamiętania skojarzenie dla liczby 56.', true, 0.0, 0, '2025-10-04 18:01:30.920');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(81, 11, 'Kot w butach', 'śpi', 'na długich, wąskich kijach', 'Kot w butach balansuje na dwóch długich, wąskich kijach, które wyglądają jak liczba 11. Wyobraź sobie, jak kot utrzymuje równowagę, a jego ogon faluje na boki, co dodaje koloru i ruchu do obrazu. To zabawne i łatwe do zapamiętania skojarzenie z liczbą 11.', false, 0.0, 0, '2025-10-04 18:19:37.207');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(24, 10, 'Elsa z Krainy Lodu', 'gra', 'Rower', 'In Greek mythology, Hercules is known for completing twelve labors as a form of penance. The number 10 here is associated with the completion of the tenth labor, symbolizing the achievement, perseverance, and the process of reaching a significant milestone.', true, 0.0, 0, '2025-10-04 15:03:33.901');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(26, 12, 'Olaf', 'maluje', 'Okulary', 'Herkules, znany z mitologii greckiej, musiał wykonać 12 prac jako pokuta za swoje czyny. Prace te symbolizują ogromne zadanie, które wymaga siły, odwagi i zdolności do pokonania wyzwań, co jest metaforą liczby 12 - liczby pełnej i kompleksowej.', true, 0.0, 0, '2025-10-04 15:03:40.609');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(103, 47, 'Mr. Potato Head', 'słodzi', 'Moneta', 'Bart Simpson z kreskówki ''Simpsonowie'' jest znany z miłości do rysowania. Możemy go sobie wyobrazić, jak rysuje 47 komiksów, które tworzą kształt liczby 47.', true, 0.0, 0, '2025-10-04 18:34:38.737');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(104, 48, 'Barbie z Toy Story', 'soli', 'Słońce', 'Dora, znana z miłości do przyrody, rozmawia z 48 kolorowymi motylami. Każdy motyl reprezentuje jeden punkt na mapie, której używa Dora do swoich przygód.', true, 0.0, 0, '2025-10-04 18:34:46.503');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(112, 57, 'Diego (kuzyn Dory)', 'przyciska', 'Pióro', 'Złotowłosa, znana z bajki o trzech niedźwiadkach, uwielbia rowery. Przypomnij sobie, jak wygląda cyfra 5, która przypomina kształt roweru, a 7 to liczba rowerów na której jedzie Złotowłosa. Więc 57 to Złotowłosa, która podróżuje na 57 rowerach.', true, 0.0, 0, '2025-10-04 18:36:34.318');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(113, 58, 'Świnka Peppa', 'podnosi', 'Zeszyt', 'Lightning McQueen to szybki i zwinny samochód wyścigowy, który z łatwością przejeżdża przez 58 pomarańczowych stożków, tworząc ścieżkę przypominającą kształt liczby 58.', true, 0.0, 0, '2025-10-04 18:36:39.709');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(114, 59, 'George (brat Peppy)', 'opuszcza', 'Mapa', 'Smerfetka, kochająca przyrodę, sadzi 59 kolorowych tulipanów w ogrodzie Smerfów. Liczba 59 tulipanów tworzy kształt podobny do liczby 59, co ułatwia dzieciom zapamiętanie.', true, 0.0, 0, '2025-10-04 18:36:48.420');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(115, 60, 'Mama Świnka', 'siada', 'Kula do kręgli', 'Księżniczka Zelda z gry ''Legend of Zelda'' siedzi na złotym tronie i gra na wielkiej harfie, która ma 60 strun. Dźwięki, które wydobywa z niej, są tak piękne, że każdy, kto je słyszy, zapamiętuje, że harfa ma 60 strun!', true, 0.0, 0, '2025-10-04 18:38:49.109');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(116, 61, 'Tata Świnka', 'wstaje', 'Pizza', 'Król Lew Nala jest znana i lubiana postać dla dzieci. Kąpiel w kroplach deszczu jest zabawna i łatwa do wyobrażenia. Liczba 61 przypomina kształt kropel deszczu spadającego z nieba.', true, 0.0, 0, '2025-10-04 18:38:53.664');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(117, 62, 'Rebeka Królik', 'biegnie', 'Piłeczka tenisowa', 'Król Lew Rafiki maluje 62 banany na ścianie swojej jaskini. Wizualizacja 62 bananów pomoże dzieciom zapamiętać numer.', true, 0.0, 0, '2025-10-04 18:39:01.155');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(118, 63, 'Suzy Owca', 'idzie', 'Pianino', 'Woody z Toy Story składa 63 klocki Lego, tworząc kolorową wieżę. Jest to łatwe do zapamiętania, ponieważ wieża przypomina kształt liczby 63.', true, 0.0, 0, '2025-10-04 18:39:04.812');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(119, 64, 'Marta z Marta mówi', 'skacze', 'Deskorolka', 'Kubuś Puchatek zamawia 64 miodowe ciasteczka, bo jest bardzo głodny. Wizualizacja liczby 64 może być łatwa, jeśli wyobrażamy sobie stół pełen ciasteczek. 6 ciasteczek ułożonych w kształt ''6'' i 4 ciasteczka ułożone w kształt ''4''.', true, 0.0, 0, '2025-10-04 18:39:11.607');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(120, 65, 'Franklin żółw', 'spada', 'Pilot', 'Olaf, sympatyczny bałwan z ''Krainy Lodu'', topi 65 kulek śniegu. To skojarzenie jest łatwe do zapamiętania, ponieważ Olaf jest bałwanem i topienie śniegu jest dla niego naturalne. Liczba 65 może przypominać kształt kulek śniegu, które topi Olaf.', true, 0.0, 0, '2025-10-04 18:39:23.294');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(126, 66, 'Mała Mi z Muminków', 'wspina', 'Bałwan', 'Król Julian tańczy z 66 lemurkami w rytm muzyki. Każdy lemurek to małe kółko, a razem tworzą liczbę 66!', true, 0.0, 0, '2025-10-04 18:51:49.564');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(127, 67, 'Muminek', 'zjeżdża', 'Latarka', 'Myszka Miki rysuje 67 serduszek dla Minnie. Każde serduszko to małe kółko, a razem tworzą liczbę 67!', true, 0.0, 0, '2025-10-04 18:51:49.564');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(128, 68, 'Panna Migotka', 'leci', 'Motyl', 'Kubuś Puchatek liczy 68 słoików miodu w swojej spiżarni. Każdy słoik to małe kółko, a razem tworzą liczbę 68!', true, 0.0, 0, '2025-10-04 18:51:49.564');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(125, 69, 'Ryjek', 'pływa', 'Banan', 'Nemo, mała, pomarańczowa rybka pływa i puszcza 69 kolorowych baniek mydlanych. Bąbelki unoszą się w wodzie tworząc kształt liczby 69.', true, 0.0, 0, '2025-10-04 18:43:02.006');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(121, 70, 'Włóczykij', 'wiosłuje', 'Medal', 'Tarzan, znany z huśtania się na lianach, przeskakuje z jednej na drugą. Wyobraź sobie, jak skacze po 70 lianach, co przypomina kształt liczby 70!', true, 0.0, 0, '2025-10-04 18:40:59.128');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(124, 71, 'Pocahontas', 'nurkue', 'Album ze zdjęciami', 'Bambi, mała sarna z kreskówki, skacze przez 71 sarenki. Dzieci mogą łatwo zapamiętać tę scenę, ponieważ Bambi jest popularną postacią, a skakanie przez sarenki jest zabawnym i kolorowym obrazem.', true, 0.0, 0, '2025-10-04 18:42:35.280');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(129, 72, 'Mulan', 'ciągnie', 'Prezent', 'Elsa tworzy 72 płatki śniegu swoją magią. Każdy płatek to małe kółko, a razem tworzą liczbę 72!', true, 0.0, 0, '2025-10-04 18:51:57.664');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(130, 73, 'Vaiana (Moana)', 'popycha', 'Lalka', 'Spiderman skacze między 73 budynkami w Nowym Jorku. Każdy budynek to małe kółko, a razem tworzą liczbę 73!', true, 0.0, 0, '2025-10-04 18:51:57.664');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(131, 74, 'Maui z Moany', 'rzuca', 'Piłka nożna', 'Królewna Śnieżka sadzi 74 róże w swoim ogrodzie. Każda róża to małe kółko, a razem tworzą liczbę 74!', true, 0.0, 0, '2025-10-04 18:51:57.664');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(132, 75, 'Baloo z Księgi Dżungli', 'podaje', 'Sople', 'Batman jeździ 75 mil swoim Batmobilem. Każda mila to małe kółko, a razem tworzą liczbę 75!', true, 0.0, 0, '2025-10-04 18:51:57.664');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(143, 88, 'Minionek Stuart', 'ściera', 'Rakieta', 'Pocahontas tańczy z 88 motylami w lesie. Każdy motyl to małe kółko, a razem tworzą liczbę 88!', true, 0.0, 0, '2025-10-04 18:52:36.317');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(144, 89, 'Gru', 'odkurza', 'Kalendarz', 'Król Lew Simba bawi się z 89 małymi lwiątkami. Każde lwiątko to małe kółko, a razem tworzą liczbę 89!', true, 0.0, 0, '2025-10-04 18:52:36.317');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(145, 90, 'Shrek', 'kleji', 'Ser', 'Kubuś Puchatek je 90 miodowych ciasteczek. Każde ciasteczko to małe kółko, a razem tworzą liczbę 90!', true, 0.0, 0, '2025-10-04 18:52:36.317');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(146, 91, 'Fiona', 'wycina', 'Helikopter', 'Myszka Miki gra na 91 instrumentach w orkiestrze. Każdy instrument to małe kółko, a razem tworzą liczbę 91!', true, 0.0, 0, '2025-10-04 18:52:36.317');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(147, 92, 'Osioł', 'składa', 'Wózek', 'Elsa buduje 92 bałwany swoją magią. Każdy bałwan to małe kółko, a razem tworzą liczbę 92!', true, 0.0, 0, '2025-10-04 18:52:36.317');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(148, 93, 'Kot w Butach', 'buduje', 'Maska', 'Spiderman łapie 93 przestępców w Nowym Jorku. Każdy przestępca to małe kółko, a razem tworzą liczbę 93!', true, 0.0, 0, '2025-10-04 18:52:36.317');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(149, 94, 'Czerwony Kapturek', 'naprawia', 'Gwiazda', 'Królewna Śnieżka czyta 94 bajki siedmiu krasnoludkom. Każda bajka to małe kółko, a razem tworzą liczbę 94!', true, 0.0, 0, '2025-10-04 18:52:36.317');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(150, 95, 'Wilk', 'burzy', 'Góra', 'Batman ratuje 95 ludzi w Gotham City. Każdy człowiek to małe kółko, a razem tworzą liczbę 95!', true, 0.0, 0, '2025-10-04 18:52:36.317');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(151, 96, 'Trzy Świnki', 'maltruje', 'Miecz', 'Ariel zbiera 96 muszli w oceanie. Każda muszla to małe kółko, a razem tworzą liczbę 96!', true, 0.0, 0, '2025-10-04 18:52:42.475');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(152, 97, 'Kłapouchy (z Kubusia Puchatka)', 'gwizda', 'Księga bajek', 'Pocahontas tańczy z 97 motylami w lesie. Każdy motyl to małe kółko, a razem tworzą liczbę 97!', true, 0.0, 0, '2025-10-04 18:52:42.475');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(153, 98, 'Nemo z Gdzie jest Nemo', 'rzemie', 'Klepsydra', 'Król Lew Simba bawi się z 98 małymi lwiątkami. Każde lwiątko to małe kółko, a razem tworzą liczbę 98!', true, 0.0, 0, '2025-10-04 18:52:42.475');
INSERT INTO public.number_associations
(id, "number", hero, "action", "object", explanation, is_primary, rating, total_votes, created_at)
VALUES(154, 99, 'Dory z Gdzie jest Nemo', 'udaje lekarza', 'Planeta Ziemia', 'Kubuś Puchatek je 99 miodowych ciasteczek. Każde ciasteczko to małe kółko, a razem tworzą liczbę 99!', true, 0.0, 0, '2025-10-04 18:52:42.475');