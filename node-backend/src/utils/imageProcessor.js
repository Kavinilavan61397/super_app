const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const processImage = async (file, options = {}) => {
  const {
    width = 800,
    height = 800,
    quality = 80,
    format = 'jpeg',
    fit = 'inside',
    position = 'center'
  } = options;

  const filename = path.basename(file.path);
  const processedFilename = `processed-${filename}`;
  const processedPath = path.join(path.dirname(file.path), processedFilename);

  try {
    // Get image metadata
    const metadata = await sharp(file.path).metadata();

    // Process image with optimization
    const processedImage = sharp(file.path)
      .resize(width, height, {
        fit,
        position,
        withoutEnlargement: true
      });

    // Apply format-specific optimizations
    if (format === 'jpeg') {
      processedImage.jpeg({ quality, progressive: true });
    } else if (format === 'png') {
      processedImage.png({ quality, compressionLevel: 9 });
    } else if (format === 'gif') {
      processedImage.gif();
    }

    // Save processed image
    await processedImage.toFile(processedPath);

    // Delete original file only if processing was successful
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Return processed file info with metadata
    return {
      ...file,
      path: processedPath,
      filename: processedFilename,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: fs.statSync(processedPath).size
      }
    };
  } catch (error) {
    console.error('Error processing image:', error);
    
    // If processing fails, keep the original file
    if (fs.existsSync(processedPath)) {
      fs.unlinkSync(processedPath);
    }
    
    throw new Error(`Image processing failed: ${error.message}`);
  }
};

// Helper function to validate image dimensions
const validateImageDimensions = async (file, minWidth = 100, minHeight = 100) => {
  try {
    const metadata = await sharp(file.path).metadata();
    if (metadata.width < minWidth || metadata.height < minHeight) {
      throw new Error(`Image dimensions too small. Minimum size is ${minWidth}x${minHeight}px`);
    }
    return true;
  } catch (error) {
    throw new Error(`Image validation failed: ${error.message}`);
  }
};

module.exports = {
  processImage,
  validateImageDimensions
}; 