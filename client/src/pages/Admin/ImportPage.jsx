import { useState } from 'react'
import './ImportPage.css'

export default function ImportPage() {
  const [jsonData, setJsonData] = useState(null)
  const [preview, setPreview] = useState(null)
  const [importResult, setImportResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('add')

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      setJsonData(data)

      // Получаем предпросмотр
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/import/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonData: data })
      })
      const previewData = await response.json()
      setPreview(previewData)
      setImportResult(null)
    } catch (error) {
      alert('Ошибка чтения файла: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    if (!jsonData) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/import/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonData,
          options: { mode, createCategories: true }
        })
      })
      const result = await response.json()
      setImportResult(result)

      if (result.success) {
        alert(`Успешно импортировано ${result.imported} товаров!`)
      }
    } catch (error) {
      alert('Ошибка импорта: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickImport = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/import/from-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'price-list-2025.json',
          options: { mode: 'replace', createCategories: true }
        })
      })
      const result = await response.json()
      setImportResult(result)

      if (result.success) {
        alert(`Успешно импортировано ${result.imported} товаров из прайс-листа!`)
      }
    } catch (error) {
      alert('Ошибка импорта: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="import-page">
      <div className="import-header">
        <h2>Импорт товаров</h2>
        <p className="import-description">
          Загрузите JSON файл с товарами или используйте быстрый импорт из прайс-листа
        </p>
      </div>

      <div className="import-actions">
        <div className="quick-import-section">
          <h3>Быстрый импорт</h3>
          <p>Импорт из data/price-list-2025.json (152 товара)</p>
          <button
            onClick={handleQuickImport}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Импорт...' : 'Импортировать прайс-лист 2025'}
          </button>
        </div>

        <div className="divider">или</div>

        <div className="file-import-section">
          <h3>Импорт из файла</h3>
          <input
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            disabled={loading}
            className="file-input"
          />
        </div>
      </div>

      {preview && (
        <div className="import-preview">
          <h3>Предпросмотр импорта</h3>
          <div className="preview-stats">
            <div className="stat-card">
              <div className="stat-value">{preview.totalProducts}</div>
              <div className="stat-label">Всего товаров</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{preview.newCategories?.length || 0}</div>
              <div className="stat-label">Новых категорий</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{preview.validationErrors?.length || 0}</div>
              <div className="stat-label">Ошибок</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{preview.exchangeRate}₽/$</div>
              <div className="stat-label">Курс обмена</div>
            </div>
          </div>

          {preview.newCategories && preview.newCategories.length > 0 && (
            <div className="new-categories">
              <strong>Будут созданы категории:</strong> {preview.newCategories.join(', ')}
            </div>
          )}

          {preview.validationErrors && preview.validationErrors.length > 0 && (
            <div className="validation-errors">
              <strong>Ошибки валидации:</strong>
              <ul>
                {preview.validationErrors.slice(0, 5).map((err, idx) => (
                  <li key={idx}>{err.product}: {err.errors.join(', ')}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="import-options">
            <label>
              <input
                type="radio"
                name="mode"
                value="add"
                checked={mode === 'add'}
                onChange={(e) => setMode(e.target.value)}
              />
              Добавить новые товары (сохранить существующие)
            </label>
            <label>
              <input
                type="radio"
                name="mode"
                value="replace"
                checked={mode === 'replace'}
                onChange={(e) => setMode(e.target.value)}
              />
              Заменить все товары (удалить существующие)
            </label>
          </div>

          <button
            onClick={handleImport}
            disabled={loading || (preview.validationErrors?.length > 0)}
            className="btn btn-success btn-large"
          >
            {loading ? 'Импорт...' : `Импортировать ${preview.totalProducts} товаров`}
          </button>
        </div>
      )}

      {importResult && (
        <div className={`import-result ${importResult.success ? 'success' : 'error'}`}>
          <h3>{importResult.success ? '✅ Импорт завершён' : '❌ Ошибка импорта'}</h3>
          <div className="result-stats">
            <div>Всего: {importResult.total}</div>
            <div>Успешно: {importResult.imported}</div>
            <div>Ошибок: {importResult.failed}</div>
          </div>

          {importResult.errors && importResult.errors.length > 0 && (
            <div className="import-errors">
              <strong>Ошибки:</strong>
              <ul>
                {importResult.errors.slice(0, 10).map((err, idx) => (
                  <li key={idx}>
                    {err.product ? `${err.product}: ${err.error || err.errors?.join(', ')}` : err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Загрузка...</p>
        </div>
      )}
    </div>
  )
}
