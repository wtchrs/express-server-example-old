const fortuneCookies = [
  'Conquer your fears of they will conquer you.',
  'Ribers need springs.',
  "Do not fear what you don't know.",
  'You will have a pleasant surprise.',
  'Whenever possible, keep it simple.',
]

/**
 * Returns a random fortune cookie message.
 *
 * @return {string}
 */
export default function e(): string {
  return fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)]
}
