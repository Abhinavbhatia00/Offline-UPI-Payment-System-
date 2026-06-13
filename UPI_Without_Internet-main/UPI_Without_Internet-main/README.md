# UPI Offline Mesh

A proof-of-concept system that enables UPI-style digital payments without internet connectivity. Instead of relying on a direct connection to the payment server, transactions are securely routed through nearby devices in a mesh network until a node with internet access becomes available. The system focuses on secure transmission, exactly-once settlement, and protection against replay attacks.

## Features

* Offline transaction routing through mesh-connected devices
* End-to-end encrypted payment packets
* Secure bridge-node synchronization
* Exactly-once transaction settlement
* Replay attack protection
* Real-time transaction visualization dashboard
* Spring Boot backend with concurrent processing support

## Architecture

1. A sender creates a payment request.
2. The request is encrypted and forwarded through nearby devices.
3. Intermediate devices relay packets without accessing payment details.
4. A bridge node with internet connectivity uploads the packet to the server.
5. The server validates, decrypts, and settles the transaction exactly once.

## Technical Challenges & Solutions

### 1. Untrusted Intermediate Devices

**Problem:**
Transactions may pass through devices owned by strangers. These devices must not be able to read or modify payment data.

**Solution:**
A hybrid encryption scheme combining **RSA-OAEP** and **AES-256-GCM** is used.

* A fresh AES-256 key is generated for every transaction.
* The payment payload is encrypted using AES-GCM.
* The AES key is encrypted using the server's RSA public key.
* The packet contains the RSA-encrypted AES key, IV, and authenticated ciphertext.

AES-GCM provides authenticated encryption, ensuring that any modification to the ciphertext is detected during decryption. Only the server can decrypt the payload, making intermediaries blind relays.

---

### 2. Duplicate Settlement Storm

**Problem:**
Multiple bridge nodes may upload the same payment packet simultaneously, potentially causing duplicate settlements.

**Solution:**
The server computes a SHA-256 hash of the ciphertext and performs an atomic claim using `ConcurrentHashMap.putIfAbsent()`.

Only the first request successfully claims the hash and proceeds to settlement. All subsequent uploads of the same packet are immediately discarded as duplicates.

Additional protection is provided through a unique database constraint on `packet_hash`, ensuring duplicate settlements cannot occur even if the cache layer fails.

---

### 3. Replay Attacks

**Problem:**
An attacker could capture a valid encrypted payment packet and replay it later.

**Solution:**
Two protection layers are implemented:

1. **Freshness Validation**

   * Each encrypted payload contains a `signedAt` timestamp.
   * Packets older than 24 hours are rejected.

2. **Unique Nonces**

   * Every transaction contains a randomly generated UUID nonce.
   * Legitimate repeated payments generate different ciphertexts.
   * Replays produce identical ciphertexts and are detected by the idempotency layer.

Together, these mechanisms prevent both delayed packet replays and duplicate transaction processing.

## Tech Stack

* Java
* Spring Boot
* Maven
* Thymeleaf
* AES-256-GCM
* RSA-OAEP
* JPA / Hibernate
* H2 Database
* ConcurrentHashMap-based Idempotency Layer

This project demonstrates how secure digital payments can be executed in low-connectivity environments while maintaining confidentiality, integrity, and exactly-once settlement guarantees.
