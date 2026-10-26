# KOSZTORYS WDROŻENIOWY (BILL OF MATERIALS — BOM)
> Projekt: PanzerNetworking (PANZER-NET) | Wersja: v1.2.0-PROD | Data: 2026-10-26

---

## 1. ZESTAWIENIE WARIANTÓW BUDŻETOWYCH

| Wariant | Przeznaczenie | Koszt Sprzętowy (CAPEX) | Koszt Miesięczny (OPEX) | Przepustowość Szacunkowa |
| :--- | :--- | :--- | :--- | :--- |
| **Wariant A: Zero-Budget / Lab** | Edukacja, testy protokołu, badania akademickie | **0 PLN** | **0 PLN** | 10 – 30 Mbps |
| **Wariant B: Prosumer Sweet Spot** | Rekomendowany: pełna izolacja fizyczna i wysoka wydajność | **~1 750 – 1 850 PLN** | **~35 PLN / mies.** | 50 – 80 Mbps |
| **Wariant C: Field Grade Hardened** | Pełna autonomia solarna, BIOS Coreboot, daleki zasięg | **~6 500+ PLN** | **~150 PLN / mies.** | 80 – 120 Mbps |

---

## 2. SZCZEGÓŁOWE ROZBIEŻNOŚCI ELEMENTÓW

### Wariant B: Prosumer Sweet Spot (Rekomendowany)

1. **Węzeł 0 (Stacja Robocza):**
   * *Sprzęt:* Poleasingowy laptop biznesowy **Lenovo ThinkPad T480** (Intel Core i5-8250U, 16 GB DDR4, wsparcie instrukcji AES-NI i SHA-NI).
   * *Modyfikacje fizyczne:* Wymontowanie wewnętrznego dysku NVMe/SATA, modułu Wi-Fi/Bluetooth, fizyczne odcięcie mikrofonu/kamery.
   * *Koszt:* **~850 PLN**.

2. **Węzeł 1 (Most Radiowy 60 GHz PtP):**
   * *Sprzęt:* Zestaw fabrycznie sparowanych anten **MikroTik Wireless Wire (wAP 60G kit)** (standard 802.11ad, pasmo V-Band 57–66 GHz, duplex 1 Gbps).
   * *Akcesoria:* 2x Zasilacz PoE 24V, kable żelowane FTP Cat.6e do montażu zewnętrznego.
   * *Koszt:* **~900 PLN**.

3. **Węzeł 2 (Chmura Anycast CDN):**
   * *Infrastruktura:* Cloudflare Workers (Plan Free: do 100 000 zapytań dziennie, Anycast IP, wsparcie ECH).
   * *Koszt:* **0 PLN**.

4. **Węzeł 3 (Residential Mixnode P2P):**
   * *Sprzęt:* Istniejący terminal Raspberry Pi 4/5 lub mikrokomputer domowy z łączem światłowodowym.
   * *Koszt:* **0 PLN** (sprzęt własny).

5. **Węzeł 4 (VPS WebTunnel Offshore):**
   * *Infrastruktura:* Serwer VPS w jurysdykcji Islandii (np. 1984.hosting) lub Szwajcarii (2 vCPU, 2 GB RAM, 1 Gbps port).
   * *Płatność:* Monero (XMR) bez procedury KYC.
   * *Koszt:* **~35 PLN / miesiąc**.

6. **Węzeł 5 (Sieć Cebulowa Tor):**
   * *Infrastruktura:* Publiczne węzły Tor Guard / Middle / Exit z mostkami WebTunnel.
   * *Koszt:* **0 PLN**.

---

## 3. BILANS EKONOMICZNY

Stosunek kosztu wdrożenia Wariantu B (~1 800 PLN jednorazowo + ~35 PLN/mies.) do kosztu operacyjnego przeciwnika (GPA-R) w próbie deanonimizacji celu:
* Asymetria kosztowa przekracza **1 : 5 000** na korzyść operatora Węzła 0.
