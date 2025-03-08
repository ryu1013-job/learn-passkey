import antfu from '@antfu/eslint-config'

export default antfu({
  settings: {
    tailwindcss: { callees: ['cn'] },
  },
  rules: {
    'node/prefer-global/process': 'off',
    'no-alert': 'off',
  },
})
