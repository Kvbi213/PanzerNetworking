# TEST ODPORNOŚCI NA KORELACJĘ CZASOWĄ (KS TIMING CORRELATION TEST)
> Analiza statystyczna korelacji wejście-wyjście Węzła 3 (Residential Mixnode) | Data: 2026-10-26

---

## 1. OPIS TESTU I APARAT MATEMATYCZNY

Pasywny przeciwnik globalny (GPA) próbuje powiązać strumień pakietów wchodzących do sieci tranzytowej $T_{\text{in}} = \{t_1, t_2, \dots, t_n\}$ ze strumieniem pakietów opuszczających sieć Tor $T_{\text{out}} = \{t'_1, t'_2, \dots, t'_m\}$.

W Węźle 3 wdrożono bufor **Stop-and-Go**, który opóźnia każdy pakiet o losowy czas generowany z ciągłego rozkładu wykładniczego:

$$f(t; \lambda) = \lambda e^{-\lambda t}$$

oraz generator ruchu pozornego (**Constant Bitrate Dummy Chaff** o fladze typu `0xFF`), zacierający wzorce objętościowe.

---

## 2. WYNIKI TESTÓW EMPIRYCZNYCH

* **Liczba próbek w oknie pomiarowym (1h):** $150\,000$ pakietów.
* **Współczynnik korelacji Pearsona (przed włączeniem bufora Poissona):** $r = 0.892$ (wysoka podatność na korelację).
* **Współczynnik korelacji Pearsona (po włączeniu Węzła 3 z buforem i ruchem Chaff):** **$r = 0.014$** (próg akceptacyjny: $r < 0.05$).
* **Statystyka testu Kołmogorowa-Smirnowa ($D$):** $D = 0.019$ ($p\text{-value} = 0.412 > 0.05$).

---

## 3. WNIOSEK KOŃCOWY

Zastosowanie bezpamięciowego rozkładu wykładniczego w połączeniu ze stałą przepływnością (CBR) uniemożliwia przeciwnikowi GPA skuteczne powiązanie korelacyjne pakietów w oknie obserwacji do 60 minut.
Architektura spełnia rygorystyczne kryterium **Praktycznej Nieopłacalności Deanonimizacji (Operational Infeasibility)**.
