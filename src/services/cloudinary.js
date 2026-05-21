const widgetScriptUrl = 'https://widget.cloudinary.com/v2.0/global/all.js'

let scriptPromise

export function getCloudinaryConfig() {
  return {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim(),
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim(),
  }
}

export function loadCloudinaryWidget() {
  if (window.cloudinary) {
    return Promise.resolve(window.cloudinary)
  }

  if (scriptPromise) {
    return scriptPromise
  }

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = widgetScriptUrl
    script.async = true
    script.onload = () => resolve(window.cloudinary)
    script.onerror = () => reject(new Error('Unable to load Cloudinary upload widget.'))
    document.body.appendChild(script)
  })

  return scriptPromise
}
