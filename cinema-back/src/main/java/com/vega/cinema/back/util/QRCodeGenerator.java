package com.vega.cinema.back.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.vega.cinema.back.model.Reservation;
import com.vega.cinema.back.model.ReservedSeat;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

public class QRCodeGenerator {

    public static byte[] generateReservationQRCode(Reservation reservation) {
        try {
            String qrData = generateQRData(reservation);

            ByteArrayOutputStream byteArrayOutputStream = getByteArrayOutputStream(qrData);

            return byteArrayOutputStream.toByteArray();
        } catch (Exception e) {
            return null;
        }
    }

    private static String generateQRData(Reservation reservation) {
        StringBuilder seatInfoBuilder = new StringBuilder();
        int lastRow = -1;
        int lastColumn = -1;
        for (ReservedSeat seat : reservation.getReservedSeats()) {
            int currentRow = seat.getSeatRow();
            int currentColumn = seat.getSeatColumn();
            if (lastRow != -1 && currentRow != lastRow) {
                seatInfoBuilder.append("\n");
            }
            seatInfoBuilder.append(String.format("Row: %d, Seat: %d\n", currentRow, currentColumn));
            lastRow = currentRow;
            lastColumn = currentColumn;
        }

        return String.format("""
            Reservation code: %s
            Client: %s
            
            Seats:
            %s
            """,
                reservation.getCode(),
                reservation.getUserEmail(),
                seatInfoBuilder.toString()
        );
    }

    private static ByteArrayOutputStream getByteArrayOutputStream(String qrData) throws WriterException, IOException {
        int size = 200;
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
        hints.put(EncodeHintType.CHARACTER_SET, StandardCharsets.UTF_8.name());

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(qrData, BarcodeFormat.QR_CODE, size, size, hints);

        BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "png", byteArrayOutputStream);
        return byteArrayOutputStream;
    }
}