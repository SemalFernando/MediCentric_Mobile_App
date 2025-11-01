package com.tursa.scan.service;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.FileContent;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleDriveService {

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final List<String> SCOPES = Collections.singletonList(DriveScopes.DRIVE_FILE);
    private static final String TOKENS_DIRECTORY_PATH = "tokens";

    @Value("${google.drive.folder.id:}")
    private String folderId;

    private Drive driveService;

    public GoogleDriveService() throws Exception {
        NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        this.driveService = new Drive.Builder(httpTransport, JSON_FACTORY, getCredentials(httpTransport))
                .setApplicationName("MediCentric")
                .build();
    }

    /**
     * Creates an authorized Credential object using OAuth 2.0
     */
    private Credential getCredentials(final NetHttpTransport httpTransport) throws IOException {
        // Load client secrets
        InputStream in = getClass().getClassLoader().getResourceAsStream("client_secret_267566283015-1t07qpp4erd467dbsli5a5gvusfj6ao9.apps.googleusercontent.com.json");
        if (in == null) {
            throw new FileNotFoundException("OAuth credentials file not found: oauth-credentials.json");
        }
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        // Build flow and trigger user authorization request
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                httpTransport, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();

        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();
        return new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
    }

    /**
     * Upload MultipartFile to Google Drive
     */
    public File uploadFile(MultipartFile multipartFile, String fileName, String mimeType) throws IOException {
        // Convert MultipartFile to temporary java.io.File
        java.io.File tempFile = java.io.File.createTempFile("upload-", multipartFile.getOriginalFilename());
        multipartFile.transferTo(tempFile);

        // Prepare metadata
        File fileMetadata = new File();
        fileMetadata.setName(fileName);

        // Upload to specific folder if configured
        if (folderId != null && !folderId.isEmpty()) {
            fileMetadata.setParents(Collections.singletonList(folderId));
        }

        FileContent mediaContent = new FileContent(mimeType, tempFile);

        // Upload to Drive
        File uploadedFile = driveService.files().create(fileMetadata, mediaContent)
                .setFields("id, name, webViewLink, webContentLink")
                .execute();

        // Delete temporary file
        tempFile.delete();

        return uploadedFile;
    }

    /**
     * Delete a file from Drive by its file ID
     */
    public void deleteFile(String fileId) throws IOException {
        driveService.files().delete(fileId).execute();
    }

    /**
     * Extract Google Drive file ID from a shared URL
     */
    public String extractFileIdFromUrl(String url) {
        if (url == null) return null;
        String[] parts = url.split("/d/");
        if (parts.length < 2) return null;
        String[] idParts = parts[1].split("/");
        return idParts[0];
    }

    /**
     * Get file metadata
     */
    public File getFileMetadata(String fileId) throws IOException {
        return driveService.files().get(fileId)
                .setFields("id, name, webViewLink, webContentLink, mimeType, size")
                .execute();
    }
}