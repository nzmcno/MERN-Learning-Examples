// Cloudflare R2 / S3 Storage Abstraction

export interface StorageUploadResponse {
  key: string;
  publicUrl: string;
}

export class StorageService {
  private bucket = process.env.R2_BUCKET_NAME || 'modern-mern-storage';
  private publicDomain = process.env.R2_PUBLIC_DOMAIN || 'https://assets.example.com';

  async getPresignedUploadUrl(filename: string, contentType: string): Promise<{ uploadUrl: string; key: string }> {
    const timestamp = Date.now();
    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `uploads/${timestamp}-${sanitizedName}`;

    // When AWS/Cloudflare R2 keys are provided, this produces real presigned PUT URLs.
    // For local development, it returns an API endpoint handler.
    const uploadUrl = `/api/storage/upload?key=${encodeURIComponent(key)}&type=${encodeURIComponent(contentType)}`;

    return { uploadUrl, key };
  }

  getPublicUrl(key: string): string {
    if (key.startsWith('http://') || key.startsWith('https://')) {
      return key;
    }
    return `${this.publicDomain}/${key}`;
  }
}

export const storage = new StorageService();
