import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'chumzy/products'

export interface UploadedImage {
  url: string
  publicId: string
}

/**
 * Upload an image buffer to Cloudinary via a stream and resolve the hosted URL.
 * Throws if Cloudinary returns an error or an empty result.
 */
export function uploadImage(buffer: Buffer): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: uploadFolder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error)
        if (!result) return reject(new Error('Cloudinary returned no result'))
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )
    stream.end(buffer)
  })
}

export { cloudinary }
