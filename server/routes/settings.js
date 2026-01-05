import express from 'express'
import { dbAll, dbGet, dbRun } from '../database/init.js'

const router = express.Router()

// ==================== EDUCATION ====================

// GET all education materials
router.get('/education', (req, res) => {
  try {
    const education = dbAll('SELECT * FROM education WHERE is_active = 1 ORDER BY sort_order ASC')
    res.json(education)
  } catch (error) {
    console.error('Error fetching education:', error)
    res.status(500).json({ error: 'Failed to fetch education materials' })
  }
})

// GET all education (including inactive) for admin
router.get('/education/all', (req, res) => {
  try {
    const education = dbAll('SELECT * FROM education ORDER BY sort_order ASC')
    res.json(education)
  } catch (error) {
    console.error('Error fetching education:', error)
    res.status(500).json({ error: 'Failed to fetch education materials' })
  }
})

// POST new education material
router.post('/education', (req, res) => {
  try {
    const { title, description, link, image_url, sort_order, is_active } = req.body
    const result = dbRun(
      'INSERT INTO education (title, description, link, image_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description || '', link || '', image_url || '', sort_order || 0, is_active !== false ? 1 : 0]
    )
    res.json({ id: result.lastInsertRowid, message: 'Education material created' })
  } catch (error) {
    console.error('Error creating education:', error)
    res.status(500).json({ error: 'Failed to create education material' })
  }
})

// PUT update education material
router.put('/education/:id', (req, res) => {
  try {
    const { id } = req.params
    const { title, description, link, image_url, sort_order, is_active } = req.body
    dbRun(
      'UPDATE education SET title = ?, description = ?, link = ?, image_url = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [title, description || '', link || '', image_url || '', sort_order || 0, is_active ? 1 : 0, id]
    )
    res.json({ message: 'Education material updated' })
  } catch (error) {
    console.error('Error updating education:', error)
    res.status(500).json({ error: 'Failed to update education material' })
  }
})

// DELETE education material
router.delete('/education/:id', (req, res) => {
  try {
    const { id } = req.params
    dbRun('DELETE FROM education WHERE id = ?', [id])
    res.json({ message: 'Education material deleted' })
  } catch (error) {
    console.error('Error deleting education:', error)
    res.status(500).json({ error: 'Failed to delete education material' })
  }
})

// ==================== SOCIAL LINKS ====================

// GET all active social links
router.get('/social', (req, res) => {
  try {
    const links = dbAll('SELECT * FROM social_links WHERE is_active = 1 ORDER BY sort_order ASC')
    res.json(links)
  } catch (error) {
    console.error('Error fetching social links:', error)
    res.status(500).json({ error: 'Failed to fetch social links' })
  }
})

// GET all social links for admin
router.get('/social/all', (req, res) => {
  try {
    const links = dbAll('SELECT * FROM social_links ORDER BY sort_order ASC')
    res.json(links)
  } catch (error) {
    console.error('Error fetching social links:', error)
    res.status(500).json({ error: 'Failed to fetch social links' })
  }
})

// POST new social link
router.post('/social', (req, res) => {
  try {
    const { name, icon, url, sort_order, is_active } = req.body
    const result = dbRun(
      'INSERT INTO social_links (name, icon, url, sort_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [name, icon, url, sort_order || 0, is_active !== false ? 1 : 0]
    )
    res.json({ id: result.lastInsertRowid, message: 'Social link created' })
  } catch (error) {
    console.error('Error creating social link:', error)
    res.status(500).json({ error: 'Failed to create social link' })
  }
})

// PUT update social link
router.put('/social/:id', (req, res) => {
  try {
    const { id } = req.params
    const { name, icon, url, sort_order, is_active } = req.body
    dbRun(
      'UPDATE social_links SET name = ?, icon = ?, url = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [name, icon, url, sort_order || 0, is_active ? 1 : 0, id]
    )
    res.json({ message: 'Social link updated' })
  } catch (error) {
    console.error('Error updating social link:', error)
    res.status(500).json({ error: 'Failed to update social link' })
  }
})

// DELETE social link
router.delete('/social/:id', (req, res) => {
  try {
    const { id } = req.params
    dbRun('DELETE FROM social_links WHERE id = ?', [id])
    res.json({ message: 'Social link deleted' })
  } catch (error) {
    console.error('Error deleting social link:', error)
    res.status(500).json({ error: 'Failed to delete social link' })
  }
})

// ==================== CONTACTS ====================

// GET all contacts
router.get('/contacts', (req, res) => {
  try {
    const contacts = dbAll('SELECT * FROM contacts')
    // Convert to object format for easy access
    const contactsObj = {}
    contacts.forEach(c => {
      contactsObj[c.key] = c.value
    })
    res.json(contactsObj)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
})

// GET contacts as array for admin
router.get('/contacts/all', (req, res) => {
  try {
    const contacts = dbAll('SELECT * FROM contacts ORDER BY id ASC')
    res.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
})

// PUT update contact
router.put('/contacts/:key', (req, res) => {
  try {
    const { key } = req.params
    const { value, label } = req.body

    const existing = dbGet('SELECT * FROM contacts WHERE key = ?', [key])
    if (existing) {
      dbRun('UPDATE contacts SET value = ?, label = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?',
        [value, label || existing.label, key])
    } else {
      dbRun('INSERT INTO contacts (key, value, label) VALUES (?, ?, ?)', [key, value, label || key])
    }

    res.json({ message: 'Contact updated' })
  } catch (error) {
    console.error('Error updating contact:', error)
    res.status(500).json({ error: 'Failed to update contact' })
  }
})

// PUT bulk update contacts
router.put('/contacts', (req, res) => {
  try {
    const contacts = req.body

    Object.entries(contacts).forEach(([key, value]) => {
      const existing = dbGet('SELECT * FROM contacts WHERE key = ?', [key])
      if (existing) {
        dbRun('UPDATE contacts SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?', [value, key])
      } else {
        dbRun('INSERT INTO contacts (key, value, label) VALUES (?, ?, ?)', [key, value, key])
      }
    })

    res.json({ message: 'Contacts updated' })
  } catch (error) {
    console.error('Error updating contacts:', error)
    res.status(500).json({ error: 'Failed to update contacts' })
  }
})

export default router
