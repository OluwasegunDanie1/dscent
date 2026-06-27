import { useRef, useState } from 'react'
import { ImagePlus, RefreshCw, X } from 'lucide-react'
import { getCloudinaryConfig, loadCloudinaryWidget } from '../services/cloudinary.js'

export default function ImageUploadButton({ images = [], onImagesChange }) {
  const [error, setError] = useState('')
  const [showFallbackInput, setShowFallbackInput] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const imagesRef = useRef(images)
  imagesRef.current = images

  async function openWidget() {
    setError('')
    setIsOpening(true)

    try {
      const { cloudName, uploadPreset } = getCloudinaryConfig()

      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary cloud name or upload preset is missing.')
      }

      const cloudinary = await loadCloudinaryWidget()

      if (!cloudinary?.createUploadWidget) {
        throw new Error('Cloudinary upload widget is unavailable.')
      }

      const widget = cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          cropping: false,
          multiple: true,
          sources: ['local', 'camera', 'url'],
          resourceType: 'image',
          showAdvancedOptions: false,
          styles: {
            palette: {
              window: '#fff7ea',
              sourceBg: '#fff7ea',
              windowBorder: '#c8994d',
              tabIcon: '#9a6b2d',
              inactiveTabIcon: '#665541',
              menuIcons: '#9a6b2d',
              link: '#9a6b2d',
              action: '#17110c',
              inProgress: '#c8994d',
              complete: '#9a6b2d',
              error: '#8e2626',
              textDark: '#17110c',
              textLight: '#fff7ea',
            },
          },
        },
        (widgetError, result) => {
          if (widgetError) {
            setError(widgetError.message || 'Upload failed. You can paste an image URL instead.')
            setShowFallbackInput(true)
            return
          }

          if (result.event === 'success') {
            onImagesChange([...imagesRef.current, result.info.secure_url])
            setShowFallbackInput(false)
            setError('')
          }
        },
      )

      widget.open()
    } catch (err) {
      setError(err.message || 'Upload failed. You can paste an image URL instead.')
      setShowFallbackInput(true)
    } finally {
      setIsOpening(false)
    }
  }

  function removeImage(indexToRemove) {
    onImagesChange(images.filter((_, index) => index !== indexToRemove))
  }

  function addFallbackUrl(url) {
    if (url.trim()) {
      onImagesChange([...images, url.trim()])
    }
  }

  return (
    <div className="image-upload">
      <div className="image-upload-preview">
        {images.length > 0 ? (
          <div className="image-upload-gallery">
            {images.map((url, index) => (
              <div className="image-upload-gallery-item" key={index}>
                <img alt={`Product image ${index + 1}`} src={url} />
                <button
                  className="image-upload-remove"
                  type="button"
                  onClick={() => removeImage(index)}
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <ImagePlus size={28} />
            <span>No images uploaded</span>
          </div>
        )}
      </div>

      <div className="image-upload-actions">
        <button className="button secondary" disabled={isOpening} type="button" onClick={openWidget}>
          <ImagePlus size={18} />
          {isOpening ? 'Opening...' : images.length > 0 ? 'Add More Images' : 'Upload Product Images'}
        </button>
        {images.length > 0 && (
          <button className="button ghost" type="button" onClick={() => onImagesChange([])}>
            Remove All
          </button>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}
      {showFallbackInput && (
        <label>
          Image URL
          <div className="image-url-row">
            <input
              name="imageUrl"
              onChange={(event) => addFallbackUrl(event.target.value)}
              placeholder="Paste image URL and press Enter"
            />
          </div>
        </label>
      )}
    </div>
  )
}
