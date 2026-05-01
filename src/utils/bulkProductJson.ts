import JSON5 from 'json5'

import { PRODUCT_CATEGORIES, type ProductCategory } from '../constants/productCategories'
import type { CreateProductBody } from '../services/productServices'

const CATEGORY_SET = new Set<string>(PRODUCT_CATEGORIES)

/** Turn `category: ELECTRONICS` into `category: "ELECTRONICS"` before JSON5 parse. */
function quoteCategoryEnumValues(text: string): string {
  const alt = PRODUCT_CATEGORIES.join('|')
  const re = new RegExp(`(category\\s*:\\s*)(${alt})\\b`, 'gi')
  return text.replace(re, '$1"$2"')
}

function stripTrailingCommas(s: string): string {
  let out = s
  let prev = ''
  while (out !== prev) {
    prev = out
    out = out.replace(/,(\s*[}\]])/g, '$1')
  }
  return out
}

function normalizeToArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data
  if (data !== null && typeof data === 'object') return [data]
  throw new Error('Input must be a JSON array or a single object.')
}

/**
 * Parses textarea contents: JSON or JSON5, optional outer `[ ]`,
 * trailing commas, single-quoted strings, unquoted keys.
 * Multiple objects can be `{...},{...}` or `[{...},{...}]`.
 */
export function parseBulkProductInput(raw: string): unknown[] {
  const trimmed = raw.trim()
  if (!trimmed) {
    throw new Error('Paste at least one product object.')
  }

  let toParse = quoteCategoryEnumValues(trimmed)
  toParse = stripTrailingCommas(toParse)

  const wrapped = toParse.startsWith('[') ? toParse : `[${toParse}]`

  let data: unknown
  try {
    data = JSON5.parse(wrapped)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Parse error'
    throw new Error(`Could not parse input: ${msg}`)
  }

  return normalizeToArray(data)
}

export function validateBulkProductItem(
  raw: unknown,
  index: number,
): CreateProductBody {
  const n = index + 1

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(`Item ${n}: expected an object.`)
  }

  const o = raw as Record<string, unknown>

  const name = o.name
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error(`Item ${n}: "name" must be a non-empty string.`)
  }

  const description = o.description
  if (typeof description !== 'string' || !description.trim()) {
    throw new Error(`Item ${n}: "description" must be a non-empty string.`)
  }

  const actualRaw = o.actualPrice
  let actualNum: number
  if (typeof actualRaw === 'number') {
    actualNum = actualRaw
  } else if (typeof actualRaw === 'string') {
    actualNum = Number.parseFloat(actualRaw.trim())
  } else {
    throw new Error(`Item ${n}: "actualPrice" must be a number.`)
  }
  if (!Number.isFinite(actualNum) || actualNum < 0) {
    throw new Error(
      `Item ${n}: "actualPrice" must be a valid non-negative number.`,
    )
  }

  let offerNum: number | null = null
  if (o.offerPrice !== undefined && o.offerPrice !== null && o.offerPrice !== '') {
    if (typeof o.offerPrice === 'number') {
      offerNum = o.offerPrice
    } else if (typeof o.offerPrice === 'string') {
      const t = o.offerPrice.trim()
      if (t === '') offerNum = null
      else offerNum = Number.parseFloat(t)
    } else {
      throw new Error(`Item ${n}: "offerPrice" must be a number or null.`)
    }
    if (
      offerNum !== null &&
      (!Number.isFinite(offerNum) || offerNum < 0)
    ) {
      throw new Error(
        `Item ${n}: "offerPrice" must be a valid non-negative number.`,
      )
    }
  }

  const catRaw = o.category
  let categoryStr: string
  if (typeof catRaw === 'string') {
    categoryStr = catRaw.trim().toUpperCase()
  } else {
    throw new Error(`Item ${n}: "category" must be a string or enum value.`)
  }

  if (!CATEGORY_SET.has(categoryStr)) {
    throw new Error(
      `Item ${n}: unknown category "${categoryStr}". Use a value from ProductCategory.`,
    )
  }

  return {
    name: name.trim(),
    description: description.trim(),
    actualPrice: actualNum,
    offerPrice: offerNum,
    category: categoryStr as ProductCategory,
  }
}
