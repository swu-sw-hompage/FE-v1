// 휴대폰 원본 사진(5712×4284, 3~11MB)을 그대로 올리면 행사 페이지 하나가 수십 MB가 된다.
// 올리기 전에 브라우저에서 긴 변 MAX_SIDE 이하 JPEG로 줄인다. 이미 작은 사진은 그대로 둔다.
const MAX_SIDE = 1920
const QUALITY = 0.82
const SMALL_ENOUGH_BYTES = 800 * 1024

export async function resizeImage(file) {
  let bitmap
  try {
    // 세로로 찍은 사진이 눕지 않도록 EXIF 방향을 반영해서 읽는다.
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    return file
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && file.size <= SMALL_ENOUGH_BYTES) {
    bitmap.close()
    return file
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  // PNG의 투명한 부분이 JPEG에서 검게 나오지 않게 흰 바탕을 깐다.
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITY))
  if (!blob || blob.size >= file.size) return file

  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
  return new File([blob], name, { type: 'image/jpeg', lastModified: file.lastModified })
}
