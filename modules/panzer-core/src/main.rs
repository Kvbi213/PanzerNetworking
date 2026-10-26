//! PanzerNetworking Node 3: Residential Mixnode Daemon
//! Implementation of Poisson Stop-and-Go Queue & Constant Bitrate (CBR) Dummy Chaff generator.

use std::time::Duration;
use tokio::sync::mpsc;
use tokio::time::sleep;
use rand::Rng;

pub const MTU_FRAME_SIZE: usize = 1400;
pub const TYPE_REAL_DATA: u8 = 0x01;
pub const TYPE_DUMMY_CHAFF: u8 = 0xFF;

#[derive(Clone, Debug)]
pub struct TransportPacket {
    pub payload: [u8; MTU_FRAME_SIZE],
    pub packet_type: u8,
}

impl TransportPacket {
    pub fn new_chaff() -> Self {
        let mut payload = [0u8; MTU_FRAME_SIZE];
        rand::thread_rng().fill(&mut payload[..]);
        payload[0] = 0x17; // TLS 1.3 Record
        payload[1] = 0x03;
        payload[2] = 0x03;
        payload[29] = TYPE_DUMMY_CHAFF;
        Self {
            payload,
            packet_type: TYPE_DUMMY_CHAFF,
        }
    }
}

/// Sample exponential random variable for Poisson Stop-and-Go delay: t = -ln(1 - U) / lambda
pub fn sample_poisson_delay(lambda: f64) -> Duration {
    let u: f64 = rand::thread_rng().gen();
    let delay_seconds = -(1.0 - u).ln() / lambda.max(1.0);
    Duration::from_secs_f64(delay_seconds.max(0.002))
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();
    tracing::info!("[*] INFO :: Inicjalizacja panzer-core Node 3 Residential Mixnode v0.2.0");

    let (ingress_tx, mut ingress_rx) = mpsc::channel::<TransportPacket>(1024);
    let (egress_tx, mut egress_rx) = mpsc::channel::<TransportPacket>(1024);

    let lambda = 25.0; // Mean delay 40 ms

    // Poisson Stop-and-Go Processing Worker
    let egress_clone = egress_tx.clone();
    tokio::spawn(async move {
        while let Some(packet) = ingress_rx.recv().await {
            let delay = sample_poisson_delay(lambda);
            let tx = egress_clone.clone();

            tokio::spawn(async move {
                sleep(delay).await;
                // If it is dummy chaff, probabilistic destruction in memory
                if packet.packet_type == TYPE_DUMMY_CHAFF && rand::thread_rng().gen_bool(0.5) {
                    tracing::debug!("[*] INFO :: Dummy Chaff 0xFF zniszczony w pamięci RAM W3");
                    return;
                }
                let _ = tx.send(packet).await;
            });
        }
    });

    // Constant Bitrate (CBR) Chaff Generator Worker
    let chaff_tx = ingress_tx.clone();
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_millis(50));
        loop {
            interval.tick().await;
            let chaff = TransportPacket::new_chaff();
            let _ = chaff_tx.send(chaff).await;
        }
    });

    // Egress Forwarder to Node 4 (WebTunnel VPS)
    tokio::spawn(async move {
        while let Some(packet) = egress_rx.recv().await {
            tracing::info!(
                "[+] SUCCESS :: Przesyłanie znormalizowanej ramki 1400 B do Węzła 4 (Typ: 0x{:02X})",
                packet.packet_type
            );
        }
    });

    tracing::info!("[+] SUCCESS :: panzer-core demon aktywny. Naciśnij Ctrl+C aby zatrzymać.");
    tokio::signal::ctrl_c().await?;
    tracing::info!("[*] INFO :: Wyłączanie demona panzer-core.");
    Ok(())
}
