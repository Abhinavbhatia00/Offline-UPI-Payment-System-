package com.demo.upimesh.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Shared SHA-256 hashing and hex-encoding utilities.
 *
 * Previously duplicated in DemoService (PIN hashing) and
 * HybridCryptoService (ciphertext hashing).
 */
public final class HashUtils {

    private HashUtils() {}

    /**
     * SHA-256 hash of the given bytes, returned as a lowercase hex string.
     */
    public static String sha256Hex(byte[] input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return bytesToHex(md.digest(input));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    /**
     * Convenience overload for hashing a UTF-8 string.
     */
    public static String sha256Hex(String input) {
        return sha256Hex(input.getBytes());
    }

    /**
     * Encode raw bytes as a lowercase hex string.
     */
    public static String bytesToHex(byte[] bytes) {
        StringBuilder hex = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }

    /**
     * Truncate a hash for log-friendly display: first 12 chars + "...".
     */
    public static String truncateHash(String hash) {
        if (hash.length() <= 12) return hash;
        return hash.substring(0, 12) + "...";
    }
}
