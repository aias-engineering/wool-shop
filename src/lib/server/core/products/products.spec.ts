import { expect, test } from 'vitest'
import { getCurrency } from '.'

test('getCurrency with en should return $', async () => {
  const currency = getCurrency('en')

  expect(currency).toBe('$')
})

test.each(['nl', 'de', 'ch', undefined, ''])(
  'getCurrency with any other should return €',
  async (locale) => {
    const currency = getCurrency(locale)

    expect(currency).toBe('€')
  },
)
