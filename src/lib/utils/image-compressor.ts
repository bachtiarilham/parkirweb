/**
 * Browser-native client-side image compression utility.
 * Optimizes camera captures and gallery uploads by downscaling dimensions
 * and applying adaptive JPEG/WebP compression using HTML5 Canvas.
 */

export interface CompressOptions {
	/**
	 * Maximum width or height in pixels.
	 * Default: 1280px (Optimal for FastALPR OCR and responsive mobile screens).
	 */
	maxDimension?: number;

	/**
	 * Output compression quality from 0.0 to 1.0.
	 * Default: 0.75 (Best trade-off between optical OCR sharpness and low payload).
	 */
	quality?: number;

	/**
	 * Output MIME type.
	 * Default: 'image/jpeg'
	 */
	mimeType?: 'image/jpeg' | 'image/webp';
}

export interface CompressionResult {
	blob: Blob;
	originalSize: number;
	compressedSize: number;
	width: number;
	height: number;
	reductionPercent: number;
}

/**
 * Formats byte size into human readable string (e.g. "145.2 KB", "1.2 MB").
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Compresses an image File, Blob, HTMLCanvasElement, or HTMLVideoElement.
 */
export async function compressImage(
	source: File | Blob | HTMLCanvasElement | HTMLVideoElement,
	options: CompressOptions = {}
): Promise<CompressionResult> {
	const maxDim = options.maxDimension ?? 1280;
	const quality = options.quality ?? 0.75;
	const mimeType = options.mimeType ?? 'image/jpeg';

	let originalSize = 0;

	// Case 1: Source is an HTMLCanvasElement directly
	if (typeof HTMLCanvasElement !== 'undefined' && source instanceof HTMLCanvasElement) {
		const originalWidth = source.width;
		const originalHeight = source.height;

		let targetWidth = originalWidth;
		let targetHeight = originalHeight;

		if (Math.max(targetWidth, targetHeight) > maxDim) {
			const scale = maxDim / Math.max(targetWidth, targetHeight);
			targetWidth = Math.round(targetWidth * scale);
			targetHeight = Math.round(targetHeight * scale);
		}

		let workingCanvas = source;
		if (targetWidth !== originalWidth || targetHeight !== originalHeight) {
			workingCanvas = document.createElement('canvas');
			workingCanvas.width = targetWidth;
			workingCanvas.height = targetHeight;
			const ctx = workingCanvas.getContext('2d');
			if (ctx) {
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = 'high';
				ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
			}
		}

		const compressedBlob = await new Promise<Blob>((resolve, reject) => {
			workingCanvas.toBlob(
				(b) => {
					if (b) resolve(b);
					else reject(new Error('Canvas compression to Blob failed'));
				},
				mimeType,
				quality
			);
		});

		originalSize = compressedBlob.size;
		return {
			blob: compressedBlob,
			originalSize,
			compressedSize: compressedBlob.size,
			width: targetWidth,
			height: targetHeight,
			reductionPercent: 0
		};
	}

	// Case 2: Source is an HTMLVideoElement (frame capture directly)
	if (typeof HTMLVideoElement !== 'undefined' && source instanceof HTMLVideoElement) {
		const originalWidth = source.videoWidth || 1280;
		const originalHeight = source.videoHeight || 720;

		let targetWidth = originalWidth;
		let targetHeight = originalHeight;

		if (Math.max(targetWidth, targetHeight) > maxDim) {
			const scale = maxDim / Math.max(targetWidth, targetHeight);
			targetWidth = Math.round(targetWidth * scale);
			targetHeight = Math.round(targetHeight * scale);
		}

		const canvas = document.createElement('canvas');
		canvas.width = targetWidth;
		canvas.height = targetHeight;
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Failed to create 2D canvas context for video capture');
		}

		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
		ctx.drawImage(source, 0, 0, targetWidth, targetHeight);

		const compressedBlob = await new Promise<Blob>((resolve, reject) => {
			canvas.toBlob(
				(b) => {
					if (b) resolve(b);
					else reject(new Error('Video frame compression to Blob failed'));
				},
				mimeType,
				quality
			);
		});

		return {
			blob: compressedBlob,
			originalSize: compressedBlob.size,
			compressedSize: compressedBlob.size,
			width: targetWidth,
			height: targetHeight,
			reductionPercent: 0
		};
	}

	// Case 3: Source is File or Blob
	const blobSource = source as Blob;
	originalSize = blobSource.size;

	const objectUrl = URL.createObjectURL(blobSource);

	try {
		const img = await new Promise<HTMLImageElement>((resolve, reject) => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = (err) => reject(new Error(`Failed to load image: ${err}`));
			image.src = objectUrl;
		});

		let targetWidth = img.naturalWidth || img.width;
		let targetHeight = img.naturalHeight || img.height;

		if (Math.max(targetWidth, targetHeight) > maxDim) {
			const scale = maxDim / Math.max(targetWidth, targetHeight);
			targetWidth = Math.round(targetWidth * scale);
			targetHeight = Math.round(targetHeight * scale);
		}

		const canvas = document.createElement('canvas');
		canvas.width = targetWidth;
		canvas.height = targetHeight;
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Failed to create 2D canvas context');
		}

		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
		ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

		const compressedBlob = await new Promise<Blob>((resolve, reject) => {
			canvas.toBlob(
				(b) => {
					if (b) resolve(b);
					else reject(new Error('Canvas to Blob export failed'));
				},
				mimeType,
				quality
			);
		});

		const compressedSize = compressedBlob.size;
		const reductionPercent =
			originalSize > 0
				? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
				: 0;

		return {
			blob: compressedBlob,
			originalSize,
			compressedSize,
			width: targetWidth,
			height: targetHeight,
			reductionPercent
		};
	} finally {
		URL.revokeObjectURL(objectUrl);
	}
}
