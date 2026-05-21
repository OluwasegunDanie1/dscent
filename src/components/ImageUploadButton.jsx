import { useState } from 'react'
import { ImagePlus, RefreshCw } from 'lucide-react'
import { getCloudinaryConfig, loadCloudinaryWidget } from '../services/cloudinary.js'

export default function ImageUploadButton({ imageUrl, onImageChange }) {
  const [error, setError] = useState('')
  const [showFallbackInput, setShowFallbackInput] = useState(false)
  const [isOpening, setIsOpening] = useState(false)

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
          multiple: false,
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
            onImageChange(result.info.secure_url)
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

  return (
    <div className="image-upload">
      <div className="image-upload-preview">
        {imageUrl ? (
          <img alt="Product preview" src={imageUrl} />
        ) : (
          <div>
            <ImagePlus size={28} />
            <span>No image uploaded</span>
          </div>
        )}
      </div>

      <div className="image-upload-actions">
        <button className="button secondary" disabled={isOpening} type="button" onClick={openWidget}>
          {imageUrl ? <RefreshCw size={18} /> : <ImagePlus size={18} />}
          {isOpening ? 'Opening...' : imageUrl ? 'Change Image' : 'Upload Product Image'}
        </button>
        {imageUrl && (
          <button className="button ghost" type="button" onClick={() => onImageChange('')}>
            Remove
          </button>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}
      {showFallbackInput && (
        <label>
          Image URL
          <input
            name="imageUrl"
            onChange={(event) => onImageChange(event.target.value)}
            placeholder="Paste image URL"
            value={imageUrl ?? ''}
          />
        </label>
      )}
    </div>
  )
}
