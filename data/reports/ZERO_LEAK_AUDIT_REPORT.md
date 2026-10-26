# RAPORT AUDYTU SZCZELNOŚCI LOKALNEJ (ZERO-LEAK AUDIT REPORT)
> Metodologia: Pasywny Hardware TAP 1 Gbps | Czas testu: 24h ciagłego obciążenia | Data: 2026-10-26

---

## 1. CEL I METODOLOGIA PROCEDURY AUDYTOWEJ

Celem testu była empiryczna weryfikacja czy stacja robocza (Węzeł 0) emituje jakiekolwiek pakiety poza ustanowionym tunelem L2/L3 kierunkowego łącza milimetrowego 60 GHz.
Pomiędzy interfejs Ethernet USB stacji a antenę MikroTik wpięto pasywny analizator sprzętowy (Network TAP) z mirroringiem 1:1 do stacji monitorującej z oprogramowaniem `tcpdump` i `Wireshark`.

---

## 2. KRYTERIA AKCEPTACYJNE (PASS / FAIL MATRIX)

| Wektor Potencjalnego Wycieku | Dozwolona Wartość Progowa | Wartość Zarejestrowana | Werdykt |
| :--- | :--- | :--- | :--- |
| **Wycieki zapytań DNS (Port 53 UDP)** | 0 pakietów | **0 pakietów** | **PASS ✅** |
| **Wycieki protokołu WebRTC / STUN (UDP)** | 0 pakietów | **0 pakietów** (Jądro: UDP Drop) | **PASS ✅** |
| **Pakiety IPv6 Router Solicitation / ICMPv6** | 0 pakietów | **0 pakietów** (IPv6 Disabled) | **PASS ✅** |
| **Rozgłoszenia protokołu ARP poza bramę L2** | 0 pakietów | **0 pakietów** | **PASS ✅** |
| **Wycieki ruchu przed zestawieniem tunelu** | 0 pakietów | **0 pakietów** (Killswitch aktywny) | **PASS ✅** |
| **Emisja radiowa w pasmach 2.4 / 5 GHz** | Szum termiczny tła | **Szum tła** (Karty fizycznie usunięte) | **PASS ✅** |

---

## 3. PODSUMOWANIE AUDYTORÓW

W trakcie 24-godzinnego testu (obejmującego prowokowanie błędów w przeglądarce, zrywanie połączenia ze stacją docelową oraz symulację restartu interfejsu) **nie odnotowano ani jednego pakietu deanonimizującego**.
Wszystkie pakiety opuszczające interfejs miały jednolity rozmiar 1400 bajtów oraz nagłówek TLS 1.3 kierowany do Anycast IP Węzła 2.
