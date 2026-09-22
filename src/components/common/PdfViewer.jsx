import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import './PdfViewer.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export default function PdfViewer({ src, fileName, pageCount }) {
  const bodyRef = useRef(null)
  const canvasRefs = useRef([])
  const [pdfDoc, setPdfDoc] = useState(null)
  const [numPages, setNumPages] = useState(pageCount ?? 1)
  const [activePage, setActivePage] = useState(1)
  const [zoom, setZoom] = useState(100)

  useEffect(() => {
    let cancelled = false
    setPdfDoc(null)

    pdfjsLib.getDocument({ url: src }).promise.then((pdf) => {
      if (cancelled) return
      setPdfDoc(pdf)
      setNumPages(pdf.numPages)
    })

    return () => {
      cancelled = true
    }
  }, [src])

  useEffect(() => {
    if (!pdfDoc) return undefined
    let cancelled = false

    Promise.all(
      Array.from({ length: numPages }, (_, i) =>
        pdfDoc.getPage(i + 1).then((pdfPage) => {
          if (cancelled) return
          const canvas = canvasRefs.current[i]
          if (!canvas) return
          const viewport = pdfPage.getViewport({ scale: 2.2 })
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext('2d')
          pdfPage.render({ canvasContext: ctx, viewport })
        }),
      ),
    )

    return () => {
      cancelled = true
    }
  }, [pdfDoc, numPages])

  useEffect(() => {
    const body = bodyRef.current
    if (!body) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActivePage(Number(visible.target.dataset.page))
      },
      { root: body, threshold: 0.5 },
    )

    canvasRefs.current.forEach((canvas) => canvas && observer.observe(canvas))
    return () => observer.disconnect()
  }, [numPages])

  return (
    <div className="pdf-viewer">
      <div className="pdf-viewer__head">
        <span className="pdf-viewer__icon">PDF</span>
        <div className="pdf-viewer__title">
          <strong>{fileName}</strong>
          <span>서울여자대학교 · {numPages}페이지</span>
        </div>
        <span className="pdf-viewer__page-count">
          {activePage} / {numPages}
        </span>
        <div className="pdf-viewer__zoom">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(50, z - 25))}
            disabled={zoom <= 50}
            aria-label="축소"
          >
            −
          </button>
          <span>{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(200, z + 25))}
            disabled={zoom >= 200}
            aria-label="확대"
          >
            +
          </button>
        </div>
        <a className="pdf-viewer__link" href={src} target="_blank" rel="noreferrer">
          새 창에서 보기 ↗
        </a>
        <a className="pdf-viewer__link" href={src} download={fileName}>
          다운로드 ↓
        </a>
      </div>

      <div className="pdf-viewer__body" ref={bodyRef} style={{ '--pdf-zoom': zoom / 100 }}>
        {Array.from({ length: numPages }, (_, i) => (
          <canvas
            key={i}
            data-page={i + 1}
            ref={(el) => {
              canvasRefs.current[i] = el
            }}
            className="pdf-viewer__canvas"
          />
        ))}
      </div>
    </div>
  )
}
